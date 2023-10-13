import { ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const CustomApiResponse = ({
  status,
  description,
  type = null
}) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      type
    })
  );
};