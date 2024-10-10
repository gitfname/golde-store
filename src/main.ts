import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Golden Vault API")
    .setVersion("0.0.0")
    .addBearerAuth()
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("/docs", app, swaggerDocument)

  await app.listen(3000);
}
bootstrap();
