import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateCheckDto {
  @IsString()
  cameraId: string;

  @IsDate()
  checkedAt: Date;

  @IsNumber()
  avgRttsMs: number;

  @IsNumber()
  jitterMs: number;

  @IsNumber()
  lossPct: number;

  @IsArray()
  @IsString({ each: true })
  errors: string[];
}
