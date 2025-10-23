import { Module } from '@nestjs/common';
import { EmulatorService } from './emulator.service';
import { EmulatorController } from './emulator.controller';

@Module({
  controllers: [EmulatorController],
  providers: [EmulatorService],
})
export class EmulatorModule {}
