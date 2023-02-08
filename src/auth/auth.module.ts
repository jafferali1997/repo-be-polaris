import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UtilitiesService } from '@/helpers/utils';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY, //enter secret key from the config file
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    // RefreshTokenStrategy,
    UtilitiesService,
  ],

  controllers: [AuthController],
})
export class AuthModule {}
