import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { InvestmentRepository } from '../repositories/investment.repository';
import { RISK_PROFILES } from '../models/customer.model';

const ANNUAL_RETURN_BY_RISK: Record<string, number> = {
  [RISK_PROFILES[0]]: 0.04,
  [RISK_PROFILES[1]]: 0.06,
  [RISK_PROFILES[2]]: 0.08,
};

const DEFAULT_YEARS_TO_RETIREMENT = 25;

@Injectable()
export class RetirementService {
  private readonly logger = new Logger(RetirementService.name);

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly portfolioRepository: PortfolioRepository,
    private readonly investmentRepository: InvestmentRepository,
  ) {}

  async getProjection(customerId: string) {
    this.logger.log(`Calculating retirement projection for customer: ${customerId}`);

    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    const portfolios = await this.portfolioRepository.findByCustomerId(customerId);
    const portfolioIds = portfolios.map((p) => p._id);

    const totalInvestmentAmount =
      portfolioIds.length > 0
        ? await this.investmentRepository.getTotalAmountByPortfolioIds(portfolioIds)
        : 0;

    const annualReturn =
      ANNUAL_RETURN_BY_RISK[customer.riskProfile] ?? ANNUAL_RETURN_BY_RISK[RISK_PROFILES[1]];
    const yearsToRetirement = DEFAULT_YEARS_TO_RETIREMENT;

    const projectedValueCompound = this.calculateCompoundGrowth(
      totalInvestmentAmount,
      annualReturn,
      yearsToRetirement,
    );
    const projectedValueSimple = this.calculateSimpleGrowth(
      totalInvestmentAmount,
      annualReturn,
      yearsToRetirement,
    );

    const projectedCompound = Math.round(projectedValueCompound * 100) / 100;
    const gapToGoal = Math.max(0, customer.retirementGoal - projectedCompound);

    return {
      customerId,
      currentPortfolioValue: Math.round(totalInvestmentAmount * 100) / 100,
      yearsToRetirement,
      projectedValueCompound: projectedCompound,
      projectedValueSimple: Math.round(projectedValueSimple * 100) / 100,
      retirementGoal: customer.retirementGoal,
      gapToGoal: Math.round(gapToGoal * 100) / 100,
      assumptions: {
        annualReturn,
        riskProfile: customer.riskProfile,
      },
    };
  }

  private calculateCompoundGrowth(
    principal: number,
    annualRate: number,
    years: number,
  ): number {
    return principal * Math.pow(1 + annualRate, years);
  }

  private calculateSimpleGrowth(
    principal: number,
    annualRate: number,
    years: number,
  ): number {
    return principal * (1 + annualRate * years);
  }
}
