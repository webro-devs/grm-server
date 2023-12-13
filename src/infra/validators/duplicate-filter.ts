import { HttpException, HttpStatus } from '@nestjs/common';

class InternalServerErrorException extends HttpException {
  constructor(message: string) {
    super({ statusCode: HttpStatus.BAD_REQUEST, message }, HttpStatus.BAD_REQUEST);
  }
}

export default InternalServerErrorException;