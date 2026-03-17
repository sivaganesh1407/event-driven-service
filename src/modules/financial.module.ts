import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '../models/customer.model';
import { Portfolio, PortfolioSchema } from '../models/portfolio.model';
import { Investment, InvestmentSchema } from '../models/investment.model';
import { CustomerRepository } from '../repositories/customer.repository';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import { InvestmentRepository } from '../repositories/investment.repository';
import { CustomerService } from '../services/customer.service';
import { PortfolioService } from '../services/portfolio.service';
import { InvestmentService } from '../services/investment.service';
import { RetirementService } from '../services/retirement.service';
import { CustomerController } from '../controllers/customer.controller';
import { PortfolioController } from '../controllers/portfolio.controller';
import { InvestmentController } from '../controllers/investment.controller';
import { RetirementController } from '../controllers/retirement.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Investment.name, schema: InvestmentSchema },
    ]),
  ],
  controllers: [
    CustomerController,
    PortfolioController,
    InvestmentController,
    RetirementController,
  ],
  providers: [
    CustomerRepository,
    PortfolioRepository,
    InvestmentRepository,
    CustomerService,
    PortfolioService,
    InvestmentService,
    RetirementService,
  ],
})
export class FinancialModule {}
