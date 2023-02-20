import { RoleType } from '@/constants';
import { Login } from '@/entities';
import { RiskResult } from '@/entities/risk-result.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(RiskResult)
    private readonly riskRepo: Repository<RiskResult>,
    @InjectRepository(Login)
    private readonly loginRepo: Repository<Login>,
  ) {}
  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  async getCountOfData(req) {
    const [, totalCount] = await this.riskRepo.findAndCount({
      where: { login: { id: req.user.id }, deletedAt: null },
      relations: { login: true },
    });
    const [, totalCountRisky] = await this.riskRepo.findAndCount({
      where: {
        login: { id: req.user.id },
        deletedAt: null,
        summaryAnalysis: 'RISKY',
      },
      relations: { login: true },
    });
    const [, totalCountParRisky] = await this.riskRepo.findAndCount({
      where: {
        login: { id: req.user.id },
        deletedAt: null,
        summaryAnalysis: 'PARTIALLY RISKY',
      },
      relations: { login: true },
    });
    const [, totalCountSafe] = await this.riskRepo.findAndCount({
      where: {
        login: { id: req.user.id },
        deletedAt: null,
        summaryAnalysis: 'SAFE',
      },
      relations: { login: true },
    });

    return {
      totalCount,
      totalCountParRisky,
      totalCountRisky,
      totalCountSafe,
    };
  }

  async findAll(req) {
    if (req.user.role === RoleType.USER) {
      const {
        totalCount,
        totalCountParRisky,
        totalCountRisky,
        totalCountSafe,
      } = await this.getCountOfData(req);
      return {
        data: {
          totalCount,
          totalCountParRisky,
          totalCountRisky,
          totalCountSafe,
        },
      };
    }
    const [, allTotalCount] = await this.riskRepo.findAndCount({
      where: { deletedAt: null },
    });
    const [, totalUsers] = await this.loginRepo.findAndCount({});
    const [, allTotalCountRisky] = await this.riskRepo.findAndCount({
      where: {
        deletedAt: null,
        summaryAnalysis: 'RISKY',
      },
    });
    const [, allTotalCountParRisky] = await this.riskRepo.findAndCount({
      where: {
        deletedAt: null,
        summaryAnalysis: 'PARTIALLY RISKY',
      },
    });
    const [, allTotalCountSafe] = await this.riskRepo.findAndCount({
      where: {
        deletedAt: null,
        summaryAnalysis: 'SAFE',
      },
    });
    const { totalCount, totalCountParRisky, totalCountRisky, totalCountSafe } =
      await this.getCountOfData(req);
    return {
      data: {
        totalCount,
        totalCountParRisky,
        totalCountRisky,
        totalCountSafe,
        allTotalCount,
        allTotalCountParRisky,
        allTotalCountRisky,
        allTotalCountSafe,
        totalUsers,
      },
    };
  }

  findByDate(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
