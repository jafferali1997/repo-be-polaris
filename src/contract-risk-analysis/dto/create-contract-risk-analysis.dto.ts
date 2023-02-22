import { ApiProperty } from '@nestjs/swagger';
import { UploadedFiles } from '@nestjs/common/decorators';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateContractRiskAnalysisDto {
  @ApiProperty()
  @IsString()
  agreementName: string;

  @ApiProperty()
  @IsNumber()
  catagory: number;

  @ApiProperty()
  @IsString()
  summaryAnalysis: string;

  @ApiProperty()
  @IsString()
  summaryText: string;

  @ApiProperty()
  @IsString()
  clauses: string;

  @ApiProperty()
  @IsBoolean()
  isRecommended: boolean;

  @ApiProperty()
  @IsString()
  recommendation: string;

  @ApiProperty()
  @IsString()
  indicatorPerClause: string;

  @ApiProperty()
  @IsString()
  summaryOutput: string;

  @ApiProperty()
  @IsString()
  imageUrl: string;
}
