import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new BadRequestException(
        `Validation failed "${value}" is not an integer`,
      );
    }
    return num;
  }
}
