import { validate } from '@config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {PrismaModule, AuthModule } from '@modules'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}