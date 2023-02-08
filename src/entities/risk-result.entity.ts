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

@Entity('risk-result') //explicitly setting table name
export class RiskResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  testResult: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
