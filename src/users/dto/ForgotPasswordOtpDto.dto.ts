import { EmailDto } from '@/dto/EmailDto.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordOtpDto extends EmailDto {
  @ApiProperty({
    description: 'send it as string',
    example: '132434',
  })
  @IsNotEmpty({ message: 'otp can not be empty' })
  @IsString()
  otp: string;
}
