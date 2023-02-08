import { JwtService } from '@nestjs/jwt';
import { AuthService } from './../auth/auth.service';
import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './users.service';
import { UtilitiesService } from '@/helpers/utils';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from '@/entities/login.entity';
import { Global } from '@nestjs/common/decorators';

@Global()
@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([Login]), HttpModule],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, UtilitiesService],
})
export class UsersModule {}

// MiddlewareConsumer settings
// export class UserModule implements NestModule {
//   public configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .forRoutes({path: 'user', method: RequestMethod.GET}, {path: 'user', method: RequestMethod.PUT});
//   }
// }
