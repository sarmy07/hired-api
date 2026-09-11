/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CloduinaryProvider } from './cloudinary.provider';
import { ConfigModule } from '@nestjs/config';
import cloudinaryConfig from './config/cloudinaryConfig';

@Module({
  imports: [ConfigModule.forFeature(cloudinaryConfig)],
  providers: [CloduinaryProvider],
  exports: [CloduinaryProvider],
})
export class CloudinaryModule {}
