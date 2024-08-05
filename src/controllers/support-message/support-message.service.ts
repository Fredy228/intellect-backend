import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, SupportMessage } from 'lib-intellecta-entity';
import { Repository } from 'typeorm';

import {
  SupportMessageDto,
  UpdateSupportMessageDto,
} from './support-message.dto';
import { QueryGetAllType } from '../../types/query.type';
import { generateFilterList } from '../../services/generate-filter-list';
import { CustomException } from '../../services/custom-exception';

@Injectable()
export class SupportMessageService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SupportMessage)
    private supportMessageRepo: Repository<SupportMessage>,
  ) {}

  async create(user: User, body: SupportMessageDto) {
    const newSupportMessage = this.supportMessageRepo.create({
      title: body.title,
      message: body.message,
      email: user.email,
      user,
    });

    await this.supportMessageRepo.save(newSupportMessage);

    return newSupportMessage;
  }

  async getAll(query: QueryGetAllType) {
    const options = generateFilterList(query, ['title', 'message']);

    const [messages, count] = await this.supportMessageRepo.findAndCount({
      where: {
        ...options.filterOption,
      },
      order: options.sortOption,
      ...options.rangeOption,
    });

    return {
      data: messages,
      total: count,
    };
  }

  async getOne(id: number) {
    if (!id)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of support message ID ${id}`,
      );

    const supportMessage = await this.supportMessageRepo.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (!supportMessage)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Not found support message ID ${id}`,
      );

    return supportMessage;
  }

  async update(id: number, body: UpdateSupportMessageDto) {
    if (!id)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Wrong id of support message ID ${id}`,
      );

    const supportMessage = await this.supportMessageRepo.findOne({
      where: {
        id,
      },
    });

    if (!supportMessage)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found support message ID ${id}`,
      );

    await this.supportMessageRepo.update(supportMessage.id, {
      status: body.status,
    });

    supportMessage.status = body.status;

    return supportMessage;
  }
}
