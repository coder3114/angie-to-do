import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletionsService } from './completions.service';
import { CompletionsController } from './completions.controller';
import { Completion } from './entities/completion.entity';
import { TaskNote } from './entities/task-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Completion, TaskNote])],
  controllers: [CompletionsController],
  providers: [CompletionsService],
  exports: [CompletionsService],
})
export class CompletionsModule {}

