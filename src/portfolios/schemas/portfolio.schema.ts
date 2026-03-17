import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true, collection: 'portfolios' })
export class Portfolio {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
PortfolioSchema.index({ customerId: 1 });
