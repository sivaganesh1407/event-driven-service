import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RetirementController } from './retirement.controller';
import { RetirementService } from './retirement.service';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Portfolio, PortfolioSchema } from '../portfolios/schemas/portfolio.schema';
import { Investment, InvestmentSchema } from '../investments/schemas/investment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Portfolio.name, schema: PortfolioSchema },
      { name: Investment.name, schema: InvestmentSchema },
    ]),
  ],
  controllers: [RetirementController],
  providers: [RetirementService],
})
export class RetirementModule {}
