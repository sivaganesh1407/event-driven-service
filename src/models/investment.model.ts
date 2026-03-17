import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvestmentDocument = Investment & Document;

@Schema({ timestamps: true, collection: 'investments' })
export class Investment {
  @Prop({ type: Types.ObjectId, ref: 'Portfolio', required: true })
  portfolioId: Types.ObjectId;

  @Prop({ required: true })
  assetName: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const InvestmentSchema = SchemaFactory.createForClass(Investment);
InvestmentSchema.index({ portfolioId: 1 });
