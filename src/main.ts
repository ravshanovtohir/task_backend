import { APP_PORT } from './config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AllExceptionsFilter } from '@exceptions';
import { globalHeaderParametrs } from '@enums';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/',
  });

  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new AllExceptionsFilter(),

    new I18nValidationExceptionFilter({
      detailedErrors: false,

      responseBodyFormatter: (_host, exception, errors) => ({
        success: false,
        message: Array.isArray(errors) ? String(errors[0] ?? 'VALIDATION_ERROR') : String(errors),
        statusCode: exception.getStatus(),
      }),
    }),
  );
  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: {
        '1': '1',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task Backend API')
    .setDescription('The Task Backend API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addGlobalParameters(...globalHeaderParametrs)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT ?? 3000);
}
bootstrap();
