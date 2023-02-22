import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UserOAuthDto {
  @ApiProperty({
    description: 'name',
    example: 'john sam',
  })
  @IsNotEmpty({ message: 'name can not be empty' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'user email',
    example: 'abc@user.com',
  })
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({
    message: 'invalid email address',
  })
  email: string;
}
