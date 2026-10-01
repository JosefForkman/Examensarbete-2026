import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { website } from './website.entities';
import { watched } from './watched.entities';

@Entity()
export class postItems {
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

  @ManyToOne(() => website, (website) => website.postItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'WebsiteId' })
  website: website;

  @Column('text', { name: 'PostId', default: '' })
  postId: string;

  // Relationer
  @OneToMany(() => watched, (watched) => watched.postItem)
  watches: watched[];
}
