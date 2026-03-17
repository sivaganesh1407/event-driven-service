import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestmentDto {
  @IsNotEmpty({ message: 'portfolioId is required' })
  @IsMongoId({ message: 'portfolioId must be a valid MongoDB ObjectId' })
  portfolioId: string;

  @IsNotEmpty({ message: 'assetName is required' })
  @IsString()
  assetName: string;

  @IsNotEmpty({ message: 'amount is required' })
  @IsNumber()
  @Min(0.01, { message: 'amount must be a positive number' })
  @Type(() => Number)
  amount: number;
}
