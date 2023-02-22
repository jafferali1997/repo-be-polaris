import { EmailDto } from '@/dto/EmailDto.dto';
import { LoginDto } from '@/users/dto/loginDto';
import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('login') //used to make the blocks of specific apis in swagge
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.AuthService.login(dto);
  }

  @Post('auth-login')
  @HttpCode(200)
  authLogin(@Body() dto: EmailDto) {
    return this.AuthService.authLogin(dto);
  }
}
