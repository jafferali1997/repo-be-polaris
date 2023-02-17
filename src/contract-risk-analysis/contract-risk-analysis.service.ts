import { RoleType } from '@/constants';
import { RiskResult } from '@/entities/risk-result.entity';
import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpServer,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateContractRiskAnalysisDto } from './dto/create-contract-risk-analysis.dto';
import { UpdateContractRiskAnalysisDto } from './dto/update-contract-risk-analysis.dto';

@Injectable()
export class ContractRiskAnalysisService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(RiskResult)
    private readonly riskResultRepo: Repository<RiskResult>,
  ) {}
  async create(createContractRiskAnalysisDto: CreateContractRiskAnalysisDto) {
    try {
      const postResult = await this.riskResultRepo.save({
        ...createContractRiskAnalysisDto,
      });
      return postResult;
    } catch (e) {
      throw new HttpException('Data not saved', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.riskResultRepo.find({});
  }

  async findOne(id: number, req: any) {
    if (req.user.role === RoleType.USER) {
      return await this.riskResultRepo.find({
        where: { id, login: { id: req.user.id }, deletedAt: null },
        relations: {
          login: true,
        },
      });
    }
    return await this.riskResultRepo.find({ where: { id, deletedAt: null } });
  }

  async remove(id: number, req: any) {
    if (req.user.role === RoleType.USER) {
      const user = await this.riskResultRepo.find({
        where: { id, login: { id: req.user.id }, deletedAt: null },
        relations: {
          login: true,
        },
      });
      if (!user)
        throw new HttpException('cannot delete record', HttpStatus.BAD_REQUEST);
      return await this.riskResultRepo.update(
        { id },
        { deletedAt: new Date() },
      );
    }
    return await this.riskResultRepo.update(
      { id, deletedAt: null },
      { deletedAt: new Date() },
    );
  }
}
