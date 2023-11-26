"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require("dotenv/config");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const adminConfig = {
        projectId: process.env.FIREBASE_PRODUCT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    admin.initializeApp({
        credential: admin.credential.cert(adminConfig),
        storageBucket: process.env.STORAGE_BUCKET,
    });
    process.setMaxListeners(20);
    app.enableCors({
        origin: '*',
        methods: '*',
        credentials: true,
    });
    await app.listen(3000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map