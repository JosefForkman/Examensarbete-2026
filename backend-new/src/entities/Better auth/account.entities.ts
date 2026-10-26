import {
  Entity,
  Unique,
  PrimaryColumn,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from './user.entities';

@Entity('account')
@Unique('account_issuer_accountId_uidx', ['issuer', 'accountId'])
export class Account {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text', { name: 'issuer', nullable: true })
  issuer: string;

  @Column('text', { name: 'accountId' })
  accountId: string;

  @Column('text', { name: 'providerId' })
  providerId: string;

  @Index('account_userId_idx')
  @Column('uuid', { name: 'userId' })
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text', { name: 'accessToken', nullable: true })
  accessToken?: string;

  @Column('text', { name: 'refreshToken', nullable: true })
  refreshToken?: string;

  @Column('text', { name: 'idToken', nullable: true })
  idToken?: string;

  @Column('timestamp', { name: 'accessTokenExpiresAt', nullable: true })
  accessTokenExpiresAt?: Date;

  @Column('timestamp', { name: 'refreshTokenExpiresAt', nullable: true })
  refreshTokenExpiresAt?: Date;

  @Column('text', { nullable: true })
  scope?: string;

  @Column('text', { nullable: true })
  password?: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;
}
