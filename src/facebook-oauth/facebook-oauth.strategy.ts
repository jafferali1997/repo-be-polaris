import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
//import { Strategy } from 'passport-jwt';

@Injectable()
export class FacebookOauthStrategy extends PassportStrategy(
  Strategy,
  'facebook',
) {
  constructor(configService: ConfigService) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('OAUTH_FACEBOOK_ID'),
      clientSecret: configService.get<string>('OAUTH_FACEBOOK_SECRET'),
      callbackURL: configService.get<string>('OAUTH_FACEBOOK_REDIRECT_URL'),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  // authenticate(req: Request) {
  //   console.log(req?.header('Authorization')?.split(' ')[1]);
  // }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const { id, name, emails } = profile;

    console.log('My profile: ', profile);
    console.log(_accessToken);

    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    const payload = {
      provider: 'facebook',
      providerId: id,
      name: name.givenName,
      email: emails[0].value,
      access_token: _accessToken,
    };

    done(null, payload);
  }
}
