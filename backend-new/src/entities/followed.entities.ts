import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { website } from './website.entities';
import { User } from './Better auth/user.entities';

@Entity()
export class followed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IX_Followed_UserId')
  @Column('text', { name: 'UserId' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Index('IX_Followed_WebsiteId')
  @Column('uuid', { name: 'WebsiteId' })
  websiteId: string;

  @ManyToOne(() => website, (website) => website.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'WebsiteId' })
  website: website;
}
