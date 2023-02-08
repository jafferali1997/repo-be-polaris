import { ApiProperty } from '@nestjs/swagger';

export class CreateContractRiskAnalysisDto {
  @ApiProperty()
  image: string;
}
