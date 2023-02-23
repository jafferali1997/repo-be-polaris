import { Login } from '../entities/login.entity';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

// dynamic configuration recommended
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      username: this.config.get<string>('DATABASE_USER_NAME'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      database: this.config.get<string>('DATABASE_NAME'),
      autoLoadEntities: true,
      cache: false,
      logger: 'advanced-console',
      logging: true,
      migrations: [__dirname + '/../../typeorm-migrations/*.{ts,js}'],
      entities: [__dirname + '/../**/entity/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      ssl: this.config.get<boolean>('SSL_SYNC'),
      synchronize: this.config.get<boolean>('DATABASE_SYNC'),
    };
  }
}
