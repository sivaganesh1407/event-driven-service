import { Controller, Get, Post, Body, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDocument } from './schemas/customer.schema';

@Controller('customers')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    this.logger.log('POST /customers - Creating customer');
    const customer = await this.customersService.create(createCustomerDto);
    return this.toResponse(customer);
  }

  @Get()
  async findAll() {
    this.logger.log('GET /customers - Listing customers');
    const customers = await this.customersService.findAll();
    return customers.map((c) => this.toResponse(c));
  }

  private toResponse(customer: CustomerDocument) {
    return {
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      dateOfBirth: customer.dateOfBirth,
      retirementAge: customer.retirementAge,
      createdAt: customer.createdAt,
    };
  }
}
