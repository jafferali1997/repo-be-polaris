import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FacebookOauthGuard } from './facebook-oauth.guard';

@ApiTags('Facebook-oauth')
@Controller('auth/facebook')
export class FacebookOauthController {
  constructor(
    private jwtAuthService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  @UseGuards(FacebookOauthGuard)
  async facebookAuth(@Req() _req) {
    console.log(_req);
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(FacebookOauthGuard)
  async facebookAuthRedirect(@Req() req: Request) {
    // // For now, we'll just show the user object
    const result = await this.userService.createOrFindUserWithFacebook(
      req.user,
    );

    return result;
    // return res.redirect('http://localhost:3000/api');
  }
}
