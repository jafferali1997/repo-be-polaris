import { UserEmails } from './../entities/userEmails.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEmailsService } from './user-emails.service';
import { UserEmailsController } from './user-emails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEmails])],
  controllers: [UserEmailsController],
  providers: [UserEmailsService],
})
export class UserEmailsModule {}
