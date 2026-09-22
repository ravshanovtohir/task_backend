import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '@prisma';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_ACCESS_EXPIRE_TIME, JWT_ACCESS_SECRET } from '@config';
import { AuthRepository } from './auth.repository';
import { RedisService } from '@helpers';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../../common/strategy/jwt.strategy';

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
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, RedisService, JwtStrategy],
})
export class AuthModule {}
