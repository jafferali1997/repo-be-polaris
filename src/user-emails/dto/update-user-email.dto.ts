import { PartialType } from '@nestjs/swagger';
import { CreateUserEmailDto } from './user-email.dto';

export class UpdateUserEmailDto extends PartialType(CreateUserEmailDto) {}
