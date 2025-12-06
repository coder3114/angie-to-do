import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuggestionsController } from './suggestions.controller';
import { SuggestionService } from './suggestion.service';
import { Completion } from '../completions/entities/completion.entity';
import { UserPattern } from './entities/user-pattern.entity';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Completion, UserPattern, Task])],
  controllers: [SuggestionsController],
  providers: [SuggestionService],
  exports: [SuggestionService],
})
export class SuggestionsModule {}

