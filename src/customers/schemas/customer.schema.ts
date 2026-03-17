import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, default: 65 })
  retirementAge: number;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ email: 1 });
