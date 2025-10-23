import { IsEnum, IsString } from 'class-validator';
import { CameraStatus } from './createCamera.dto';

export class UpdateCameraDto {
  @IsString()
  name?: string;

  @IsString()
  ip?: string;

  @IsString()
  location?: string;

  @IsEnum(CameraStatus)
  status?: CameraStatus;
}
