import { Module } from '@nestjs/common';
import { CheckService } from './check.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CheckService]
})
export class CheckModule {}
