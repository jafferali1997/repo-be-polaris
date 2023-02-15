import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-linkedin-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//import { Strategy } from 'passport-jwt';

@Injectable()
export class LinkedinOauthStrategy extends PassportStrategy(
  Strategy,
  'linkedin',
) {
  constructor(configService: ConfigService) {
    super({
      // Put config in `.env`
      clientID: configService.get<string>('OAUTH_LINKEDIN_ID'),
      clientSecret: configService.get<string>('OAUTH_LINKEDIN_SECRET'),
      callbackURL: configService.get<string>('OAUTH_LINKEDIN_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, name, emails } = profile;
    console.log(_refreshToken);

    // custom user object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    return {
      provider: 'linkedin',
      providerId: id,
      name: name.givenName,
      email: emails[0].value,
      access_token: _accessToken,
    };
  }
}
