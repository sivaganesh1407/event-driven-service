import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';
import { CreateCustomerDto } from '../common/dto/create-customer.dto';
import { CustomerDocument } from '../models/customer.model';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDocument> {
    this.logger.log(`Creating customer: ${createCustomerDto.email}`);

    const existing = await this.customerRepository.findByEmail(createCustomerDto.email);
    if (existing) {
      throw new ConflictException(`Customer with email ${createCustomerDto.email} already exists`);
    }

    const customer = await this.customerRepository.create({
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      retirementGoal: createCustomerDto.retirementGoal,
      riskProfile: createCustomerDto.riskProfile,
    });

    this.logger.debug(`Customer created with id: ${customer._id}`);
    return customer;
  }

  async findAll(): Promise<CustomerDocument[]> {
    this.logger.debug('Finding all customers');
    return this.customerRepository.findAll();
  }

  async findById(id: string): Promise<CustomerDocument> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }
}
