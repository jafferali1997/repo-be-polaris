import { OUserDetails } from './../constants/user-details-value';
import { UtilitiesService } from '@/helpers/utils';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Like, Not, Repository } from 'typeorm';
import { ForgotPasswordDto } from './dto/ForgotPasswordDto.dto';
import { LoginDto } from './dto/loginDto';
import { IUser } from '@/interfaces/IUser.interfaces';
import { ISetNewPassword } from '@/interfaces/ISetNewPassword.interface';
import { IForgotPasswordOtp } from '@/interfaces/IForgotPasswordOtp.interface';
import {
  BAD_REQUEST_RESPONSE,
  EMAIL_ALREADY_EXIST_RESPONSE,
  PHONE_ALREADY_EXIST_RESPONSE,
} from '@/constants/response.types';
import { Login } from '@/entities/login.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
import { RoleType, NOT_FOUND_RESPONSE } from '@/constants';
import { VerifyEmailDto } from './dto/VerifyEmailDto.dto';
import { UserToUpdate } from './dto/UpdateUserByAdmin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
    private readonly helper: UtilitiesService,
  ) {}

  async getUserById(id: number): Promise<Login> {
    const user: Login = await this.loginRepository.findOne({
      where: { id },
    });
    const res = await this.helper.excludeOnlyPwd(user);
    return res;
  }

  async getAllUsers(req: any, option: any): Promise<any> {
    const {
      user: { id },
    } = req;
    const take = +option?.limit || 10;
    const pages = +option?.page || 1;
    const skip = (pages - 1) * take;
    const data = await this.loginRepository.findAndCount({
      where: {
        id: Not(id),
        ...(option.search?.length && { name: Like(`%${option.search}%`) }),
      },
      select: {
        ...OUserDetails,
      },
      skip: skip,
      take: take,
    });
    const finalResponse = this.helper.paginateResponse(data, pages, take);
    return finalResponse;
  }

  async getUserByEmail(body: LoginDto): Promise<Login> {
    const { email } = body;
    const user: Login = await this.loginRepository.findOne({
      where: { email },
    });
    if (!user)
      throw new HttpException(NOT_FOUND_RESPONSE.message, HttpStatus.NOT_FOUND);
    return user;
  }

  async createUser(payload: IUser): Promise<any> {
    const pwd = payload.password;

    const { email, name } = payload;

    const unVerified_email: Login = await this.loginRepository.findOne({
      where: { email: email, isEmailVerified: false },
      select: {
        ...OUserDetails,
      },
    });

    const user_email: Login = await this.loginRepository.findOne({
      where: { email: email, isEmailVerified: true },
    });

    if (user_email)
      throw new HttpException(
        EMAIL_ALREADY_EXIST_RESPONSE.message,
        HttpStatus.CONFLICT,
      );

    try {
      const encodedPassword: string = this.helper.encodePassword(pwd);

      const otp = this.helper.generateOtp();

      await this.helper.sendEmail(email, `OTP: ${otp}`);

      // creating new instance of user(login)
      const user = this.loginRepository.create({
        email: email,
        password: encodedPassword,
        emailVerifyOtp: this.helper.encodeOtp(otp),
        emailVerifyOtpExpiryTime: this.helper.addMinutes(10),
        role: RoleType.USER,
        name,
      });
      await this.loginRepository.save(user);

      const userWithoutPassword = this.helper.excludeOnlyPwd(user);
      return userWithoutPassword;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(
    changePassword: ChangePasswordDto,
    user: any,
  ): Promise<any> {
    const { oldPassword, newPassword } = changePassword;
    const { password, id } = user;
    const bcryptPassword: string = this.helper.encodePassword(newPassword);
    if (this.helper.isPasswordValid(oldPassword, password)) {
      await this.loginRepository.update({ id }, { password: bcryptPassword });

      return this.helper.excludeOnlyPwd(
        await this.loginRepository.findOneBy({ id }),
      );
    }
    throw new HttpException('old password is wrong', HttpStatus.CONFLICT);
  }

  // async createReferralBaseUser(payload: IUser) {
  //   const { email, phone, referralCode, name } = payload;
  //   const pwd = payload.password;

  //   const user_reference = await this.loginRepository.findOne({
  //     where: {
  //       userReferralCode: {
  //         referralCode,
  //       },
  //     },
  //   });

  //   const user_email: Login = await this.loginRepository.findOne({
  //     where: { email },
  //   });

  //   const user_phone: any = await this.profileRepository.findOne({
  //     where: { phone },
  //   });

  //   if (user_email)
  //     throw new HttpException('email already exists', HttpStatus.CONFLICT);

  //   if (user_phone)
  //     throw new HttpException('phone already exists', HttpStatus.CONFLICT);

  //   if (!user_reference)
  //     throw new HttpException('Referral Code Not Found', HttpStatus.NOT_FOUND);

  //   try {
  //     // const encodedPassword: string = this.helper.encodePassword(pwd);
  //     const encodedPassword: string = this.helper.encodePassword(pwd);
  //     const emailVerification = await this.verifyEmail(email);
  //     // creating new instance of user(login)
  //     const user = this.loginRepository.create({
  //       email,
  //       password: encodedPassword,
  //       role: RoleType.USER,
  //       ...emailVerification,
  //     });

  //     const newUser = await this.loginRepository.save(user);

  //     const newPrivacy = this.userPrivacyRepository.create({ login: user });
  //     const privacy = await this.userPrivacyRepository.save(newPrivacy);
  //     const profile = this.profileRepository.create({
  //       name: name,
  //       phone: phone,
  //       login: newUser,
  //       userPrivacy: privacy,
  //     });

  //     await this.profileRepository.save(profile);
  //     const userWithoutPassword = this.helper.excludeOnlyPwd(user);
  //     const otp = this.helper.generateOtp();
  //     await this.helper.sendEmail(email, `OTP: ${otp}`);
  //     return userWithoutPassword;
  //   } catch (error) {
  //     throw new HttpException(
  //       BAD_REQUEST_RESPONSE.message,
  //       BAD_REQUEST_RESPONSE.status,
  //     );
  //   }
  // }

  async createOrFindUserWithGoogle(payload: any) {
    const { email } = payload;

    let user_email: Login = await this.loginRepository.findOne({
      where: { email },
    });

    if (user_email) {
      // if (user_email.loginWithType !== LoginWithType.GOOGLE)
      //   throw new HttpException('email already exists', HttpStatus.CONFLICT);
      return {
        email: user_email.email,
        role: user_email.role,
        id: user_email.id,
        access_token: this.helper.generateToken(user_email),
      };
    }

    const finalPayload = {
      email,
      role: RoleType.USER,
      isEmailVerified: true,
    };

    const result = await this.loginRepository.save(finalPayload);
    user_email = await this.loginRepository.findOne({
      where: { email },
    });

    return {
      email: user_email.email,
      role: user_email.role,
      id: user_email.id,
      access_token: this.helper.generateToken(user_email),
    };
  }

  async createOrFindUserWithFacebook(payload: any) {
    const { email, access_token, id } = payload;

    const user_email: Login = await this.loginRepository.findOne({
      where: { email },
    });

    if (user_email) {
      // if (user_email.loginWithType !== LoginWithType.FACEBOOK)
      //   throw new HttpException('email already exists', HttpStatus.CONFLICT);
      return {
        email: user_email.email,
        role: user_email.role,
        id: user_email.id,
        access_token: this.helper.generateToken(user_email),
      };
    }

    const finalPayload = {
      email,
      facebookId: id,
      role: RoleType.USER,
      isEmailVerified: true,
    };

    const result = await this.loginRepository.save(finalPayload);
    //const userWithoutPassword = this.helper.excludeOnlyPwd(result);
    // const resp = this.helper.responseModifier(
    //   HttpStatus.CREATED,
    //   'Record created successfully',
    //   true,
    //   userWithoutPassword,
    // );

    // const nsp = {
    //   succeeded: true,
    //   httpStatusCode: 200,
    //   message: 'Record(s) get successfully.',
    //   data: [userWithoutPassword],
    // };
    return {
      email: result.email,
      role: result.role,
      id: result.id,
      access_token: this.helper.generateToken(result),
    };
  }

  async createOrFindUserWithLinkedin(payload: any) {
    const { email, access_token, id } = payload;

    const user_email: Login = await this.loginRepository.findOne({
      where: { email },
    });

    if (user_email) {
      // if (user_email.loginWithType !== LoginWithType.FACEBOOK)
      //   throw new HttpException('email already exists', HttpStatus.CONFLICT);
      return {
        email: user_email.email,
        role: user_email.role,
        id: user_email.id,
        access_token: this.helper.generateToken(user_email),
      };
    }

    const finalPayload = {
      email,
      role: RoleType.USER,
      isEmailVerified: true,
    };

    const result = await this.loginRepository.save(finalPayload);
    //const userWithoutPassword = this.helper.excludeOnlyPwd(result);
    // const resp = this.helper.responseModifier(
    //   HttpStatus.CREATED,
    //   'Record created successfully',
    //   true,
    //   userWithoutPassword,
    // );

    // const nsp = {
    //   succeeded: true,
    //   httpStatusCode: 200,
    //   message: 'Record(s) get successfully.',
    //   data: [userWithoutPassword],
    // };
    return {
      email: result.email,
      role: result.role,
      id: result.id,
      access_token: this.helper.generateToken(result),
    };
  }

  async patchUser(updateData: UserToUpdate, id: number) {
    const user = await this.loginRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(
        'No user found in database to update',
        HttpStatus.NOT_FOUND,
      );
    await this.loginRepository.update({ id }, { ...updateData });

    return await this.loginRepository.find({ where: { id } });
  }

  async patchUserName(updateData: any, id: number, req) {
    if (req.user.role === RoleType.USER) {
      const user = await this.loginRepository.findOne({
        where: { id: req.user.id },
      });
      if (!user)
        throw new HttpException(
          'No user found in database to update',
          HttpStatus.NOT_FOUND,
        );

      await this.loginRepository.update({ id: req.user.id }, { ...updateData });

      return await this.loginRepository.find({ where: { id } });
    }

    const user = await this.loginRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(
        'No user found in database to update',
        HttpStatus.NOT_FOUND,
      );
    await this.loginRepository.update({ id }, { ...updateData });

    return await this.loginRepository.find({ where: { id } });
  }

  async deleteUser(userId: number): Promise<any> {
    const user = await this.loginRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      const loginRec = await this.loginRepository.remove(user);
      return [];
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPassword;
    const isEmailInDB = await this.loginRepository.findOneBy({ email: email });

    if (isEmailInDB) {
      const otp = this.helper.generateOtp();
      await this.loginRepository
        .createQueryBuilder()
        .update({
          isPasswordForgotOtp: this.helper.encodeOtp(otp),
          isPasswordForgotOtpExpiryTime: this.helper.addMinutes(10),
        })
        .where({ email: email })
        .returning('*')
        .execute();

      await this.helper.sendEmail(isEmailInDB.email, `OTP: ${otp}`);
      return { message: 'OTP Sent', data: null };
    }
    throw new HttpException('User does not Exist', HttpStatus.NOT_FOUND);
  }

  async verifyEmail(email: string) {
    const otp = this.helper.generateOtp();

    await this.helper.sendEmail(email, `OTP: ${otp}`);
    return {
      emailVerifyOtp: this.helper.encodeOtp(otp),
      emailVerifyOtpExpiryTime: this.helper.addMinutes(10),
    };
  }

  async verifyEmailOtp(emailOtp: any) {
    const { email, otp } = emailOtp;
    const isEmailInDB = await this.loginRepository.findOneBy({ email: email });
    const dateNow = new Date();
    if (
      isEmailInDB &&
      isEmailInDB.emailVerifyOtp &&
      isEmailInDB.emailVerifyOtpExpiryTime &&
      this.helper.isOtpValid(otp, isEmailInDB.emailVerifyOtp)
    ) {
      if (dateNow.getTime() < isEmailInDB.emailVerifyOtpExpiryTime.getTime()) {
        const user = await this.loginRepository.findOne({
          where: { id: isEmailInDB.id },
        });

        const finalObj = await this.loginRepository
          .createQueryBuilder()
          .update({
            emailVerifyOtp: null,
            isEmailVerified: true,
            emailVerifyOtpExpiryTime: null,
          })
          .where({ email: email })
          .returning('*')
          .execute();
        delete finalObj.raw[0].password;
        delete finalObj.raw[0].isPasswordForgot;
        delete finalObj.raw[0].isPasswordForgotOtp;
        delete finalObj.raw[0].isApproved;
        return { final: finalObj.raw[0] };
      }
      await this.loginRepository
        .createQueryBuilder()
        .update({
          emailVerifyOtp: null,
          emailVerifyOtpExpiryTime: null,
        })
        .where({ email: email })
        .returning('*')
        .execute();
      throw new HttpException('otp expired', HttpStatus.CONFLICT);
    }
    throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
  }

  // async makeSignedUrl(email: string, userId: number): Promise<string> {
  //   const url = `${
  //     process.env.APP_URL
  //   }/api/user/emailVerification?sessionId=${this.helper.addMinutes(
  //     10,
  //   )}&email=${this.helper.encodeEmail(email)}&userId=${userId}`;
  //   return url;
  // }

  async resendEmail(verify: VerifyEmailDto) {
    const { email } = verify;
    const user = await this.loginRepository.findBy({ email });

    if (!user)
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

    const otp = await this.verifyEmail(email);
    await this.loginRepository.update({ email }, { ...otp });
    return await this.loginRepository.findBy({ email });
  }

  async checkForgotPasswordOtp(
    forgotPasswordOtp: IForgotPasswordOtp,
  ): Promise<Login> {
    const { email, otp } = forgotPasswordOtp;
    const isEmailInDB = await this.loginRepository.findOneBy({ email: email });
    const dateNow = new Date();

    if (
      isEmailInDB &&
      isEmailInDB.isPasswordForgotOtp &&
      isEmailInDB.isPasswordForgotOtpExpiryTime &&
      this.helper.isOtpValid(otp, isEmailInDB.isPasswordForgotOtp)
    ) {
      if (
        dateNow.getTime() < isEmailInDB.isPasswordForgotOtpExpiryTime.getTime()
      ) {
        const finalObj = await this.loginRepository
          .createQueryBuilder()
          .update({
            isPasswordForgotOtp: null,
            isPasswordForgot: true,
            isPasswordForgotOtpExpiryTime: null,
            isPasswordForgotExpiryTime: this.helper.addMinutes(10),
          })
          .where({ email: email })
          .returning('*')
          .execute();
        delete finalObj.raw[0].password;
        delete finalObj.raw[0].isPasswordForgot;
        delete finalObj.raw[0].isPasswordForgotOtp;
        delete finalObj.raw[0].isApproved;
        return finalObj.raw[0];
      }
      await this.loginRepository
        .createQueryBuilder()
        .update({
          isPasswordForgotOtp: null,
          isPasswordForgotOtpExpiryTime: null,
        })
        .where({ email: email })
        .returning('*')
        .execute();
      throw new HttpException('otp expired', HttpStatus.CONFLICT);
    }
    throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
  }

  async setNewPassword(setNewPasswordBody: ISetNewPassword): Promise<Login> {
    const { email, password } = setNewPasswordBody;
    const dateNow = new Date();
    const object = await this.loginRepository.findOneBy({
      email: email,
    });
    if (
      object &&
      object.isPasswordForgot &&
      object.isPasswordForgotExpiryTime
    ) {
      if (dateNow.getTime() < object.isPasswordForgotExpiryTime.getTime()) {
        const encodedPassword: string = this.helper.encodePassword(password);
        const finalObj = await this.loginRepository
          .createQueryBuilder()
          .update({
            isPasswordForgot: false,
            password: encodedPassword,
            isPasswordForgotExpiryTime: null,
          })
          .where({ email: email })
          .returning('*')
          .execute();

        delete finalObj.raw[0].password;
        delete finalObj.raw[0].isPasswordForgot;
        delete finalObj.raw[0].isPasswordForgotOtp;
        delete finalObj.raw[0].isApproved;
        return finalObj.raw[0];
      }

      await this.loginRepository
        .createQueryBuilder()
        .update({
          isPasswordForgot: false,
          isPasswordForgotExpiryTime: null,
        })
        .where({ email: email })
        .returning('*')
        .execute();
      throw new HttpException('otp expired', HttpStatus.CONFLICT);
    }
    throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
  }

  async findUserByArgs(args: object) {
    console.log('findUserByArgs', args);
    const user = await this.loginRepository.findOne({
      ...args,
    });
    if (!user)
      throw new HttpException(NOT_FOUND_RESPONSE.message, HttpStatus.NOT_FOUND);
    return user;
  }
}
