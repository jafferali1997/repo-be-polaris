import { Module } from '@nestjs/common';
import { ContractRiskAnalysisService } from './contract-risk-analysis.service';
import { ContractRiskAnalysisController } from './contract-risk-analysis.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskResult } from '@/entities/risk-result.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { UtilitiesService } from '@/helpers';

@Module({
  imports: [TypeOrmModule.forFeature([RiskResult]), HttpModule],
  controllers: [ContractRiskAnalysisController],
  providers: [
    ContractRiskAnalysisService,
    JwtService,
    AuthService,
    UtilitiesService,
  ],
})
export class ContractRiskAnalysisModule {}
