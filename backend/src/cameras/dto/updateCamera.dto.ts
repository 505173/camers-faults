import { IsEnum, IsString } from 'class-validator';

enum CameraStatus {
  WORKS = 'WORKS',
  DOESNT_WORK = 'DOESNT_WORK',
  WORKS_INTERMITTENTLY = 'WORKS_INTERMITTENTLY',
}

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
