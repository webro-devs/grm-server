import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AccessTokenUserGuard } from './modules/auth/passport-stratagies/access-token-user/access-token-user.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { ErrorFilter } from './infra/validators';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());

  app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
      console.log(`Response for ${req.method} ${req.url}: ${body}`);
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
