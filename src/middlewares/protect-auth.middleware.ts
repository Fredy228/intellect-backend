import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'lib-intellecta-entity';

import { CustomException } from '../services/custom-exception';
import { MicroserviceAuthService } from '../microservices/auth/microservice-auth.service';

@Injectable()
export class ProtectAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly microserviceAuthService: MicroserviceAuthService,
  ) {}

  async use(req: Request & { user?: User }, _: Response, next: NextFunction) {
    const token =
      req.headers.authorization?.startsWith('Bearer') &&
      req.headers.authorization?.split(' ')[1];

    if (!token)
      throw new CustomException(HttpStatus.UNAUTHORIZED, 'Not authorized');

    const user = await this.microserviceAuthService.checkToken(token);

    req.user = user;
    next();
  }
}
