import { SUCCESSFUL_RESPONSE } from '@/constants/response.types';
import { LoginDto } from '@/users/dto/loginDto';
import { UtilitiesService } from '@/helpers/utils';
import {
  HttpStatus,
  Injectable,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { EmailDto } from '@/dto/EmailDto.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private helper: UtilitiesService,
  ) {}

  async login(userCredentials: LoginDto) {
    //console.log(loginCred);
    const user = await this.userService.getUserByEmail(userCredentials);

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const isPasswordValid = this.helper.isPasswordValid(
      userCredentials.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new HttpException('invalid email/password', HttpStatus.CONFLICT);
    const token: string = this.helper.generateToken(user);
    const responseWithToken = { ...user, token };
    const userWithoutPassword = this.helper.excludeOnlyPwd(responseWithToken);
    return userWithoutPassword;
  }

  async authLogin(userCredentials: EmailDto) {
    //console.log(loginCred);
    const user = await this.userService.getUserByEmail(userCredentials);

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const token: string = this.helper.generateToken(user);
    const responseWithToken = { ...user, token };
    const userWithoutPassword = this.helper.excludeOnlyPwd(responseWithToken);
    return userWithoutPassword;
  }
}
