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

  @Column('text')
  issuer: string;

  @Column('text', { name: 'account_id' })
  accountId: string;

  @Column('text', { name: 'provider_id' })
  providerId: string;

  @Index('account_userId_idx')
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text', { name: 'access_token', nullable: true })
  accessToken?: string;

  @Column('text', { name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Column('text', { name: 'id_token', nullable: true })
  idToken?: string;

  @Column('timestamp', { name: 'access_token_expires_at', nullable: true })
  accessTokenExpiresAt?: Date;

  @Column('timestamp', { name: 'refresh_token_expires_at', nullable: true })
  refreshTokenExpiresAt?: Date;

  @Column('text', { nullable: true })
  scope?: string;

  @Column('text', { nullable: true })
  password?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
