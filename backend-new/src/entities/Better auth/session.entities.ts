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

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;

  @Column('text', { unique: true })
  token: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column('text', { name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column('text', { name: 'user_agent', nullable: true })
  userAgent?: string;

  @Index('session_userId_idx')
  @Column('uuid', { name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
