import { IsMongoId, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsMongoId()
  customerId: string;

  @IsString()
  name: string;
}
