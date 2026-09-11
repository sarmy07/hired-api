import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import type { ConfigType } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinaryConfig';
import { Readable } from 'typeorm/platform/PlatformTools.js';

export class CloduinaryProvider {
  constructor(
    @Inject(cloudinaryConfig.KEY)
    private readonly cloudinaryConfiguration: ConfigType<
      typeof cloudinaryConfig
    >,
  ) {
    cloudinary.config({
      cloud_name: this.cloudinaryConfiguration.cloudName,
      api_key: this.cloudinaryConfiguration.apiKey,
      api_secret: this.cloudinaryConfiguration.apiSecret,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [
            {
              width: 400,
              height: 400,
              crop: 'fill',
              gravity: 'face',
            },
          ],
        },
        (error, result) => {
          if (error) return reject(error);

          if (!result) return reject(new Error('upload failed'));
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImage(avatarId: string) {
    try {
      const res = await cloudinary.uploader.destroy(avatarId);
      if (!res.result) throw new NotFoundException();

      if (res.result !== 'ok') {
        throw new InternalServerErrorException();
      }

      return true;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
