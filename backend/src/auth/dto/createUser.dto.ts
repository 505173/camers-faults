import { IsString } from 'class-validator';

export class CreateuserDto {
  @IsString()
  tgUsername: string;

  @IsString()
  hashedPassword: string;

  @IsString()
  refreshToken: string;
}
