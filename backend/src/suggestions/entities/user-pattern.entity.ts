import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity('user_patterns')
export class UserPattern {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  taskId: number;

  @OneToOne(() => Task)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  meanIntervalDays: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastCalculatedAt: Date;

  @Column({ type: 'int', default: 0 })
  streakCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

