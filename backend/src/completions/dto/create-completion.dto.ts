import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCompletionDto {
  @IsNumber()
  taskId: number;

  @IsOptional()
  @IsString()
  timeOfDay?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

