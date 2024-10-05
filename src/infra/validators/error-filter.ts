import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log("Error: \n", exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      status: exception?.message,
      message: exception['response']?.message,
    });
  }
}

export default ErrorFilter;
