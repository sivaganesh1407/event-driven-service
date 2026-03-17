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
import { PortfolioService } from '../services/portfolio.service';
import { CreatePortfolioDto } from '../common/dto/create-portfolio.dto';
import { PortfolioDocument } from '../models/portfolio.model';

@Controller('portfolios')
export class PortfolioController {
  private readonly logger = new Logger(PortfolioController.name);

  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPortfolioDto: CreatePortfolioDto) {
    this.logger.log('POST /portfolios - Creating portfolio');
    const portfolio = await this.portfolioService.create(createPortfolioDto);
    return this.toResponse(portfolio);
  }

  @Get(':customerId')
  async findByCustomerId(@Param('customerId') customerId: string) {
    this.logger.log(`GET /portfolios/${customerId} - Listing portfolios`);
    const portfolios = await this.portfolioService.findByCustomerId(customerId);
    return portfolios.map((p) => this.toResponse(p));
  }

  private toResponse(portfolio: PortfolioDocument) {
    return {
      id: portfolio._id.toString(),
      customerId: portfolio.customerId.toString(),
      portfolioName: portfolio.portfolioName,
      createdAt: portfolio.createdAt,
    };
  }
}
