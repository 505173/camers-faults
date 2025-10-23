import { PrismaClient } from '@prisma/client';
import { CameraStatus, CheckStatus } from 'src/types';

const prisma = new PrismaClient();

async function main() {
  console.log('Начинаем заполнение базы данных...');

  // Очищаем базу данных в правильном порядке (с учетом foreign keys)
  await prisma.error.deleteMany();
  await prisma.check.deleteMany();
  await prisma.camera.deleteMany();
  await prisma.user.deleteMany();

  console.log('База данных очищена');

  // Создаем пользователей
  const users = await prisma.user.createMany({
    data: [
      {
        phone: '+79161234567',
        hashedPassword:
          '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu5U2', // password: "admin123"
      },
      {
        phone: '+79031112233',
        hashedPassword:
          '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu5U2', // password: "admin123"
      },
    ],
  });

  console.log('Создано пользователей:', users.count);

  // Создаем камеры
  const cameras = await prisma.camera.createMany({
    data: [
      {
        name: 'Камера главного входа',
        ip: '192.168.1.100',
        location: 'Главный вход, здание А',
        status: CameraStatus.WORKS,
      },
      {
        name: 'Камера парковки',
        ip: '192.168.1.101',
        location: 'Парковка, северная сторона',
        status: CameraStatus.WORKS_INTERMITTENTLY,
      },
      {
        name: 'Камера коридора 2 этаж',
        ip: '192.168.1.102',
        location: 'Коридор 2 этаж, офис 205',
        status: CameraStatus.DOESNT_WORK,
      },
      {
        name: 'Камера ресепшн',
        ip: '192.168.1.103',
        location: 'Ресепшн, 1 этаж',
        status: CameraStatus.WORKS,
      },
      {
        name: 'Камера склада',
        ip: '192.168.1.104',
        location: 'Склад, задний вход',
        status: CameraStatus.WORKS,
      },
    ],
  });

  console.log('Создано камер:', cameras.count);

  // Получаем ID созданных камер для создания проверок
  const allCameras = await prisma.camera.findMany();

  // Создаем проверки для каждой камеры
  for (const camera of allCameras) {
    // Создаем несколько проверок для каждой камеры с разными временными метками
    const checks: any = [];

    // Текущая проверка
    checks.push({
      cameraId: camera.id,
      avgRttsMs: getRandomValue(10, 100),
      jitterMs: getRandomValue(1, 20),
      lossPct: getRandomValue(0, 5),
      status: getCheckStatus(camera.status),
      timestamp: new Date(),
    });

    // Прошлые проверки (2-3 дня назад)
    for (let i = 1; i <= 3; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - i);

      checks.push({
        cameraId: camera.id,
        avgRttsMs: getRandomValue(10, 150),
        jitterMs: getRandomValue(1, 25),
        lossPct: getRandomValue(0, 8),
        status: getRandomCheckStatus(),
        timestamp: pastDate,
      });
    }

    // Создаем проверки в базе данных
    for (const checkData of checks) {
      const check = await prisma.check.create({
        data: checkData,
      });

      // Для проверок со статусом BAD добавляем ошибки
      if (check.status === CheckStatus.BAD) {
        const errorMessages = [
          'Высокий показатель потери пакетов',
          'Превышено время отклика',
          'Нестабильное соединение',
          'Камера не отвечает',
          'Проблемы с сетью',
        ];

        const randomErrors = getRandomSubarray(errorMessages, 1, 3);

        for (const message of randomErrors) {
          await prisma.error.create({
            data: {
              checkId: check.id,
              message: message,
            },
          });
        }
      }
    }
  }

  const checkCount = await prisma.check.count();
  const errorCount = await prisma.error.count();

  console.log('Создано проверок:', checkCount);
  console.log('Создано ошибок:', errorCount);
  console.log('Заполнение базы данных завершено!');
}

// Вспомогательные функции
function getRandomValue(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCheckStatus(): CheckStatus {
  return Math.random() > 0.3 ? CheckStatus.GOOD : CheckStatus.BAD;
}

function getCheckStatus(cameraStatus: CameraStatus): CheckStatus {
  switch (cameraStatus) {
    case CameraStatus.WORKS:
      return CheckStatus.GOOD;
    case CameraStatus.DOESNT_WORK:
      return CheckStatus.BAD;
    case CameraStatus.WORKS_INTERMITTENTLY:
      return Math.random() > 0.5 ? CheckStatus.GOOD : CheckStatus.BAD;
    default:
      return CheckStatus.GOOD;
  }
}

function getRandomSubarray<T>(
  arr: T[],
  minLength: number,
  maxLength: number,
): T[] {
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, length);
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
