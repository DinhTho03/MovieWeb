import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as bodyParser from 'body-parser';
// import * as serviceAccount from './config/stream_api.json';
// import { initializeApp } from 'firebase/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Sử dụng body-parser middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // firebase
  const adminConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PRODUCT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: process.env.STORAGE_BUCKET,
  });

  // process
  process.setMaxListeners(20);

  // cors
  app.enableCors({
    origin: '*',
    methods: '*',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
