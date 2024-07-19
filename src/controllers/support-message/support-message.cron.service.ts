import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportMessage } from '../../entity/support-message.entity';
import { LessThan, Repository } from 'typeorm';
import { ESupportMessagesStatus } from '../../enums/user/support-messages.enum';
import { subMonths } from 'date-fns';

@Injectable()
export class SupportMessageCronService {
  constructor(
    @InjectRepository(SupportMessage)
    private supportMessageRepo: Repository<SupportMessage>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteOldMessage() {
    console.info('CHECKING OLD SUPPORT MESSAGES');
    const dateFilter = subMonths(new Date(), 6);

    const oldMessages = await this.supportMessageRepo.find({
      where: [
        {
          status: ESupportMessagesStatus.CLOSED,
          updateAt: LessThan(dateFilter),
        },
        {
          status: ESupportMessagesStatus.REJECTED,
          updateAt: LessThan(dateFilter),
        },
      ],
    });

    if (oldMessages && oldMessages.length > 0) {
      await this.supportMessageRepo.delete(oldMessages.map((item) => item.id));
    }
  }
}
