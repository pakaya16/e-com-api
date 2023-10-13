import { UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import * as JsonException from "../exceptions/unauthorized.exception.json";

function error_401() {
  throw new UnauthorizedException(JsonException.bearerUnauthorized);
}

function error_400(message = '') {
  throw new BadRequestException(message);
}

function error_404(message = '') {
  throw new NotFoundException(message);
}

function debug(message) {
  throw new BadRequestException(message);
}


export {
  error_400,
  error_401,
  error_404,
  debug
}