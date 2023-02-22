import { ApiProperty } from '@nestjs/swagger';
import { UploadedFiles } from '@nestjs/common/decorators';
import { IsNumber, IsString } from 'class-validator';

export class UpdateFinalAnalysisDto {
  @ApiProperty({
    description: 'finalAnalysis',
    example: 'RISKY',
  })
  @IsString()
  finalAnalysis: string;
}
