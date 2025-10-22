import { Module } from '@nestjs/common';
import { CheckService } from './check.service';

@Module({
  providers: [CheckService]
})
export class CheckModule {}
