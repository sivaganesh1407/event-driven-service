import { IsDate, IsEnum, IsMongoId, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { INVESTMENT_TYPES } from '../schemas/investment.schema';

export class CreateInvestmentDto {
  @IsMongoId()
  portfolioId: string;

  @IsEnum(INVESTMENT_TYPES)
  type: string;

  @IsString()
  symbol: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  shares: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  purchasePrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  currentValue: number;

  @IsDate()
  @Type(() => Date)
  purchaseDate: Date;
}
