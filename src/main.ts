import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AccessTokenUserGuard } from './modules/auth/passport-stratagies/access-token-user/access-token-user.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { ErrorFilter } from './infra/validators';
import { useContainer } from 'class-validator';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

const logging = new Logger('Request Middleware', { timestamp: true });

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'warn', 'error'],
    rawBody: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(bodyParser.text({ type: 'application/xml' }));

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function () {
      logging.warn(`Response for ${req.method} ${req.url}`);
      originalSend.apply(res, arguments);
    };
    next();
  });

  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AccessTokenUserGuard(reflector), new RolesGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('GRM uz')
    .setDescription('GRM API description')
    .setVersion('0.2')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT);
}
bootstrap();
