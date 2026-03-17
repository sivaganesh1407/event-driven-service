import { Controller, Get, Post, Body, Param, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { InvestmentDocument } from './schemas/investment.schema';

@Controller('investments')
export class InvestmentsController {
  private readonly logger = new Logger(InvestmentsController.name);

  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInvestmentDto: CreateInvestmentDto) {
    this.logger.log('POST /investments - Creating investment');
    const investment = await this.investmentsService.create(createInvestmentDto);
    return this.toResponse(investment);
  }

  @Get(':portfolioId')
  async findByPortfolioId(@Param('portfolioId') portfolioId: string) {
    this.logger.log(`GET /investments/${portfolioId} - Listing investments`);
    const investments = await this.investmentsService.findByPortfolioId(portfolioId);
    return investments.map((i) => this.toResponse(i));
  }

  private toResponse(investment: InvestmentDocument) {
    return {
      id: investment._id.toString(),
      portfolioId: investment.portfolioId.toString(),
      type: investment.type,
      symbol: investment.symbol,
      shares: investment.shares,
      purchasePrice: investment.purchasePrice,
      currentValue: investment.currentValue,
      purchaseDate: investment.purchaseDate,
      createdAt: investment.createdAt,
    };
  }
}
