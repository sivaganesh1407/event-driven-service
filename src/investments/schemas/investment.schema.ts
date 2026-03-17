import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvestmentDocument = Investment & Document;

export const INVESTMENT_TYPES = ['STOCK', 'BOND', 'MUTUAL_FUND', 'ETF'] as const;

@Schema({ timestamps: true, collection: 'investments' })
export class Investment {
  @Prop({ type: Types.ObjectId, ref: 'Portfolio', required: true })
  portfolioId: Types.ObjectId;

  @Prop({ required: true, enum: INVESTMENT_TYPES })
  type: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  shares: number;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop({ required: true })
  currentValue: number;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
InvestmentSchema.index({ portfolioId: 1 });
