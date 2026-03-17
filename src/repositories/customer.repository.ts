import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from '../models/customer.model';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(data: Partial<Customer>): Promise<CustomerDocument> {
    const customer = new this.customerModel(data);
    return customer.save();
  }

  async findAll(): Promise<CustomerDocument[]> {
    return this.customerModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<CustomerDocument | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.customerModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<CustomerDocument | null> {
    return this.customerModel.findOne({ email }).exec();
  }
}
