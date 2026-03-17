/**
 * Supported event types for CDC simulation.
 * These represent domain events that flow through the event-driven system.
 */
export const EVENT_TYPES = {
  ORDER_CREATED: 'ORDER_CREATED',
  PAYMENT_PROCESSED: 'PAYMENT_PROCESSED',
  USER_REGISTERED: 'USER_REGISTERED',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export const EVENT_TYPE_VALUES = Object.values(EVENT_TYPES);
