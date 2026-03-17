import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): { name: string; version: string; docs: Record<string, string> } {
    return this.appService.getRoot();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}
