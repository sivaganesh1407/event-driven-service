import { Controller, Get, Param, Logger } from '@nestjs/common';
import { RetirementService } from '../services/retirement.service';

@Controller('retirement')
export class RetirementController {
  private readonly logger = new Logger(RetirementController.name);

  constructor(private readonly retirementService: RetirementService) {}

  @Get('projection/:customerId')
  async getProjection(@Param('customerId') customerId: string) {
    this.logger.log(`GET /retirement/projection/${customerId}`);
    return this.retirementService.getProjection(customerId);
  }
}
