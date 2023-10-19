import { HttpException, HttpStatus } from '@nestjs/common';
import { StatusEnum } from '../enums/error/StatusEnum';

export class CustomException extends HttpException {
  constructor(status: StatusEnum, message: string) {
    super(message, HttpStatus[status]);
  }
}
