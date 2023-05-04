import * as dotenv from 'dotenv';

import { IConfig } from './config.interface';

dotenv.config();

export default (): IConfig => ({
  port: parseInt(process.env.PORT, 10) || 8000,

  database: {
    host: process.env.DB_HOST,
    type: process.env.DB_TYPE,
    name: 'default',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // url: process.env.ELEPHANT_SQL_URL,
    //remove after adding migrations
    synchronize: true,

    migrationsRun: false,

    logging: false,
    autoLoadEntities: true,
    entities: ['./dist/**/*.entity.js'],
    // migrations: ['dist/migrations/scripts/*.js'],
    // cli: {
    //   migrationsDir: 'src/migrations/scripts',
    // },
  },

  jwt: {
    accessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  },

  newPasswordBytes: 4,
  codeBytes: 2,
});
