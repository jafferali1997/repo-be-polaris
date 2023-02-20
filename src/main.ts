import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, HttpStatus, Logger } from '@nestjs/common';
import getLogLevels from './common/loggers/logger';

async function bootstrap() {
  const appOptions = {
    cors: true,
    logger: getLogLevels(process.env.NODE_ENV === 'PRODUCTION'),
  };
  const app = await NestFactory.create(AppModule, appOptions);
  const PORT: number = parseInt(process.env.PORT, 10) || 3000;
  app.setGlobalPrefix('api/');
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://polaris.xeventechnologies.com',
      'https://polarisdev.xeventechnologies.com',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: false,
      forbidNonWhitelisted: true,
      // exceptionFactory: (error) => new UnprocessableEntityException(error),
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Polaris')
    .setDescription('Polaris matrimonial apis.')
    .setVersion('1.0')
    .addTag('Polaris')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    Logger.log(`Running server on port  ${PORT}`);
  });
}
bootstrap();
