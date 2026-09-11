import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = [
    'images/jpeg',
    'images/jpg',
    'images/png',
    'image/webp',
  ];
  private readonly maxSizeBytes = 2 * 1024 * 1024;

  transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('image file is required');

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('only jpeg, jpg, png, webp are allowed');
    }

    if (file.size > this.maxSizeBytes) {
      throw new BadRequestException('image must be less than 2mb');
    }
    return file;
  }
}
