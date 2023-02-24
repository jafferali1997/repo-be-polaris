import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserEmailsService } from './user-emails.service';
import { CreateUserEmailDto } from './dto/user-email.dto';
import { UpdateUserEmailDto } from './dto/update-user-email.dto';

@ApiTags('user Emails')
@Controller('user-emails')
export class UserEmailsController {
  constructor(private readonly userEmailsService: UserEmailsService) {}

  @Post()
  create(@Body() createUserEmailDto: CreateUserEmailDto) {
    return this.userEmailsService.create(createUserEmailDto);
  }

  @Get()
  findAll() {
    return this.userEmailsService.findAll();
  }
}
