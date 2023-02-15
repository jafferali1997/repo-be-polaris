import { ApiQueryArray } from '@/common/decorators/apiQuery.decorator';
import { ApiPaginationResponseInterceptor } from './../common/interceptors/api-pagination.response';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Request, query } from 'express';
import { UsersService } from './users.service';
import { UserDto } from './dto/userDto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto.dto';
import { SetNewPasswordDto } from './dto/SetNewPasswordDto.dto';
import { ForgotPasswordOtpDto } from './dto/ForgotPasswordOtpDto.dto';
import { HttpService } from '@nestjs/axios';
import { AllAuthGuard } from '@/guards/AllAuthGuard.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { RoleType } from '@/constants';
import { VerifyEmailOtpDto } from './dto/VerifyEmailOtpDto.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { VerifyEmailDto } from './dto/VerifyEmailDto.dto';
import { UserToUpdate } from './dto/UpdateUserByAdmin.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('users') //used to make the blocks of specific apis in swagger
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private httpService: HttpService,
  ) {}

  @UseInterceptors(ApiPaginationResponseInterceptor)
  @Post()
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiQueryArray([
    { name: 'limit', type: 'number', example: 10 },
    { name: 'pages', type: 'number', example: 1 },
  ])
  async getUsers(
    @Req() req: object,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Body() body: { search: string },
  ) {
    const options = { limit, page, search: body.search };
    const result = await this.usersService.getAllUsers(req, options);
    return result;
  }

  @Patch('/:id')
  @UseGuards(AllAuthGuard)
  @Roles(RoleType.ADMIN)
  @ApiBearerAuth()
  async updateUsers(@Body() updateData: UserToUpdate, @Query('id') id: number) {
    const result = await this.usersService.patchUser(updateData, id);
    return result;
  }

  @Post('/forget-password')
  @ApiResponse({
    type: ForgotPasswordDto,
  })
  async forgetPasswordUser(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Post('/forget-password-otp')
  @ApiResponse({
    type: ForgotPasswordOtpDto,
  })
  async forgotPasswordOtp(@Body() forgotPasswordOtpDto: ForgotPasswordOtpDto) {
    return await this.usersService.checkForgotPasswordOtp(forgotPasswordOtpDto);
  }

  @UseGuards(AllAuthGuard)
  @Roles(RoleType.USER, RoleType.ADMIN)
  @Post('/change-password')
  @ApiBearerAuth()
  @ApiResponse({
    type: ChangePasswordDto,
  })
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return await this.usersService.changePassword(changePassword, req.user);
  }

  @Post('/resend-email')
  @ApiResponse({
    type: VerifyEmailDto,
  })
  async resendEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.usersService.resendEmail(verifyEmailDto);
  }

  @Post('/verify-email-otp')
  @ApiResponse({
    type: VerifyEmailOtpDto,
  })
  async verifyEmailOtp(
    @Body() verifyEmailOtpDto: VerifyEmailOtpDto,
    @Req() req: any,
  ) {
    return await this.usersService.verifyEmailOtp(verifyEmailOtpDto);
  }

  @Post('/set-new-password')
  @ApiResponse({
    type: SetNewPasswordDto,
  })
  async setNewPassword(@Body() setNewPasswordDto: SetNewPasswordDto) {
    return await this.usersService.setNewPassword(setNewPasswordDto);
  }

  // @ApiBearerAuth()
  @Post('/register')
  // @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description: 'Created user response',
    type: UserDto,
  })
  async createUser(@Body() userDto: UserDto) {
    const user = await this.usersService.createUser(userDto);
    return user;
  }

  // @Post('/register/referralCode')
  // // @UseGuards(JwtAuthGuard)
  // @ApiResponse({
  //   description: 'Created user response',
  //   type: ReferralUser,
  // })
  // async createReferralUser(@Body() userDto: ReferralUser) {
  //   const user = await this.usersService.createReferralBaseUser(userDto);
  //   return user;
  // }
  // @Delete(':id')
  // deleteUser(@Param('id') id: number) {
  //   const result = this.usersService.deleteUser(id);
  //   return result;
  // }
}
