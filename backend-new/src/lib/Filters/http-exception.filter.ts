import { ExceptionFilter, HttpException } from '@nestjs/common';
import { GraphQLError } from 'graphql';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'object' && exceptionResponse['message']
        ? (exceptionResponse['message'] as string)
        : exception.message;

    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    throw new GraphQLError(message, {
      extensions: errorResponse,
    });
  }
}
