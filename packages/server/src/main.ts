import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('rest');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     // disableErrorMessages: true,  // TODO needs only open at dev;
  //     transform: true,
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );
  setupSwagger(app);
  await app.listen(3100);
}
bootstrap();
