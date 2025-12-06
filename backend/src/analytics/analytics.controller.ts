import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAll() {
    return this.analyticsService.getAllAnalytics();
  }

  @Get('daily')
  getDaily(@Query('days') days?: string) {
    return this.analyticsService.getDailyCompletions(
      days ? parseInt(days, 10) : 30,
    );
  }

  @Get('weekly')
  getWeekly(@Query('weeks') weeks?: string) {
    return this.analyticsService.getWeeklyCompletions(
      weeks ? parseInt(weeks, 10) : 12,
    );
  }

  @Get('heatmap')
  getHeatmap() {
    return this.analyticsService.getHeatmapData();
  }

  @Get('streaks')
  getStreaks() {
    return this.analyticsService.getStreaks();
  }

  @Get('categories')
  getCategories() {
    return this.analyticsService.getCategoryBreakdown();
  }
}

