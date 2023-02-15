import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { UsersService } from '@/users/users.service';
import { Module } from '@nestjs/common';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { UtilitiesService } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    // TypeOrmModule.forFeature([Login, UserProfile, Membership]),
  ],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy, UtilitiesService, JwtService],
})
export class GoogleOauthModule {}
