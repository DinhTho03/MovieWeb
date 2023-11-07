import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as admin from 'firebase-admin';
// import * as serviceAccount from './config/stream_api.json';
// import { initializeApp } from 'firebase/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const firebaseConfig = {
    apiKey: 'AIzaSyBzDw-fJq5ER8XA2YtFtd1-OrZbFGSxsv0',
    authDomain: 'stream-api-82345.firebaseapp.com',
    projectId: 'stream-api-82345',
    storageBucket: 'stream-api-82345.appspot.com',
    messagingSenderId: '480810062941',
    appId: '1:480810062941:web:5bed45b8d11107ab71e9b4',
    measurementId: 'G-QNHQB9CMB3',
  };

  admin.initializeApp(firebaseConfig);
  // const credentialObject: object = serviceAccount;
  // admin.initializeApp({
  //   credential: admin.credential.cert(credentialObject),
  //   storageBucket: 'Stream-api',
  //   databaseURL: 'https://your-project-id.firebaseio.com',
  // });
  await app.listen(3000);
}
bootstrap();
