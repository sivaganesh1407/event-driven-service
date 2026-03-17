import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const RISK_PROFILES = ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] as const;
export type RiskProfile = (typeof RISK_PROFILES)[number];

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  retirementGoal: number;

  @Prop({ required: true, enum: RISK_PROFILES })
  riskProfile: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
