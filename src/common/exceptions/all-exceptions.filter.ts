import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import { Prisma } from '@prisma/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;

    let key = this.getMessageKey(exceptionResponse, statusCode);

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        statusCode = HttpStatus.CONFLICT;
        key = 'main.error.common.duplicate';
      } else if (exception.code === 'P2003') {
        statusCode = HttpStatus.CONFLICT;
        key = 'main.error.common.foreignKey';
      } else if (exception.code === 'P2025') {
        statusCode = HttpStatus.NOT_FOUND;
        key = 'main.error.common.notFound';
      }
    }

    const i18n = I18nContext.current(host);
    const message = i18n ? String(i18n.t(key as never)) : key;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      console.error(exception);
    }

    response.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  }

  private getMessageKey(exceptionResponse: string | object | null, statusCode: number): string {
    let message: unknown = exceptionResponse;
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse) {
      message = exceptionResponse.message;
    }

    if (Array.isArray(message)) {
      message = message[0];
    }

    if (typeof message === 'string' && message.startsWith('main.')) {
      return message;
    }

    const defaults: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'main.error.common.badRequest',
      [HttpStatus.UNAUTHORIZED]: 'main.error.common.unauthorized',
      [HttpStatus.FORBIDDEN]: 'main.error.common.forbidden',
      [HttpStatus.NOT_FOUND]: 'main.error.common.notFound',
      [HttpStatus.CONFLICT]: 'main.error.common.conflict',
    };

    return defaults[statusCode] ?? 'main.error.common.internalServer';
  }
}
