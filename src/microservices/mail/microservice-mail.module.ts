import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceMailService } from './microservice-mail.service';
import { MailController } from './microservice-mail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'lib-intellecta-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: 'MAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'mail_queue',
          queueOptions: {
            durable: false, // Настройка долговечности очереди
          },
        },
      },
    ]),
  ],
  providers: [MicroserviceMailService],
  controllers: [MailController],
})
export class MicroserviceMailModule {}
