import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: readFileSync(join(__dirname, '..', 'certs', 'key.pem')),
      cert: readFileSync(join(__dirname, '..', 'certs', 'cert.pem')),
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
