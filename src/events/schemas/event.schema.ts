import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EVENT_TYPE_VALUES } from '../constants/event-types';

export type EventDocument = Event & Document;

@Schema({ timestamps: true, collection: 'events' })
export class Event {
  @Prop({ required: true, enum: EVENT_TYPE_VALUES })
  type: string;

  @Prop({ type: Object, required: true })
  payload: Record<string, unknown>;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

// Index for efficient queries by type and createdAt
EventSchema.index({ type: 1 });
EventSchema.index({ createdAt: -1 });
