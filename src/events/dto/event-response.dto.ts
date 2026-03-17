export class EventResponseDto {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
}
