import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompletionsService } from './completions.service';
import { CreateCompletionDto } from './dto/create-completion.dto';
import { CreateTaskNoteDto } from './dto/create-task-note.dto';

@Controller('completions')
export class CompletionsController {
  constructor(private readonly completionsService: CompletionsService) {}

  @Get()
  findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.completionsService.findAll(start, end);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.completionsService.findOne(+id);
  }

  @Post()
  create(@Body() createCompletionDto: CreateCompletionDto) {
    return this.completionsService.create(createCompletionDto);
  }

  @Post('notes')
  addNote(@Body() createTaskNoteDto: CreateTaskNoteDto) {
    return this.completionsService.addNote(createTaskNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.completionsService.remove(+id);
  }
}

