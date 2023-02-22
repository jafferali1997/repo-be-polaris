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
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Login } from './login.entity';
import { CATEGORY_TYPE } from '@/constants/category-type';

@Entity('risk-result') //explicitly setting table name
export class RiskResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agreementName: string;

  @Column({ type: 'enum', enum: CATEGORY_TYPE, nullable: true })
  catagory: CATEGORY_TYPE;

  @Column()
  summaryAnalysis: string;

  @Column({ nullable: true })
  recommendation: string;

  @Column({ nullable: true })
  finalAnalysis: string;

  @Column()
  summaryText: string;

  @Column()
  clauses: string;

  @Column()
  indicatorPerClause: string;

  @Column()
  summaryOutput: string;

  @Column()
  imageUrl: string;

  @Column({ default: null })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Login, (login) => login.riskResult)
  @JoinColumn()
  login: Login;
}
