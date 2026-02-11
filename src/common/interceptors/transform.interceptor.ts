import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Si ya tiene el formato { data: ... }, no lo envuelve de nuevo
        if (data && typeof data === 'object' && 'data' in data) {
          return data;
        }
        // Envuelve la respuesta en { data: ... }
        return { data };
      }),
    );
  }
}
