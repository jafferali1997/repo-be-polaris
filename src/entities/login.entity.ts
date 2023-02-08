import { MembershipType } from './../constants/membershipType.constants';
import { PERMISSIONS_TYPE } from './../constants/permission-types';
import { RoleType } from './../constants/role-type';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('login') //explicitly setting table name
export class Login {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', enum: RoleType, nullable: false })
  role: RoleType;

  @Column({
    type: 'enum',
    enum: MembershipType,
    nullable: false,
    default: MembershipType.FREE,
  })
  membershipType: MembershipType;

  @Column({ default: false, nullable: false })
  isPasswordForgot: boolean;

  @Column({ default: null })
  isPasswordForgotOtp: string;

  @Column({ default: null })
  isPasswordForgotOtpExpiryTime: Date;

  @Column({ default: null })
  emailVerifyOtp: string;

  @Column({ default: null })
  emailVerifyOtpExpiryTime: Date;

  @Column({ default: null })
  isPasswordForgotExpiryTime: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({
    type: 'enum',
    enum: PERMISSIONS_TYPE,
    default: PERMISSIONS_TYPE.PENDING,
  })
  profileStatus: PERMISSIONS_TYPE;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
