import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Route = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const localPort = req.socket.localPort;
    const route = `${req.protocol}://${req.hostname}${
      localPort ? ':' + localPort : ''
    }${req.path}`;
    return route;
  },
);
