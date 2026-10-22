import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entities';

@Entity('session')
export class Session {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamp', { name: 'expiresAt' })
  expiresAt: Date;

  @Column('text', { unique: true })
  token: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updatedAt: Date;

  @Column('text', { name: 'ipAddress', nullable: true })
  ipAddress?: string;

  @Column('text', { name: 'userAgent', nullable: true })
  userAgent?: string;

  @Index('session_userId_idx')
  @Column('uuid', { name: 'userId' })
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
