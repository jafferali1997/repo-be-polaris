import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskResult } from '@/entities/risk-result.entity';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Login } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([RiskResult, Login]), HttpModule],
  controllers: [DashboardController],
  providers: [DashboardService, JwtService],
})
export class DashboardModule {}
