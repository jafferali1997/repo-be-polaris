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
  const PORT: number = parseInt(process.env.PORT, 10) || 5000;
  app.setGlobalPrefix('api/');
  app.enableCors();
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
    .setTitle('Soulmi')
    .setDescription('Soulmi matrimonial apis.')
    .setVersion('1.0')
    .addTag('Soulmi')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    Logger.log(`Running server on port  ${PORT}`);
  });
}
bootstrap();
