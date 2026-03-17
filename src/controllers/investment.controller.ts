import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InvestmentService } from '../services/investment.service';
import { CreateInvestmentDto } from '../common/dto/create-investment.dto';
import { InvestmentDocument } from '../models/investment.model';

@Controller('investments')
export class InvestmentController {
  private readonly logger = new Logger(InvestmentController.name);

  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInvestmentDto: CreateInvestmentDto) {
    this.logger.log('POST /investments - Creating investment');
    const investment = await this.investmentService.create(createInvestmentDto);
    return this.toResponse(investment);
  }

  @Get(':portfolioId')
  async findByPortfolioId(@Param('portfolioId') portfolioId: string) {
    this.logger.log(`GET /investments/${portfolioId} - Listing investments`);
    const investments = await this.investmentService.findByPortfolioId(portfolioId);
    return investments.map((i) => this.toResponse(i));
  }

  private toResponse(investment: InvestmentDocument) {
    return {
      id: investment._id.toString(),
      portfolioId: investment.portfolioId.toString(),
      assetName: investment.assetName,
      amount: investment.amount,
      createdAt: investment.createdAt,
    };
  }
}
