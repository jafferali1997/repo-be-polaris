import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContractRiskAnalysisService } from './contract-risk-analysis.service';
import { CreateContractRiskAnalysisDto } from './dto/create-contract-risk-analysis.dto';
import { UpdateContractRiskAnalysisDto } from './dto/update-contract-risk-analysis.dto';

@Controller('contract-risk-analysis')
export class ContractRiskAnalysisController {
  constructor(
    private readonly contractRiskAnalysisService: ContractRiskAnalysisService,
  ) {}

  @Post()
  create(@Body() createContractRiskAnalysisDto: CreateContractRiskAnalysisDto) {
    return this.contractRiskAnalysisService.create(
      createContractRiskAnalysisDto,
    );
  }

  @Get()
  findAll() {
    return this.contractRiskAnalysisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractRiskAnalysisService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractRiskAnalysisDto: UpdateContractRiskAnalysisDto,
  ) {
    return this.contractRiskAnalysisService.update(
      +id,
      updateContractRiskAnalysisDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractRiskAnalysisService.remove(+id);
  }
}
