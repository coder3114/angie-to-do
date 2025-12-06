import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { CompletionsModule } from './completions/completions.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    DatabaseModule,
    TasksModule,
    CompletionsModule,
    SuggestionsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

