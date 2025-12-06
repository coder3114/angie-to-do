import { Controller, Get } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';

@Controller('tasks/suggested')
export class SuggestionsController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Get()
  async getSuggestedTasks() {
    return this.suggestionService.getSuggestedTasks();
  }
}

