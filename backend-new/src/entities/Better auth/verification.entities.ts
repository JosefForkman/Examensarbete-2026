import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('verification')
export class Verification {
  @PrimaryColumn('uuid')
  id: string;

  @Index('verification_identifier_idx')
  @Column('text')
  identifier: string;

  @Column('text')
  value: string;

  @Column('timestamp', { name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
