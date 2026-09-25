import { validate } from '@config';
import { RequestLoggingInterceptor, ResponseInterceptor } from '@interceptors';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule, AuthModule, RoleModule, StaffModule, RedisModule, PaymentModule } from '@modules';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { CronModule } from './modules/cron/cron.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: '.env',
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'uz',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    AuthModule,
    RoleModule,
    StaffModule,
    PrismaModule,
    RedisModule,
    PaymentModule,
    CronModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggingInterceptor,
    },
  ],
  exports: [],
})
export class AppModule {}
