import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Label } from 'src/entity/label.entity';

@Injectable()
export class LabelRepository extends Repository<Label> {
  constructor(private dataSource: DataSource) {
    super(Label, dataSource.createEntityManager());
  }
}
