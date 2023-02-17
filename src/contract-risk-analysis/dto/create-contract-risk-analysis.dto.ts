import { ApiProperty } from '@nestjs/swagger';
import { UploadedFiles } from '@nestjs/common/decorators';

export class CreateContractRiskAnalysisDto {
  @ApiProperty()
  agreementName: string;

  @ApiProperty()
  catagory: string;

  @ApiProperty()
  summaryAnalysis: string;

  @ApiProperty()
  summaryText: string;

  @ApiProperty()
  clauses: string;

  @ApiProperty()
  indicatorPerClause: string;

  @ApiProperty()
  summaryOutput: string;

  @ApiProperty()
  imageUrl: string;
}
