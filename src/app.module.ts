import { validate } from '@config';
import { ResponseInterceptor } from '@interceptors';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule, AuthModule } from '@modules';
import { StaffModule } from './staff/staff.module';
import { AcceptLanguageResolver, I18nJsonLoader, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
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
    PrismaModule,
    AuthModule,
    StaffModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [],
})
export class AppModule { }
