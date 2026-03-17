import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventsService } from './events.service';
import { Event, EventDocument } from './schemas/event.schema';
import { EVENT_TYPES } from './constants/event-types';

describe('EventsService', () => {
  let service: EventsService;
  let model: Model<EventDocument>;

  const mockEvent = {
    _id: new Types.ObjectId(),
    type: EVENT_TYPES.ORDER_CREATED,
    payload: { orderId: 'ord_123', amount: 99.99 },
    createdAt: new Date(),
  };

  const mockEventDocument = {
    ...mockEvent,
    save: jest.fn().mockResolvedValue(mockEvent),
  };

  const mockEventModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const MockModel = jest.fn().mockImplementation(() => mockEventDocument) as unknown as Model<EventDocument>;
    (MockModel as unknown as { find: jest.Mock }).find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            lean: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([mockEvent]),
            }),
          }),
        }),
      }),
    });
    (MockModel as unknown as { findById: jest.Mock }).findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockEvent),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    model = module.get<Model<EventDocument>>(getModelToken(Event.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException for invalid ORDER_CREATED payload (missing amount)', async () => {
      await expect(
        service.create({
          type: EVENT_TYPES.ORDER_CREATED,
          payload: { orderId: 'ord_123' },
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid ORDER_CREATED payload (missing orderId)', async () => {
      await expect(
        service.create({
          type: EVENT_TYPES.ORDER_CREATED,
          payload: { amount: 99.99 },
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(service.findById('invalid-id')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when event not found', async () => {
      (model.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(new Types.ObjectId().toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return events from model', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockEvent);
    });
  });
});
