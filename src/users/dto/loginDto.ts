import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'user email',
    example: 'abc@user.com',
  })
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({
    message: 'invalid email address',
  })
  email: string;

  @ApiProperty({
    description: 'password',
    example: '*****',
  })
  @IsNotEmpty({ message: 'password can not be empty' })
  @IsString()
  password: string;
}
