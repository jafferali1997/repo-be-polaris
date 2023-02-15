import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import querystring from 'querystring';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { FacebookOauthController } from './facebook-oauth.controller';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class FacebookOauthGuard
  extends AuthGuard('facebook')
  implements IAuthGuard
{
  constructor(private readonly httpService: HttpService) {
    super();
  }
  public handleRequest(err: unknown, user: any): any {
    return user;
  }

  public async getAuthenticateOptions(
    context: ExecutionContext,
  ): Promise<boolean> {
    const { user }: Request = context.switchToHttp().getRequest();
    // const che = await context
    //   .switchToHttp()
    //   .getRequest()
    //   .header('Authorization')
    //   ?.split(' ')[1];
    // // const che = new Object(HttpService);
    // // console.log(
    // //   this.httpService.get('https://graph.facebook.com/me?access_token='),
    // // );
    // if (che) {
    //   const result = await this.httpService.get(
    //     `https://graph.facebook.com/me?access_token=${che}`,
    //   );
    //   console.log(result);
    // }

    return true;
  }
}
