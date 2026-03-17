import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Portfolio, PortfolioDocument } from './schemas/portfolio.schema';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfoliosService {
  private readonly logger = new Logger(PortfoliosService.name);

  constructor(
    @InjectModel(Portfolio.name) private readonly portfolioModel: Model<PortfolioDocument>,
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto): Promise<PortfolioDocument> {
    this.logger.log(`Creating portfolio for customer: ${createPortfolioDto.customerId}`);

    const portfolio = new this.portfolioModel({
      customerId: new Types.ObjectId(createPortfolioDto.customerId),
      name: createPortfolioDto.name,
    });
    const saved = await portfolio.save();
    this.logger.debug(`Portfolio created with id: ${saved._id}`);
    return saved;
  }

  async findByCustomerId(customerId: string): Promise<PortfolioDocument[]> {
    if (!Types.ObjectId.isValid(customerId)) {
      throw new NotFoundException(`Invalid customer ID: ${customerId}`);
    }

    this.logger.debug(`Finding portfolios for customer: ${customerId}`);
    return this.portfolioModel.find({ customerId: new Types.ObjectId(customerId) }).exec();
  }
}
