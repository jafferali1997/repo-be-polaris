import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LinkedinOauthGuard } from './linkedin-oauth.guard';

@ApiTags('linkedin-oauth')
@Controller('auth/linkedin')
export class LinkedinOauthController {
  constructor(
    private jwtAuthService: AuthService,
    private userService: UsersService,
  ) {}

  @Get()
  @UseGuards(LinkedinOauthGuard)
  async linkedinAuth(@Req() _req: any) {
    console.log(_req.user);
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(LinkedinOauthGuard)
  async linkedinAuthRedirect(@Req() req: Request) {
    // For now, we'll just show the user object
    const result = await this.userService.createOrFindUserWithLinkedin(
      req.user,
    );

    return result;
    //return res.redirect('http://localhost:3000/api');
  }
}
