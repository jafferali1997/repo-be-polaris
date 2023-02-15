import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { GoogleOauthGuard } from './google-oauth.guard';

@ApiTags('Google-oauth')
@Controller('auth/google')
export class GoogleOauthController {
  constructor(
    private jwtAuthService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth(@Req() _req: any) {
    console.log(_req.user);
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req: Request) {
    // For now, we'll just show the user object
    const result = await this.userService.createOrFindUserWithGoogle(req.user);

    return result;
    //return res.redirect('http://localhost:3000/api');
  }
}
