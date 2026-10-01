import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { followed } from './followed.entities';
import { postItems } from './PostItems.entities';

@Entity()
export class website {
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
  @OneToMany(() => followed, (followed) => followed.website)
  followers: followed[];

  @OneToMany(() => postItems, (postItem) => postItem.website)
  postItems: postItems[];
}
