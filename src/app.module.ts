import { ScheduleModule } from '@nestjs/schedule';
import { AllAuthGuard } from '@/guards/AllAuthGuard.guard';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/db.service';
import { ContractRiskAnalysisModule } from './contract-risk-analysis/contract-risk-analysis.module';
import { GoogleOauthModule } from './google-oauth/google-oauth.module';
import { FacebookOauthModule } from './facebook-oauth/facebook-oauth.module';
import { UploadModule } from './upload/upload.module';
import { AzureServicesModule } from './azure-services/azure-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    HttpModule,
    ContractRiskAnalysisModule,
    GoogleOauthModule,
    FacebookOauthModule,
    // UploadModule,
    // AzureServicesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
