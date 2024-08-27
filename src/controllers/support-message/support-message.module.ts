import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, SupportMessage } from 'lib-intellecta-entity';

import { SupportMessageService } from './support-message.service';
import { SupportMessageController } from './support-message.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { SupportMessageCronService } from './support-message.cron.service';

@Module({
  providers: [SupportMessageService, SupportMessageCronService],
  controllers: [SupportMessageController],
  imports: [TypeOrmModule.forFeature([SupportMessage, User])],
})
export class SupportMessageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes({
      path: 'api/support-message',
      method: RequestMethod.POST,
    });
  }
}
