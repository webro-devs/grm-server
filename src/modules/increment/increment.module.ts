import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Increment } from './increment.entity';
import { IncrementService } from './increment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Increment])],
  controllers: [],
  providers: [IncrementService],
  exports: [IncrementService],
})
export class IncrementModule {
}
