import { NestFactory } from '@nestjs/core';
import Helmet from 'helmet';
import { AppModule } from './app.module';
// import * as csurf from 'csurf';
// const csurf = require('csurf');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  console.log('App is listening on Port', PORT);
  app.use(Helmet());
  // app.use(csurf({ cookie: false }));
  await app.listen(PORT);
}
bootstrap();
