import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './userDto';

export class ReferralUser extends UserDto {
  @ApiProperty({
    description: 'referralCode',
    example: 'h#y4na2',
  })
  @IsNotEmpty({ message: 'referral code is required' })
  @IsString()
  referralCode: string;
}
