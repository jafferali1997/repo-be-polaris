import { Roles } from '@/common/decorators/roles.decorator';
import { RoleType } from '@/constants';
import { AllAuthGuard } from '@/guards/AllAuthGuard.guard';
import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';

@ApiTags('dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiBearerAuth()
  findAll(@Req() req) {
    return this.dashboardService.findAll(req);
  }

  @Get('/graph')
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  @ApiBearerAuth()
  getGraph(@Req() req) {
    return this.dashboardService.getGraph(req);
  }
}
