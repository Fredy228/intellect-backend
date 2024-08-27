import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { User } from 'lib-intellecta-entity';

@Injectable()
export class MicroserviceAuthService {
  constructor(@Inject('AUTH_SERVICE') private authClientRMQ: ClientProxy) {}

  async checkToken(token: string): Promise<User> {
    return lastValueFrom(
      this.authClientRMQ.send({ cmd: 'check-auth' }, { token }),
    );
  }
}
