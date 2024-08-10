import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import * as process from 'process';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'lib-intellecta-entity';
import { MailController } from './mail.controller';

@Module({
  providers: [MailService],
  exports: [MailService],
  imports: [
    TypeOrmModule.forFeature([User]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_DOMAIN,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      template: {
        dir: process.cwd() + '/src/templates/',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
})
export class MailModule {}
