import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from "dotenv";
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

config();

(async function bootstrap() {
  console.log(process.env.FRONTEND_URL);
  const app = await NestFactory.create(AppModule, {
    cors: {
      'credentials': true,
      'methods': ['GET', 'POST', 'PUT', 'DELETE'],
      'origin': process.env.FRONTEND_URL,
    }
  });

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Todo app')
    .setDescription('The docs of the todo app API')
    .setVersion('1.0')
    .addTag('todo')
    .build();
  SwaggerModule.setup('api', app, () => SwaggerModule.createDocument(app, config))

  await app.listen(process.env.PORT ?? 3000);
})();
