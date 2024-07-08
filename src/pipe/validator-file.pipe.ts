import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CustomException } from '../services/custom-exception';

type TFileImg = {
  [key: string]: Array<Express.Multer.File>;
};
@Injectable()
export class FileValidatorPipe implements PipeTransform {
  constructor(
    private options: {
      maxSize: number;
      nullable: boolean;
      mimetype?: string;
      type?: string[];
    },
  ) {}

  transform(files: TFileImg, { type }: ArgumentMetadata) {
    if (['query', 'body', 'param'].includes(type)) {
      return files;
    }

    console.log('__files', files);
    if (!files) {
      if (this.options.nullable) return files;
      else
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          `You do not upload file`,
        );
    }

    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        files[key].forEach((item: Express.Multer.File) => {
          if (
            this.options.mimetype &&
            item.mimetype.split('/')[0] !== this.options.mimetype
          )
            throw new CustomException(
              HttpStatus.BAD_REQUEST,
              `You are uploading the wrong file format`,
            );

          if (
            this.options.type &&
            !this.options.type.includes(item.mimetype.split('/')[1])
          )
            throw new CustomException(
              HttpStatus.BAD_REQUEST,
              `You are uploading the wrong file format`,
            );

          if (item.size / (1024 * 1024) > this.options.maxSize)
            throw new CustomException(
              HttpStatus.BAD_REQUEST,
              `The file is too large. Maximum size ${this.options.maxSize} MB`,
            );
        });
      }
    }

    return files;
  }
}
