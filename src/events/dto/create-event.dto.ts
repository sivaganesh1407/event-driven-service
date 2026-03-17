import { IsEnum, IsObject } from 'class-validator';
import { EVENT_TYPE_VALUES } from '../constants/event-types';

export class CreateEventDto {
  @IsEnum(EVENT_TYPE_VALUES, {
    message: `type must be one of: ${EVENT_TYPE_VALUES.join(', ')}`,
  })
  type: string;

  @IsObject({ message: 'payload must be a valid object' })
  payload: Record<string, unknown>;
}
