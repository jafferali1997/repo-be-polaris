import { Roles } from '@/common/decorators/roles.decorator';
import { RoleType } from '@/constants';
import { AllAuthGuard } from '@/guards/AllAuthGuard.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContractRiskAnalysisService } from './contract-risk-analysis.service';
import { CreateContractRiskAnalysisDto } from './dto/create-contract-risk-analysis.dto';
import { UpdateContractRiskAnalysisDto } from './dto/update-contract-risk-analysis.dto';

@ApiTags('contract-risk-analysis')
@Controller('contract-risk-analysis')
export class ContractRiskAnalysisController {
  constructor(
    private readonly contractRiskAnalysisService: ContractRiskAnalysisService,
  ) {}

  @Post()
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  create(@Body() createContractRiskAnalysisDto: CreateContractRiskAnalysisDto) {
    return this.contractRiskAnalysisService.create(
      createContractRiskAnalysisDto,
    );
  }

  @Get()
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN)
  findAll() {
    return this.contractRiskAnalysisService.findAll();
  }

  @Get(':id')
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  findOne(@Param('id') id: string, @Req() req) {
    return this.contractRiskAnalysisService.findOne(+id, req);
  }

  @Delete(':id')
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.contractRiskAnalysisService.remove(+id, req);
  }
}
