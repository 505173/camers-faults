import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(tgUsername: string, hashedPassword: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        tgUsername,
      },
    });
    if (!user) {
      return { success: false, message: 'Пользователь не найден' };
    }

    if (user.hashedPassword !== hashedPassword) {
      return { success: false, message: 'Неверный пароль' };
    }

    const payload = { tgUsername: user.tgUsername };
    const token = await this.jwtService.signAsync(payload);

    return {
      success: true,
      message: 'Вход успешно выполнен',
      token,
      token_expires_in: '7d',
    };
  }
}
