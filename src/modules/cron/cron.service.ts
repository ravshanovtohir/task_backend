import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@prisma';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 3 * * *', {
    name: 'expired-session-cleanup',
    timeZone: 'Asia/Tashkent',
    waitForCompletion: true,
  })
  async removeExpiredSessions() {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    this.logger.log(`Expired sessions removed: ${result.count}`);
  }
}
