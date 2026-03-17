import { Controller, Get, Post, Body, Param, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PortfolioDocument } from './schemas/portfolio.schema';

@Controller('portfolios')
export class PortfoliosController {
  private readonly logger = new Logger(PortfoliosController.name);

  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPortfolioDto: CreatePortfolioDto) {
    this.logger.log('POST /portfolios - Creating portfolio');
    const portfolio = await this.portfoliosService.create(createPortfolioDto);
    return this.toResponse(portfolio);
  }

  @Get(':customerId')
  async findByCustomerId(@Param('customerId') customerId: string) {
    this.logger.log(`GET /portfolios/${customerId} - Listing portfolios`);
    const portfolios = await this.portfoliosService.findByCustomerId(customerId);
    return portfolios.map((p) => this.toResponse(p));
  }

  private toResponse(portfolio: PortfolioDocument) {
    return {
      id: portfolio._id.toString(),
      customerId: portfolio.customerId.toString(),
      name: portfolio.name,
      createdAt: portfolio.createdAt,
    };
  }
}
