import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        let jsonResponse, appCode, message;
        const response = context.switchToHttp().getResponse();
        let statusCode = response?.statusCode || ''
        if (data?.httpStatusCode) {
          jsonResponse = data?.data || {}
          statusCode = data.httpStatusCode
        } else {
          jsonResponse = data
        }

        if (data?.message) {
          message = data.message
        }

        if (statusCode === 204) {
          response.status(HttpStatus.NO_CONTENT)
          return data
        } else {
          response.status(statusCode);

          return {
            statusCode,
            ...(appCode ? { appCode } : {}),
            ...(message ? { message } : {}),
            data: jsonResponse
          }
        }
      }),
    );
  }
}
