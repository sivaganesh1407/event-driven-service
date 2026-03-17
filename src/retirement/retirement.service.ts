import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { Portfolio, PortfolioDocument } from '../portfolios/schemas/portfolio.schema';
import { Investment, InvestmentDocument } from '../investments/schemas/investment.schema';

const DEFAULT_ANNUAL_RETURN = 0.06;
const DEFAULT_MONTHLY_CONTRIBUTION = 500;

@Injectable()
export class RetirementService {
  private readonly logger = new Logger(RetirementService.name);

  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(Portfolio.name) private readonly portfolioModel: Model<PortfolioDocument>,
    @InjectModel(Investment.name) private readonly investmentModel: Model<InvestmentDocument>,
  ) {}

  async getProjection(customerId: string) {
    this.logger.log(`Calculating retirement projection for customer: ${customerId}`);

    if (!Types.ObjectId.isValid(customerId)) {
      throw new NotFoundException(`Invalid customer ID: ${customerId}`);
    }

    const customer = await this.customerModel.findById(customerId).exec();
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    const portfolios = await this.portfolioModel.find({ customerId: new Types.ObjectId(customerId) }).exec();
    let totalPortfolioValue = 0;

    for (const portfolio of portfolios) {
      const investments = await this.investmentModel.find({ portfolioId: portfolio._id }).exec();
      totalPortfolioValue += investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    }

    const birthDate = new Date(customer.dateOfBirth);
    const today = new Date();
    const age = Math.floor((today.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const yearsToRetirement = Math.max(0, customer.retirementAge - age);

    const monthlyRate = DEFAULT_ANNUAL_RETURN / 12;
    const monthsToRetirement = yearsToRetirement * 12;

    const futureValueOfLumpSum = totalPortfolioValue * Math.pow(1 + monthlyRate, monthsToRetirement);
    const futureValueOfContributions =
      DEFAULT_MONTHLY_CONTRIBUTION *
      ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);

    const projectedValueAtRetirement = futureValueOfLumpSum + futureValueOfContributions;

    return {
      customerId,
      currentAge: age,
      retirementAge: customer.retirementAge,
      yearsToRetirement,
      currentPortfolioValue: Math.round(totalPortfolioValue * 100) / 100,
      projectedValueAtRetirement: Math.round(projectedValueAtRetirement * 100) / 100,
      assumptions: {
        annualReturn: DEFAULT_ANNUAL_RETURN,
        monthlyContribution: DEFAULT_MONTHLY_CONTRIBUTION,
      },
    };
  }
}
