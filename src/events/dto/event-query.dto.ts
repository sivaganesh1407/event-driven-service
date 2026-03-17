import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EVENT_TYPE_VALUES } from '../constants/event-types';

export class EventQueryDto {
  @IsOptional()
  @IsEnum(EVENT_TYPE_VALUES, {
    message: `type must be one of: ${EVENT_TYPE_VALUES.join(', ')}`,
  })
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
