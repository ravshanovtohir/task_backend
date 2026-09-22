import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@prisma';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_ACCESS_EXPIRE_TIME, JWT_ACCESS_SECRET } from '@config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: JWT_ACCESS_SECRET,
        signOptions: { expiresIn: JWT_ACCESS_EXPIRE_TIME },
      }),
      inject: [ConfigService],
    }),
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
