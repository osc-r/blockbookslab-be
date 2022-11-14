import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Label } from 'src/entity/label.entity';

@Injectable()
export class LabelRepository extends Repository<Label> {
  constructor(private dataSource: DataSource) {
    super(Label, dataSource.createEntityManager());
  }

  async findByUserId(userId: string) {
    const q = `
    SELECT l.id, l."name" 
    FROM label l 
    WHERE l.created_by IN(SELECT u.id FROM users u WHERE u.id = $1 OR u.address = 'SYSTEM')
    `;
    return await this.dataSource.query(q, [userId]);
  }
}
