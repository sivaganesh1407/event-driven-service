import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InvestmentRepository } from '../repositories/investment.repository';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { CreateInvestmentDto } from '../common/dto/create-investment.dto';
import { InvestmentDocument } from '../models/investment.model';
import { Types } from 'mongoose';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger(InvestmentService.name);

  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly portfolioRepository: PortfolioRepository,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto): Promise<InvestmentDocument> {
    this.logger.log(`Creating investment for portfolio: ${createInvestmentDto.portfolioId}`);

    const portfolio = await this.portfolioRepository.findById(createInvestmentDto.portfolioId);
    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio with id ${createInvestmentDto.portfolioId} not found`,
      );
    }

    const investment = await this.investmentRepository.create({
      portfolioId: new Types.ObjectId(createInvestmentDto.portfolioId),
      assetName: createInvestmentDto.assetName,
      amount: createInvestmentDto.amount,
    });

    this.logger.debug(`Investment created with id: ${investment._id}`);
    return investment;
  }

  async findByPortfolioId(portfolioId: string): Promise<InvestmentDocument[]> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${portfolioId} not found`);
    }
    return this.investmentRepository.findByPortfolioId(portfolioId);
  }
}
