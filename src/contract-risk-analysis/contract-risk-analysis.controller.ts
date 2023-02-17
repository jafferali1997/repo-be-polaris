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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContractRiskAnalysisService } from './contract-risk-analysis.service';
import { CreateContractRiskAnalysisDto } from './dto/create-contract-risk-analysis.dto';
import { UpdateContractRiskAnalysisDto } from './dto/update-contract-risk-analysis.dto';

@ApiTags('contract-risk-analysis')
@Controller('contract-risk-analysis')
export class ContractRiskAnalysisController {
  constructor(
    private readonly contractRiskAnalysisService: ContractRiskAnalysisService,
  ) {}

  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiBearerAuth()
  @Post()
  create(@Body() createContractRiskAnalysisDto: CreateContractRiskAnalysisDto) {
    return this.contractRiskAnalysisService.create(
      createContractRiskAnalysisDto,
    );
  }

  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiBearerAuth()
  @Get()
  findAll(@Req() req: any) {
    return this.contractRiskAnalysisService.findAll(req.user);
  }

  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.contractRiskAnalysisService.findOne(+id, req);
  }

  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.contractRiskAnalysisService.remove(+id, req);
  }
}
