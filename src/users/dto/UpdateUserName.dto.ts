import { PartialType } from '@nestjs/swagger';
import { UserName } from './UserName.dto';

export class UpdateUserName extends PartialType(UserName) {}
