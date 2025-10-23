import { CamerasService } from './cameras.service';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CameraStatus } from '../cameras.types';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}

  @Get('')
  async getCameras(@Query('status') status?: CameraStatus) {
    return this.camerasService.getAllCameras(status);
  }

  @Get('/camera/:id')
  async getCamera(@Param('id') id: string) {
    return this.getCamera(id);
  }
}
