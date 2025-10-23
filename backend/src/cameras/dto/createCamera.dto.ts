import { IsEnum, IsString } from 'class-validator';
import { CameraStatus } from '../../cameras.types';

export class CreateCameraDto {
  @IsString()
  name: string;

  @IsString()
  ip: string;

  @IsString()
  location: string;

  @IsEnum(CameraStatus)
  status: CameraStatus;
}
export { CameraStatus };

