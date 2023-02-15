import { Login } from '@/entities/login.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@/auth/auth.module';
import { UsersService } from '@/users/users.service';
import { UtilitiesService } from '@/helpers/utils';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FacebookOauthController } from './facebook-oauth.controller';
import { FacebookOauthStrategy } from './facebook-oauth.strategy';
import { HttpModule } from '@nestjs/axios/dist';

@Module({
  imports: [
    AuthModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [FacebookOauthController],
  providers: [FacebookOauthStrategy, UtilitiesService, JwtService],
})
export class FacebookOauthModule {}
