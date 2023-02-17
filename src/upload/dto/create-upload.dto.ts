import { DOCUMENT_TYPE } from '@/constants/document-types';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadDto {
  @ApiProperty({
    enum: DOCUMENT_TYPE,
    enumName: 'DOCUMENT_TYPE',
  })
  @IsNotEmpty({ message: 'attachmentType is required' })
  attachmentType: DOCUMENT_TYPE;
}
