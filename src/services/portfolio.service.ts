import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { CreatePortfolioDto } from '../common/dto/create-portfolio.dto';
import { PortfolioDocument } from '../models/portfolio.model';
import { Types } from 'mongoose';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<PortfolioDocument> {
    this.logger.log(`Creating portfolio for customer: ${createPortfolioDto.customerId}`);

    const customer = await this.customerRepository.findById(createPortfolioDto.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${createPortfolioDto.customerId} not found`);
    }

    const portfolio = await this.portfolioRepository.create({
      customerId: new Types.ObjectId(createPortfolioDto.customerId),
      portfolioName: createPortfolioDto.portfolioName,
    });

    this.logger.debug(`Portfolio created with id: ${portfolio._id}`);
    return portfolio;
  }

  async findByCustomerId(customerId: string): Promise<PortfolioDocument[]> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }
    return this.portfolioRepository.findByCustomerId(customerId);
  }
}
