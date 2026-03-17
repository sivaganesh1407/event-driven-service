import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface ApiResponse<T> {
  status: 'success';
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          return { status: 'success' as const, data };
        }
        return { status: 'success' as const, data };
      }),
    );
  }
}
