import { RoleType } from '@/constants';
import { Login } from '@/entities';
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
    @InjectRepository(Login)
    private readonly loginRepo: Repository<Login>,
  ) {}
  async create(
    createContractRiskAnalysisDto: CreateContractRiskAnalysisDto,
    user,
  ) {
    try {
      const postResult = await this.riskResultRepo.save({
        ...createContractRiskAnalysisDto,
      });
      const [name, count] = await this.riskResultRepo.findAndCount({
        where: { login: { id: user.id }, deletedAt: null },
        relations: { login: true },
      });
      await this.loginRepo.update({ id: user.id }, { totalAgreements: count });
      return postResult;
    } catch (e) {
      throw new HttpException('Data not saved', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(user) {
    if (user.role === RoleType.USER) {
      return await this.riskResultRepo.find({
        where: { login: { id: user.id }, deletedAt: null },
        relations: {
          login: true,
        },
      });
    }
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
      await this.riskResultRepo.update({ id }, { deletedAt: new Date() });
      const [name, count] = await this.riskResultRepo.findAndCount({
        where: { login: { id: req.user.id }, deletedAt: null },
        relations: { login: true },
      });
      await this.loginRepo.update(
        { id: req.user.id },
        { totalAgreements: count },
      );
      return 'deleted id:' + id;
    }
    await this.riskResultRepo.update(
      { id, deletedAt: null },
      { deletedAt: new Date() },
    );
    const [name, count] = await this.riskResultRepo.findAndCount({
      where: { login: { id: req.user.id }, deletedAt: null },
      relations: { login: true },
    });
    await this.loginRepo.update(
      { id: req.user.id },
      { totalAgreements: count },
    );
    return 'deleted id:' + id;
  }
}
