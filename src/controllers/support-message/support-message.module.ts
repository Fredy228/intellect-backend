import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SupportMessageService } from './support-message.service';
import { SupportMessageController } from './support-message.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { AuthMiddlewareService } from '../../services/auth-middleware.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user/user.entity';
import { SupportMessage } from '../../entity/support-message.entity';
import { SupportMessageCronService } from './support-message.cron.service';

@Module({
  providers: [
    SupportMessageService,
    AuthMiddlewareService,
    SupportMessageCronService,
  ],
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
