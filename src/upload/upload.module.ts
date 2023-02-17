import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UtilitiesService } from '@/helpers';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
