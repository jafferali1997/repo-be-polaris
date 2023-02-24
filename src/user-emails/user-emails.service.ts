import { UserEmails } from './../entities/userEmails.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserEmailDto } from './dto/user-email.dto';
import { Repository } from 'typeorm';
import { EMAIL_ALREADY_EXIST_RESPONSE } from '@/constants';

@Injectable()
export class UserEmailsService {
  constructor(
    @InjectRepository(UserEmails)
    private userEmailsRepo: Repository<UserEmails>,
  ) {}

  async create(payload: CreateUserEmailDto) {
    const { email } = payload;

    const isEmail = await this.userEmailsRepo.findOne({
      where: {
        email: email,
      },
    });

    if (isEmail)
      throw new HttpException(
        EMAIL_ALREADY_EXIST_RESPONSE.message,
        EMAIL_ALREADY_EXIST_RESPONSE.status,
      );

    try {
      const createRecord = this.userEmailsRepo.create(payload);
      const saveRecord = this.userEmailsRepo.save(createRecord);
      return saveRecord;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    const emails = await this.userEmailsRepo.find();
    return emails;
  }
}
