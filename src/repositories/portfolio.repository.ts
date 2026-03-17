import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Portfolio, PortfolioDocument } from '../models/portfolio.model';

@Injectable()
export class PortfolioRepository {
  constructor(
    @InjectModel(Portfolio.name) private readonly portfolioModel: Model<PortfolioDocument>,
  ) {}

  async create(data: Partial<Portfolio>): Promise<PortfolioDocument> {
    const portfolio = new this.portfolioModel(data);
    return portfolio.save();
  }

  async findById(id: string): Promise<PortfolioDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.portfolioModel.findById(id).exec();
  }

  async findByCustomerId(customerId: string): Promise<PortfolioDocument[]> {
    if (!Types.ObjectId.isValid(customerId)) return [];
    return this.portfolioModel.find({ customerId: new Types.ObjectId(customerId) }).exec();
  }
}
