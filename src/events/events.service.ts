import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { EVENT_TYPES } from './constants/event-types';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  /**
   * Creates a new domain event with type-specific payload validation.
   * Simulates CDC by persisting events as they occur in the system.
   */
  async create(createEventDto: CreateEventDto): Promise<EventDocument> {
    this.logger.log(`Creating event: ${createEventDto.type}`);

    this.validatePayloadForType(createEventDto.type, createEventDto.payload);

    const event = new this.eventModel({
      type: createEventDto.type,
      payload: createEventDto.payload,
    });

    const saved = await event.save();
    this.logger.debug(`Event created with id: ${saved._id}`);

    return saved;
  }

  /**
   * Retrieves all events with optional filtering and pagination.
   */
  async findAll(type?: string, limit = 50, offset = 0): Promise<EventDocument[]> {
    this.logger.debug(`Finding events - type: ${type ?? 'all'}, limit: ${limit}, offset: ${offset}`);

    const query = type ? { type } : {};
    const events = await this.eventModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(Math.min(limit, 100))
      .lean()
      .exec();

    return events as EventDocument[];
  }

  /**
   * Retrieves a single event by ID.
   */
  async findById(id: string): Promise<EventDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid event ID format');
    }

    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      this.logger.warn(`Event not found: ${id}`);
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  /**
   * Type-specific payload validation for domain events.
   * Ensures payload structure matches expected schema per event type.
   */
  private validatePayloadForType(type: string, payload: Record<string, unknown>): void {
    switch (type) {
      case EVENT_TYPES.ORDER_CREATED:
        this.validateOrderCreatedPayload(payload);
        break;
      case EVENT_TYPES.PAYMENT_PROCESSED:
        this.validatePaymentProcessedPayload(payload);
        break;
      case EVENT_TYPES.USER_REGISTERED:
        this.validateUserRegisteredPayload(payload);
        break;
      default:
        this.logger.warn(`Unknown event type: ${type}, skipping payload validation`);
    }
  }

  private validateOrderCreatedPayload(payload: Record<string, unknown>): void {
    if (!payload.orderId || typeof payload.orderId !== 'string') {
      throw new BadRequestException('ORDER_CREATED payload must include orderId (string)');
    }
    if (!payload.amount || (typeof payload.amount !== 'number' && typeof payload.amount !== 'string')) {
      throw new BadRequestException('ORDER_CREATED payload must include amount (number or string)');
    }
  }

  private validatePaymentProcessedPayload(payload: Record<string, unknown>): void {
    if (!payload.paymentId || typeof payload.paymentId !== 'string') {
      throw new BadRequestException('PAYMENT_PROCESSED payload must include paymentId (string)');
    }
    if (!payload.orderId || typeof payload.orderId !== 'string') {
      throw new BadRequestException('PAYMENT_PROCESSED payload must include orderId (string)');
    }
    if (payload.status !== undefined && typeof payload.status !== 'string') {
      throw new BadRequestException('PAYMENT_PROCESSED payload status must be a string');
    }
  }

  private validateUserRegisteredPayload(payload: Record<string, unknown>): void {
    if (!payload.userId || typeof payload.userId !== 'string') {
      throw new BadRequestException('USER_REGISTERED payload must include userId (string)');
    }
    if (!payload.email || typeof payload.email !== 'string') {
      throw new BadRequestException('USER_REGISTERED payload must include email (string)');
    }
  }
}
