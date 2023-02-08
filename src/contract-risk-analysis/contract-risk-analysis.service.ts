import { RiskResult } from '@/entities/risk-result.entity';
import { HttpService } from '@nestjs/axios';
import { HttpServer, Injectable } from '@nestjs/common';
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
      const Image = await firstValueFrom(
        this.httpService.post(
          'https://squid-app-jfdd5.ondigitalocean.app/',
          createContractRiskAnalysisDto,
        ),
      );
      const postResult = await this.riskResultRepo.save({
        testResult: JSON.stringify(Image),
      });
      return Image;
    } catch (e) {
      return e;
    }
  }

  async findAll() {
    return await this.riskResultRepo.find({});
  }

  async findOne(id: number) {
    return await this.riskResultRepo.find({ where: { id } });
  }

  update(
    id: number,
    updateContractRiskAnalysisDto: UpdateContractRiskAnalysisDto,
  ) {
    return `This action updates a #${id} contractRiskAnalysis`;
  }

  remove(id: number) {
    return `This action removes a #${id} contractRiskAnalysis`;
  }
}
