import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Investment, InvestmentDocument } from './schemas/investment.schema';
import { CreateInvestmentDto } from './dto/create-investment.dto';

@Injectable()
export class InvestmentsService {
  private readonly logger = new Logger(InvestmentsService.name);

  constructor(
    @InjectModel(Investment.name) private readonly investmentModel: Model<InvestmentDocument>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto): Promise<InvestmentDocument> {
    this.logger.log(`Creating investment for portfolio: ${createInvestmentDto.portfolioId}`);

    const investment = new this.investmentModel({
      portfolioId: new Types.ObjectId(createInvestmentDto.portfolioId),
      type: createInvestmentDto.type,
      symbol: createInvestmentDto.symbol,
      shares: createInvestmentDto.shares,
      purchasePrice: createInvestmentDto.purchasePrice,
      currentValue: createInvestmentDto.currentValue,
      purchaseDate: createInvestmentDto.purchaseDate,
    });
    const saved = await investment.save();
    this.logger.debug(`Investment created with id: ${saved._id}`);
    return saved;
  }

  async findByPortfolioId(portfolioId: string): Promise<InvestmentDocument[]> {
    if (!Types.ObjectId.isValid(portfolioId)) {
      throw new NotFoundException(`Invalid portfolio ID: ${portfolioId}`);
    }

    this.logger.debug(`Finding investments for portfolio: ${portfolioId}`);
    return this.investmentModel.find({ portfolioId: new Types.ObjectId(portfolioId) }).exec();
  }
}
