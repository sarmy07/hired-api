import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('hired-api')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/hired', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Hired-Api is running on http://localhost:3000');
}
bootstrap();
