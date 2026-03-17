import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventQueryDto } from './dto/event-query.dto';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEventDto: CreateEventDto) {
    this.logger.log(`POST /events - Creating ${createEventDto.type} event`);
    const event = await this.eventsService.create(createEventDto);
    return this.toResponse(event);
  }

  @Get()
  async findAll(@Query() query: EventQueryDto) {
    this.logger.log(`GET /events - Listing events`);
    const events = await this.eventsService.findAll(
      query.type,
      query.limit ?? 10,
      query.offset ?? 0,
    );
    return events.map((e) => this.toResponse(e));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`GET /events/${id} - Fetching event`);
    const event = await this.eventsService.findById(id);
    return this.toResponse(event);
  }

  private toResponse(event: { _id: { toString: () => string }; type: string; payload: Record<string, unknown>; createdAt: Date }) {
    return {
      id: event._id.toString(),
      type: event.type,
      payload: event.payload,
      createdAt: event.createdAt,
    };
  }
}
