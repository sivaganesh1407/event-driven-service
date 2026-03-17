import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../common/dto/create-customer.dto';
import { CustomerDocument } from '../models/customer.model';

@Controller('customers')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    this.logger.log('POST /customers - Creating customer');
    const customer = await this.customerService.create(createCustomerDto);
    return this.toResponse(customer);
  }

  @Get()
  async findAll() {
    this.logger.log('GET /customers - Listing customers');
    const customers = await this.customerService.findAll();
    return customers.map((c) => this.toResponse(c));
  }

  private toResponse(customer: CustomerDocument) {
    return {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      retirementGoal: customer.retirementGoal,
      riskProfile: customer.riskProfile,
      createdAt: customer.createdAt,
    };
  }
}
