import { Controller, Post, Body, Delete } from '@nestjs/common';
import { EmulatorService } from './emulator.service';

@Controller('emulator')
export class EmulatorController {
  constructor(private readonly emulatorService: EmulatorService) {}

  @Post('apply')
  apply(@Body() dto: { delay: number; jitter: number; loss: number }) {
    return this.emulatorService.applyNetworkEmulation(
      dto.delay,
      dto.jitter,
      dto.loss,
    );
  }

  @Delete('clear')
  clear() {
    return this.emulatorService.clearEmulation();
  }

  @Post('test')
  test(@Body() dto: { rtspUrl: string; duration?: number }) {
    return this.emulatorService.testRtspStream(dto.rtspUrl, dto.duration);
  }
}
