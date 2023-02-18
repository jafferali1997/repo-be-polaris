import { RoleType } from '@/constants';
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
        summaryOutput: 'RISKY',
      },
      relations: { login: true },
    });
    const [, totalCountParRisky] = await this.riskRepo.findAndCount({
      where: {
        login: { id: req.user.id },
        deletedAt: null,
        summaryOutput: 'PARTIALLY RISKY',
      },
      relations: { login: true },
    });
    const [, totalCountSafe] = await this.riskRepo.findAndCount({
      where: {
        login: { id: req.user.id },
        deletedAt: null,
        summaryOutput: 'SAFE',
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
    const [, allTotalCountRisky] = await this.riskRepo.findAndCount({
      where: {
        deletedAt: null,
        summaryOutput: 'RISKY',
      },
    });
    const [, allTotalCountParRisky] = await this.riskRepo.findAndCount({
      where: {
        deletedAt: null,
        summaryOutput: 'PARTIALLY RISKY',
      },
    });
    const [, allTotalCountSafe] = await this.riskRepo.findAndCount({
      where: {
        deletedAt: null,
        summaryOutput: 'SAFE',
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
