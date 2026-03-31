import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from './pagination.dto';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'data' in data && 'total' in data && 'page' in data) {
          const paginatedData = data as PaginatedResult<any>;
          const { data: actualData, ...meta } = paginatedData;
          return {
            success: true,
            message: 'Successfully',
            data: actualData as unknown as T,
            meta,
          };
        }

        return {
          success: true,
          message: 'Successfully',
          data,
        };
      }),
    );
  }
}
