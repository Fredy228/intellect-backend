import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'lib-intellecta-entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

import { CustomException } from '../../services/custom-exception';
import * as process from 'process';

@Injectable()
export class MailService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  async sendRestorePassLink(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: {
        id: true,
        actions: {},
        firstName: true,
        security: {},
        email: true,
      },
    });
    if (!user)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Your e-mail does not exist or is not registered.`,
      );

    if (user.security.is_block)
      throw new CustomException(
        HttpStatus.BAD_REQUEST,
        `Your user is blocked. Contact customer support.`,
      );

    if (user.actions.timeAt && user.actions.numberTries) {
      const differenceTime =
        new Date().getTime() - new Date(user.actions.timeAt).getTime();

      if (differenceTime < 24 * 60 * 60 * 1000 && user.actions.numberTries >= 5)
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          `You have exhausted all attempts to submit the code. Try again in 24 hours.`,
        );

      if (differenceTime < 60 * 1000 && user.actions.numberTries < 5)
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          `The next attempt will be available in 1 minute.`,
        );
    }

    const key = uuidv4();

    try {
      await this.mailerService.sendMail({
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Відновлення паролю Intellecta.',
        template: 'forgot-pass',
        context: {
          url: `${process.env.CLIENT_URL}/auth/forgot/${key}`,
        },
      });

      await this.usersRepository.update(user.id, {
        actions: {
          code: key,
          timeAt: new Date(),
          numberTries: user.actions.numberTries + 1,
        },
      });
    } catch (e) {
      console.log('e', e);
      throw new CustomException(HttpStatus.BAD_REQUEST, `Error send message`);
    }

    return;
  }
}
