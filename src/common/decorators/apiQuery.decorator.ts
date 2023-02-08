import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiQueryArray(roles) {
  const final = roles.map((item) => ApiQuery(item));
  return applyDecorators(...final);
}
