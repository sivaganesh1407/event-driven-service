import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty({ message: 'customerId is required' })
  @IsMongoId({ message: 'customerId must be a valid MongoDB ObjectId' })
  customerId: string;

  @IsNotEmpty({ message: 'portfolioName is required' })
  @IsString()
  portfolioName: string;
}
