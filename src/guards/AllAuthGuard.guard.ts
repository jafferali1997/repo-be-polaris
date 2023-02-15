import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from '@/constants';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AllAuthGuard implements CanActivate {
  constructor(
    private httpService: HttpService,
    private jwt: JwtService,
    private readonly loginRepository: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const token = await context
      .switchToHttp()
      .getRequest()
      .header('Authorization')
      ?.split(' ')[1];
    const requireRoles = this.reflector.getAllAndOverride<RoleType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (token) {
      const jwtUserData: any = this.jwt.decode(token);
      if (
        new Date(new Date().toUTCString()).getTime() <
        new Date(
          new Date(jwtUserData.time).getTime() + jwtUserData.expiry,
        ).getTime()
      ) {
        const user = await this.loginRepository.findUserByArgs({
          where: { email: jwtUserData.email },
        });
        if (requireRoles && user.isEmailVerified) {
          context.switchToHttp().getRequest()['user'] = user;
          return requireRoles.some((role) => [user.role].includes(role));
        }
      } else {
        throw new HttpException('token expired', HttpStatus.UNAUTHORIZED);
      }
    }
    throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
