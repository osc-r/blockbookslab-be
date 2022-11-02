import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { LabelRepository } from 'src/repository/label.repository';
import { Label } from 'src/entity/label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  controllers: [LabelController],
  providers: [LabelService, LabelRepository],
  exports: [LabelRepository],
})
export class LabelModule {}
