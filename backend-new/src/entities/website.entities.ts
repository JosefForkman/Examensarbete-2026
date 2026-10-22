import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Followed } from './followed.entities';
import { PostItems } from './PostItems.entities';

@Entity()
export class Website {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  siteName: string;

  @Column()
  rssUrl: string;

  @Column()
  siteUrl: string;

  @CreateDateColumn({ name: 'CreatedAt', type: 'timestamptz' })
  createdAt: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  // Relationer
  @OneToMany(() => Followed, (followed) => followed.website)
  followers: Followed[];

  @OneToMany(() => PostItems, (postItem) => postItem.website)
  postItems: PostItems[];
}
