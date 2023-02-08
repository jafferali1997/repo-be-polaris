import { IUser } from '@/interfaces/IUser.interfaces';
import { Injectable, Global } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';

@Injectable()
@Global()
export class UtilitiesService {
  private readonly jwt: JwtService;
  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  // media type check
  public checkMediaType = (args) => {
    console.log('args:', args);
  };

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Generate JWT Token
  public generateToken(user: IUser): string {
    return this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        time: new Date().toUTCString(),
        expiry: 86400000,
      },
      { secret: process.env.JWT_SECRET_KEY },
    );
  }
  // Decode and verify JWT Token
  public async decodeToken(token: string): Promise<any> {
    const verifyToken = await this.jwt?.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
    return verifyToken;
  }
  // abstract token from header
  public async abstractToken(req: any): Promise<any> {
    const currentToken = await req.header('authorization');
    const token: string = currentToken.split('Bearer ')[1];
    return token;
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public isOtpValid(Otp: string, userOtp: string): boolean {
    return bcrypt.compareSync(Otp, userOtp);
  }

  public generatePassword() {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  public addMinutes(numOfMinutes, date = new Date()): Date {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
  }
  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  public encodeOtp(otp: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(otp, salt);
  }

  // remove the password from the objects of array
  public excludePassword(users: any[]) {
    const data = [];
    for (const user of users) {
      const {
        password,
        isPasswordForgot,
        otpCode,
        otpCodeExpiry,
        isPasswordForgotExpiry,
        ...rest
      } = user;
      data.push(rest);
    }
    return data;
  }
  // this method will paginate the data
  public paginateResponse(data: any, page?: number, limit?: number) {
    const [result, total] = data;
    const totalPages = Math.ceil(total / limit);
    // const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > totalPages ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;
    return {
      data: [...result],
      metaInfo: {
        totalRecords: total,
        itemsPerPage: result.length,
        currentPage: page,
        nextPage: nextPage,
        prevPage: prevPage,
        totalPages: totalPages,
      },
    };
  }
  // remover password from single object
  public excludeOnlyPwd(user: any) {
    const data = user;
    const {
      password,
      isPasswordForgot,
      otpCode,
      otpCodeExpiry,
      isPasswordForgotExpiry,
      ...rest
    } = data;
    return rest;
  }

  // response with status code and message along with body
  public responseModifier(
    httpStatusCode: number,
    responseMessage: string,
    httpStatus: boolean,
    resp: object | Array<object>,
  ) {
    const newResponse = {
      succeeded: httpStatus,
      httpStatusCode: httpStatusCode,
      message: responseMessage,
      data: resp,
    };
    return newResponse;
  }

  public async sendEmail(email: string, body: string, subj?: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    //const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '20-10621@formanite.fccollege.edu.pk', // generated ethereal user
        pass: 'hDN8FYWymsZ2dgA7',
        //pass: 'xsmtpsib-20f1d202563c0a7001ad1df9dfc80bac47ffacadc7852c91240eababdef864b7-H0UQROEn4qDwmt7X', // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'Solmi <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: subj ? subj : 'Forgot Password', // Subject line
      text: '', // plain text body
      html: `<b>${body}</b>`, // html body
      // html: body, // html body
    });
    console.log(info);
  }

  public generateOtp() {
    return Math.floor(Math.random() * 1000000) + 100000 + '';
  }

  // this function will generate random code.
  public generateRandomCode(length = 6) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&(*)_-+0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  // private async validate(token: string): Promise<boolean | never> {
  //   // const decoded: unknown = this.jwt.verify(token);

  //   // if (!decoded) {
  //   //   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  //   // }

  //   // // const user: users = await this.validateUser(decoded);
  //   // const user: any = decoded;
  //   // if (!user) {
  //   //   throw new UnauthorizedException();
  //   // }
  //   return true;
  // }
}
