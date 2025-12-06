import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Completion } from './completion.entity';

@Entity('task_notes')
export class TaskNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  completionId: number;

  @ManyToOne(() => Completion, (completion) => completion.taskNotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'completion_id' })
  completion: Completion;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}

