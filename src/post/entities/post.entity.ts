import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { OutputBlockData } from '../dto/create-post.dto';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: 'jsonb' })
  body: OutputBlockData[];

  @Column()
  description: string;

  @Column({ nullable: true })
  tags?: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @Column({
    default: 0,
  })
  views: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;
}
