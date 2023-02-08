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
export class ApiPaginationResponseInterceptor<T>
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
          data: value?.data ? value.data : value,
          meta: value?.metaInfo ? value?.metaInfo : '',
        };
      }),
    );
  }
}

// import { applyDecorators, Type } from '@nestjs/common';
// import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
// import { PaginatedDto } from '@/dto/paginated.dto';

// interface IPaginatedDecoratorApiResponse {
//   model: Type<any>;
//   description?: string;
// }

// export const ApiPaginatedResponse = <TModel extends Type<any>>(
//   options: IPaginatedDecoratorApiResponse,
// ) => {
//   return applyDecorators(
//     ApiExtraModels(PaginatedDto),
//     ApiOkResponse({
//       description: options.description || 'Successfully received model list',
//       schema: {
//         allOf: [
//           {
//             $ref: getSchemaPath(PaginatedDto),
//           },
//           {
//             properties: {
//               items: {
//                 type: 'array',
//                 items: {
//                   $ref: getSchemaPath(options.model),
//                 },
//               },
//               meta: {
//                 type: 'any',
//                 default: {
//                   totalItems: 2,
//                   itemCount: 2,
//                   itemsPerPage: 2,
//                   totalPages: 1,
//                   currentPage: 1,
//                 },
//               },
//             },
//           },
//         ],
//       },
//     }),
//   );
// };
