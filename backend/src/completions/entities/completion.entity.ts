import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { TaskNote } from './task-note.entity';

@Entity('completions')
export class Completion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  taskId: number;

  @ManyToOne(() => Task, (task) => task.completions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  completedAt: Date;

  @Column({ type: 'varchar', length: 5, nullable: true })
  timeOfDay: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => TaskNote, (note) => note.completion)
  taskNotes: TaskNote[];
}

