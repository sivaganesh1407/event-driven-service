import { IsDate, IsEmail, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(50)
  @Max(80)
  retirementAge?: number = 65;
}
