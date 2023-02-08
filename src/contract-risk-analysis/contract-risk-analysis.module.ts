import { Module } from '@nestjs/common';
import { ContractRiskAnalysisService } from './contract-risk-analysis.service';
import { ContractRiskAnalysisController } from './contract-risk-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskResult } from '@/entities/risk-result.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([RiskResult]), HttpModule],
  controllers: [ContractRiskAnalysisController],
  providers: [ContractRiskAnalysisService],
})
export class ContractRiskAnalysisModule {}
