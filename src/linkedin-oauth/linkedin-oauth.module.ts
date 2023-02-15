import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { UsersService } from '@/users/users.service';
import { Module } from '@nestjs/common';
import { LinkedinOauthController } from './linkedin-oauth.controller';
import { LinkedinOauthStrategy } from './linkedin-oauth.strategy';
import { UtilitiesService } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    // TypeOrmModule.forFeature([Login, UserProfile, Membership]),
  ],
  controllers: [LinkedinOauthController],
  providers: [LinkedinOauthStrategy, UtilitiesService, JwtService],
})
export class LinkedinOauthModule {}
