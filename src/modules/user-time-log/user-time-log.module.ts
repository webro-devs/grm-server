import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTimeLog } from './user-time-log.entity';
import { UserTimeLogController } from './user-time-log.controller';
import { UserTimeLogService } from './user-time-log.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTimeLog]),
    UserModule,
  ],
  controllers: [UserTimeLogController],
  providers: [UserTimeLogService],
  exports: [],
})
export class UserTimeLogModule {
}
