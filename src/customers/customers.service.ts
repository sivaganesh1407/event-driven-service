import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDocument> {
    this.logger.log(`Creating customer: ${createCustomerDto.email}`);

    const existing = await this.customerModel.findOne({ email: createCustomerDto.email }).exec();
    if (existing) {
      throw new ConflictException(`Customer with email ${createCustomerDto.email} already exists`);
    }

    const customer = new this.customerModel(createCustomerDto);
    const saved = await customer.save();
    this.logger.debug(`Customer created with id: ${saved._id}`);
    return saved;
  }

  async findAll(): Promise<CustomerDocument[]> {
    this.logger.debug('Finding all customers');
    return this.customerModel.find().sort({ createdAt: -1 }).exec();
  }
}
