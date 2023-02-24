import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserEmailDto {
  @ApiProperty({
    description: 'user email',
    name: 'email',
    example: 'user@servicesprovider.com',
  })
  @IsNotEmpty({ message: 'email can not be empty' })
  @IsEmail({
    message: 'invalid email address',
  })
  email: string;
}
