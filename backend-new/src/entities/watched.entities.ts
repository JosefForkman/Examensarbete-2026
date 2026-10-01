import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { postItems } from './PostItems.entities';
import { User } from './Better auth/user.entities';

@Entity()
export class watched {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IX_Watched_UserId')
  @Column('text', { name: 'UserId' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'UserId' })
  user: User;

  @Index('IX_Watched_PostItemId')
  @Column('uuid', { name: 'PostItemId' })
  postItemId: string;

  @ManyToOne(() => postItems, (postItem) => postItem.watches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PostItemId' })
  postItem: postItems;
}
