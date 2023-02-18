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
import { Repository, IsNull } from 'typeorm';
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
      const postResult = this.riskResultRepo.create({
        login: user,
        ...createContractRiskAnalysisDto,
      });
      await this.riskResultRepo.save(postResult);
      const [name, count] = await this.riskResultRepo.findAndCount({
        where: { login: { id: user.id }, deletedAt: IsNull() },
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
        where: { login: { id: user.id }, deletedAt: IsNull() },
        relations: {
          login: true,
        },
      });
    }
    return await this.riskResultRepo.find({
      where: { deletedAt: IsNull() },
      select: { login: { name: true } },
      relations: { login: true },
    });
  }

  async findOne(id: number, req: any) {
    if (req.user.role === RoleType.USER) {
      return await this.riskResultRepo.find({
        where: { id, login: { id: req.user.id }, deletedAt: IsNull() },
        relations: {
          login: true,
        },
      });
    }
    return await this.riskResultRepo.find({
      where: { id, deletedAt: IsNull() },
    });
  }

  async remove(id: number, req: any) {
    const dateNow = new Date();
    if (req.user.role === RoleType.USER) {
      const user = await this.riskResultRepo.find({
        where: { id, login: { id: req.user.id }, deletedAt: IsNull() },
        relations: {
          login: true,
        },
      });
      if (!user)
        throw new HttpException('cannot delete record', HttpStatus.BAD_REQUEST);
      await this.riskResultRepo.update({ id }, { deletedAt: dateNow });
      const [name, count] = await this.riskResultRepo.findAndCount({
        where: { login: { id: req.user.id }, deletedAt: IsNull() },
        relations: { login: true },
      });
      await this.loginRepo.update(
        { id: req.user.id },
        { totalAgreements: count },
      );
      return 'deleted id:' + id;
    }
    const user = await this.riskResultRepo.find({
      where: { id, deletedAt: IsNull() },
      relations: {
        login: true,
      },
    });
    if (!user)
      throw new HttpException('cannot delete record', HttpStatus.BAD_REQUEST);
    const upda = await this.riskResultRepo.update(
      { id },
      { deletedAt: dateNow },
    );
    const [name, count] = await this.riskResultRepo.findAndCount({
      where: { login: { id: req.user.id }, deletedAt: IsNull() },
      relations: { login: true },
    });
    await this.loginRepo.update(
      { id: req.user.id },
      { totalAgreements: count },
    );
    return 'deleted id:' + id;
  }
}
