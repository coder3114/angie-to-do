import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Completion } from './entities/completion.entity';
import { TaskNote } from './entities/task-note.entity';
import { CreateCompletionDto } from './dto/create-completion.dto';
import { CreateTaskNoteDto } from './dto/create-task-note.dto';

@Injectable()
export class CompletionsService {
  constructor(
    @InjectRepository(Completion)
    private completionRepository: Repository<Completion>,
    @InjectRepository(TaskNote)
    private taskNoteRepository: Repository<TaskNote>,
  ) {}

  async findAll(startDate?: Date, endDate?: Date): Promise<Completion[]> {
    const query = this.completionRepository
      .createQueryBuilder('completion')
      .leftJoinAndSelect('completion.task', 'task')
      .leftJoinAndSelect('completion.taskNotes', 'taskNotes')
      .orderBy('completion.completedAt', 'DESC');

    if (startDate && endDate) {
      query.where('completion.completedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Completion> {
    return this.completionRepository.findOne({
      where: { id },
      relations: ['task', 'taskNotes'],
    });
  }

  async create(createCompletionDto: CreateCompletionDto): Promise<Completion> {
    const now = new Date();
    const timeOfDay =
      createCompletionDto.timeOfDay ||
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const completion = this.completionRepository.create({
      ...createCompletionDto,
      completedAt: now,
      timeOfDay,
    });

    return this.completionRepository.save(completion);
  }

  async addNote(createTaskNoteDto: CreateTaskNoteDto): Promise<TaskNote> {
    const note = this.taskNoteRepository.create(createTaskNoteDto);
    return this.taskNoteRepository.save(note);
  }

  async remove(id: number): Promise<void> {
    await this.completionRepository.delete(id);
  }
}

