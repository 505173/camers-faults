import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CamerasModule } from './cameras/cameras.module';
import { TelegramModule } from './telegram/telegram.module';
import { CheckModule } from './check/check.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, CamerasModule, TelegramModule, CheckModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
