import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UtilitiesService } from '@/helpers';
import { HttpModule, HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [UploadController],
  providers: [UploadService, JwtService],
})
export class UploadModule {}
