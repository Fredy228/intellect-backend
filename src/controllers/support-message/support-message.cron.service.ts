import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportMessage, ESupportMessagesStatus } from 'lib-intellecta-entity';
import { LessThan, Repository } from 'typeorm';
import { subMonths } from 'date-fns';

@Injectable()
export class SupportMessageCronService {
  constructor(
    @InjectRepository(SupportMessage)
    private supportMessageRepo: Repository<SupportMessage>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
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
