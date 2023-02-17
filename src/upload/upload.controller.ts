import { DOCUMENT_TYPE } from '@/constants/document-types';
import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Res,
  Query,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';
import { UploadedFiles } from '@nestjs/common/decorators';

@ApiTags('File Upload')
@Controller('user-upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService, // private readonly helper: UtilitiesService,
  ) {}

  @UseInterceptors(FilesInterceptor('file'))
  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // attachmentType: {
        //   type: 'array',
        //   items: {
        //     enum: [
        //       DOCUMENT_TYPE.EDUCATIONAL_DOCUMENT,
        //       DOCUMENT_TYPE.PROFESSIONAL_DOCUMENT,
        //       DOCUMENT_TYPE.PROFILE_PICTURE,
        //     ],
        //     example: [
        //       DOCUMENT_TYPE.EDUCATIONAL_DOCUMENT,
        //       DOCUMENT_TYPE.PROFESSIONAL_DOCUMENT,
        //       DOCUMENT_TYPE.PROFILE_PICTURE,
        //     ],
        //   },
        // },

        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFiles()
    file: Express.Multer.File,
  ) {
    return await this.uploadService.create(file);
  }
  @Get('read-image')
  async readImage(@Res() res: object, @Query('filename') filename: string) {
    return this.uploadService.findAll(filename, res);
  }
}
