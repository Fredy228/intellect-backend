import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MailForgotDto } from './mail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'lib-intellecta-entity';
import { Repository } from 'typeorm';
import { CustomException } from '../../services/custom-exception';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MicroserviceMailService {
  constructor(
    @Inject('MAIL_SERVICE') private mailClientRMQ: ClientProxy,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async sendRestorePassLink({ email }: MailForgotDto) {
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
      await lastValueFrom(
        this.mailClientRMQ.emit('restore-pass', { email, key }),
      );

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
