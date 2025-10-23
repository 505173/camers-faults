import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class EmulatorService {
  private readonly logger = new Logger(EmulatorService.name);

  async applyNetworkEmulation(
    delayMs: number,
    jitterMs: number,
    lossPercent: number,
  ) {
    const cmd = `sudo tc qdisc replace dev eth0 root netem delay ${delayMs}ms ${jitterMs}ms loss ${lossPercent}%`;
    this.logger.log(`Applying network emulation: ${cmd}`);
    try {
      await execAsync(cmd);
      return { success: true, message: 'Network emulation applied.' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, error: error.message };
    }
  }

  async clearEmulation() {
    const cmd = `sudo tc qdisc del dev eth0 root || true`;
    this.logger.log('Clearing network emulation');
    try {
      await execAsync(cmd);
      return { success: true, message: 'Network emulation cleared.' };
    } catch (error) {
      this.logger.error(error);
      return { success: false, error: error.message };
    }
  }

  async testRtspStream(rtspUrl: string, durationSec = 10) {
    const cmd = `ffmpeg -i "${rtspUrl}" -t ${durationSec} -f null -`;
    this.logger.log(`Testing RTSP stream: ${cmd}`);
    try {
      const { stderr } = await execAsync(cmd);
      // Пример: можно парсить stderr для анализа потерь фреймов
      const frameDrops = (stderr.match(/frame=\s*\d+/g) || []).length;
      return {
        success: true,
        message: `Stream tested for ${durationSec}s`,
        framesDetected: frameDrops,
        rawLog: stderr,
      };
    } catch (error) {
      this.logger.error(error);
      return { success: false, error: error.message };
    }
  }
}
