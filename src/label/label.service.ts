import { Injectable } from '@nestjs/common';
import { Label } from 'src/entity/label.entity';
import { User } from 'src/entity/user.entity';
import { LabelRepository } from 'src/repository/label.repository';

@Injectable({})
export class LabelService {
  constructor(private labelRepository: LabelRepository) {}

  async getLabel(userId: string) {
    const user = new User();
    user.id = userId;
    return await this.labelRepository.findBy({
      createdBy: user,
    });
  }

  async createLabel(userId: string, name: string) {
    const user = new User();
    user.id = userId;

    let label = await this.labelRepository.findOne({
      where: { createdBy: user, name },
    });

    if (label) {
      throw 'Duplicate Label';
    } else {
      label = new Label();
      label.name = name;
      label.createdBy = user;
      label.isActive = true;
    }

    return await this.labelRepository.save(label);
  }
}
