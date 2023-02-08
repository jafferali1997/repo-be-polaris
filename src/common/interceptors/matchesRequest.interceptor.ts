import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class MatchResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((value: any) => {
        return {
          succeeded: true,
          totalRecords: value ? value?.length : 0,
          statusCode: value?.statusCode ? value?.statusCode : HttpStatus.OK,
          message: value?.message ? value.message : 'Operation successful',
          data: value?.data
            ? value.data.map((item: any) => {
                return {
                  id: item.id,
                  name: item.userDetails.name,
                  status: item.status,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                };
              })
            : value.map((item: any) => {
                return {
                  id: item.id,
                  name: item.userDetails.name,
                  status: item.status,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                };
              }),
          meta: value?.metaInfo ? value?.metaInfo : '',
        };
      }),
    );
  }
}
