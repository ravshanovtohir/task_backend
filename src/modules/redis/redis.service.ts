import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '@config';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD,
      retryStrategy: (times: number) => {
        return Math.min(times * 50, 2000); // 50ms dan 2000ms gacha qayta urinish
      },
    });

    this.client.on('connect', () => {
      console.log('Redis client successfully connected!');
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err.message);
    });
  }

  // Modul ishga tushganda ulanish holatini tekshirish
  // async onModuleInit() {
  //   // `connect()` chaqirishni olib tashladik, chunki ulanish avtomatik boshlanadi
  //   if (this.client.status === 'ready') {
  //     console.log('Redis allaqachon ulangan!');
  //   } else if (this.client.status === 'connecting') {
  //     console.log('Redis ulanish jarayonida...');
  //   }
  // }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('Redis disconnected!');
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
      return;
    }
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async delete(key: string): Promise<boolean> {
    const deletedCount = await this.client.del(key);

    return deletedCount > 0;
  }

  getClientStatus(): string {
    return this.client.status;
  }
}
