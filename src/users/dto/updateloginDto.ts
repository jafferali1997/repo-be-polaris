import { LoginDto } from './loginDto';
import { PartialType } from '@nestjs/swagger';

export class UpdateLoginDto extends PartialType(LoginDto) {}
