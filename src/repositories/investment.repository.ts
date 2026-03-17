import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Investment, InvestmentDocument } from '../models/investment.model';

@Injectable()
export class InvestmentRepository {
  constructor(
    @InjectModel(Investment.name) private readonly investmentModel: Model<InvestmentDocument>,
  ) {}

  async create(data: Partial<Investment>): Promise<InvestmentDocument> {
    const investment = new this.investmentModel(data);
    return investment.save();
  }

  async findByPortfolioId(portfolioId: string): Promise<InvestmentDocument[]> {
    if (!Types.ObjectId.isValid(portfolioId)) return [];
    return this.investmentModel.find({ portfolioId: new Types.ObjectId(portfolioId) }).exec();
  }

  async getTotalAmountByPortfolioIds(portfolioIds: Types.ObjectId[]): Promise<number> {
    const result = await this.investmentModel
      .aggregate([
        { $match: { portfolioId: { $in: portfolioIds } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .exec();
    return result[0]?.total ?? 0;
  }
}
