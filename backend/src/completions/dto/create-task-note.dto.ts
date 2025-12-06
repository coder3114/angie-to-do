import { IsNumber, IsString } from 'class-validator';

export class CreateTaskNoteDto {
  @IsNumber()
  completionId: number;

  @IsString()
  content: string;
}

