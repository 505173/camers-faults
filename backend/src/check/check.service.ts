import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { spawn } from 'child_process';
import { PrismaService } from 'src/prisma/prisma.service';
import { CameraStatus, CheckStatus } from 'src/types';

@Injectable()
export class CheckService {
  private readonly logger = new Logger(CheckService.name);

  // thresholds
  private LOSS_THRESHOLD = 1.0; // percent
  private RTT_THRESHOLD = 150; // ms
  private JITTER_THRESHOLD = 30; // ms
  private BAD_STREAK_THRESHOLD = 3; // consecutive bad checks before alert

  private badStreaks: Map<string, number> = new Map(); // changed to string for cameraId

  constructor(private readonly prismaService: PrismaService) {}

  // Cron: every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.log('Starting monitoring cycle');
    const cameras = await this.prismaService.camera.findMany();

    for (const camera of cameras) {
      try {
        const res = await this.pingHost(camera.ip, 4, 2);

        const isBad =
          res.loss > this.LOSS_THRESHOLD ||
          res.avg > this.RTT_THRESHOLD ||
          res.stddev > this.JITTER_THRESHOLD;

        const status = isBad ? CheckStatus.BAD : CheckStatus.GOOD;

        // Create check with proper field names and status
        const check = await this.prismaService.check.create({
          data: {
            cameraId: camera.id,
            avgRttsMs: res.avg, // fixed field name
            jitterMs: res.stddev,
            lossPct: res.loss,
            status: status,
          },
          include: {
            Error: true,
          },
        });

        // Add error record if check is bad
        if (isBad) {
          const errorMessages: string[] = [];
          if (res.loss > this.LOSS_THRESHOLD) {
            errorMessages.push(
              `Packet loss: ${res.loss.toFixed(1)}% (threshold: ${this.LOSS_THRESHOLD}%)`,
            );
          }
          if (res.avg > this.RTT_THRESHOLD) {
            errorMessages.push(
              `High latency: ${res.avg.toFixed(1)}ms (threshold: ${this.RTT_THRESHOLD}ms)`,
            );
          }
          if (res.stddev > this.JITTER_THRESHOLD) {
            errorMessages.push(
              `High jitter: ${res.stddev.toFixed(1)}ms (threshold: ${this.JITTER_THRESHOLD}ms)`,
            );
          }

          await this.prismaService.error.create({
            data: {
              checkId: check.id,
              message: errorMessages.join('; '),
            },
          });
        }

        // Handle bad streaks and camera status updates
        const curStreak = this.badStreaks.get(camera.id) ?? 0;

        if (isBad) {
          const newStreak = curStreak + 1;
          this.badStreaks.set(camera.id, newStreak);

          this.logger.warn(
            `Camera ${camera.ip} metric outside: loss=${res.loss}%, avg=${res.avg}ms, jitter=${res.stddev}ms (streak ${newStreak})`,
          );

          // Update camera status based on streak
          let newCameraStatus: CameraStatus;
          if (newStreak >= this.BAD_STREAK_THRESHOLD) {
            newCameraStatus = CameraStatus.DOESNT_WORK;
            // send alert via telegram
            // await this.telegram.sendAlert(...);
            this.badStreaks.set(camera.id, 0); // reset streak after alert
          } else {
            newCameraStatus = CameraStatus.WORKS_INTERMITTENTLY;
          }

          await this.prismaService.camera.update({
            where: { id: camera.id },
            data: { status: newCameraStatus },
          });
        } else {
          // Camera is working fine
          if (curStreak > 0) {
            this.badStreaks.set(camera.id, 0);
            // await this.telegram.sendAlert(...); // recovery notification
          }

          // Update camera status to WORKS if it was problematic before
          if (camera.status !== CameraStatus.WORKS) {
            await this.prismaService.camera.update({
              where: { id: camera.id },
              data: { status: CameraStatus.WORKS },
            });
          }
        }
      } catch (err) {
        this.logger.error(`Error checking camera ${camera.ip}`, err);

        // Create a failed check record with error
        try {
          const failedCheck = await this.prismaService.check.create({
            data: {
              cameraId: camera.id,
              avgRttsMs: 0,
              jitterMs: 0,
              lossPct: 100,
              status: CheckStatus.BAD,
            },
          });

          await this.prismaService.error.create({
            data: {
              checkId: failedCheck.id,
              message: `Monitoring error: ${err instanceof Error ? err.message : String(err)}`,
            },
          });

          // Update camera status to reflect failure
          await this.prismaService.camera.update({
            where: { id: camera.id },
            data: { status: CameraStatus.DOESNT_WORK },
          });
        } catch (dbError) {
          this.logger.error('Failed to create error record', dbError);
        }
      }
    }
    this.logger.log('Monitoring cycle finished');
  }

  // Uses system ping command via spawn, parses output (Linux 'ping' output)
  async pingHost(
    host: string,
    count = 4,
    timeoutSec = 2,
  ): Promise<{
    avg: number;
    min: number;
    max: number;
    stddev: number;
    loss: number;
  }> {
    return new Promise((resolve, reject) => {
      const args = ['-c', String(count), '-W', String(timeoutSec), host];
      const p = spawn('ping', args);
      let out = '';
      let err = '';
      p.stdout.on('data', (d) => (out += d.toString()));
      p.stderr.on('data', (d) => (err += d.toString()));
      p.on('close', (code) => {
        if (code !== 0 && !out) {
          return reject(new Error(`ping failed: ${err}`));
        }
        try {
          // parse packet loss from "X packets transmitted, Y received, Z% packet loss"
          const lossMatch = out.match(/, ([0-9.]+)% packet loss/);
          const loss = lossMatch ? parseFloat(lossMatch[1]) : 100;
          // parse rtt line: rtt min/avg/max/mdev = 0.123/0.456/0.789/0.012 ms
          const rttMatch = out.match(
            /rtt.* = ([0-9.]+)\/([0-9.]+)\/([0-9.]+)\/([0-9.]+) ms/,
          );
          let min = 0,
            avg = 0,
            max = 0,
            mdev = 0;
          if (rttMatch) {
            min = parseFloat(rttMatch[1]);
            avg = parseFloat(rttMatch[2]);
            max = parseFloat(rttMatch[3]);
            mdev = parseFloat(rttMatch[4]);
          }
          // We use mdev as jitter estimate (stddev)
          resolve({ avg, min, max, stddev: mdev, loss });
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
