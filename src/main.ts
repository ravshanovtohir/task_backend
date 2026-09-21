import { APP_PORT } from './config';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as basicAuth from 'express-basic-auth';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
  });

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
    .setTitle('Happy Tel API')
    .setDescription('The Happy Tel API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    // .addGlobalParameters(...globalHeaderParametrs)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT ?? 3000);
}
bootstrap();
