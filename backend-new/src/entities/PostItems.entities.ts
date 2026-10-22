import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Website } from './website.entities';
import { Watched } from './watched.entities';

@Entity()
export class PostItems {
  @PrimaryGeneratedColumn('uuid', { name: 'Id' })
  id: string;

  @Column('text', { name: 'Title' })
  title: string;

  @Column('text', { name: 'Description', nullable: true })
  description?: string;

  @Column('text', { name: 'Link' })
  link: string;

  @Column('text', { name: 'ImageUrl', nullable: true })
  imageUrl?: string;

  @Column('timestamptz', { name: 'PublicationDate' })
  publicationDate: Date;

  @Index('IX_PostItems_WebsiteId')
  @Column('uuid', { name: 'WebsiteId' })
  websiteId: string;

  @ManyToOne(() => Website, (website) => website.postItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'WebsiteId' })
  website: Website;

  @Column('text', { name: 'PostId', default: '' })
  postId: string;

  // Relationer
  @OneToMany(() => Watched, (watched) => watched.postItem)
  watches: Watched[];
}
