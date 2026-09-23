import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    const message = this.getMessage(exceptionResponse, statusCode);

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    response.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  }

  private getMessage(exceptionResponse: string | object | null, statusCode: number): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
      const message = exceptionResponse.message;

      if (Array.isArray(message)) {
        return String(message[0] ?? 'VALIDATION_ERROR');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'INTERNAL_SERVER_ERROR';
    }

    return 'UNKNOWN_ERROR';
  }
}
