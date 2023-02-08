import { PartialType } from '@nestjs/swagger';
import { CreateContractRiskAnalysisDto } from './create-contract-risk-analysis.dto';

export class UpdateContractRiskAnalysisDto extends PartialType(CreateContractRiskAnalysisDto) {}
