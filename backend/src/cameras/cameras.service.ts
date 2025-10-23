import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCameraDto } from './dto/createCamera.dto';
import { UpdateCameraDto } from './dto/updateCamera.dto';

enum CameraStatus {
  WORKS = 'WORKS',
  DOESNT_WORK = 'DOESNT_WORK',
  WORKS_INTERMITTENTLY = 'WORKS_INTERMITTENTLY',
}

@Injectable()
export class CamerasService {
  constructor(private readonly prismaService: PrismaService) {}

  async addCamera(
    name: string,
    ip: string,
    location: string,
    status: CameraStatus,
  ) {
    const dto: CreateCameraDto = {
      name,
      ip,
      location,
      status,
    };

    const result = await this.saveCamera(dto);

    return result;
  }

  private async saveCamera(dto: CreateCameraDto) {
    const cameraName = await this.prismaService.camera.findFirst({
      where: {
        name: dto.name,
      },
    });
    if (cameraName) {
      return {
        success: false,
        message: 'Камера с таким именем уже существует',
      };
    }

    const cameraIp = await this.prismaService.camera.findFirst({
      where: {
        ip: dto.ip,
      },
    });
    if (cameraIp) {
      return {
        success: false,
        message: 'Камера с таким IP уже существует',
      };
    }

    await this.prismaService.camera.create({
      data: {
        ...dto,
      },
    });

    return { success: true, message: 'Камера успешно добавлена' };
  }

  async getAllCameras() {
    const cameras = await this.prismaService.camera.findMany();

    return { success: true, cameras };
  }

  async getCamera(id: string) {
    const camera = await this.prismaService.camera.findUnique({
      where: {
        id,
      },
    });

    if (!camera) {
      return { success: false, message: 'Такой камеры не существует' };
    }

    return { success: true, camera };
  }

  async updateCamera(
    id: string,
    name?: string,
    ip?: string,
    location?: string,
    status?: CameraStatus,
  ) {
    const dto: UpdateCameraDto = {
      name,
      ip,
      location,
      status,
    };

    const result = await this.saveUpdateCamera(id, dto);
    return result;
  }

  private async saveUpdateCamera(id: string, dto: UpdateCameraDto) {
    const camera = await this.prismaService.camera.findUnique({
      where: {
        id,
      },
    });

    if (!camera) {
      return { success: false, message: 'Такой камеры не существует' };
    }

    await this.prismaService.camera.update({
      data: {
        ...dto,
      },
      where: {
        id,
      },
    });

    return { success: true, message: 'Камера успешно обновлена' };
  }
}
