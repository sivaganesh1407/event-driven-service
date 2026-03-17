import { IsEmail, IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RISK_PROFILES } from '../../models/customer.model';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'retirementGoal is required' })
  @IsNumber()
  @Min(0, { message: 'retirementGoal must be a positive number' })
  @Type(() => Number)
  retirementGoal: number;

  @IsNotEmpty({ message: 'riskProfile is required' })
  @IsEnum(RISK_PROFILES, {
    message: `riskProfile must be one of: ${RISK_PROFILES.join(', ')}`,
  })
  riskProfile: string;
}
