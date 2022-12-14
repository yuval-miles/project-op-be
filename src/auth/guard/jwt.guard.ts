import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';

export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http')
      return context.switchToHttp().getRequest();
    else if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient<Socket>();
      const authHeader = client.handshake.headers.authentication;
      return {
        headers: {
          authorization:
            authHeader && typeof authHeader === 'string' ? authHeader : '',
        },
      };
    }
  }
}
