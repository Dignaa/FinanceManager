import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
        console.log('JwtAuthGuard error:', err, 'info:', info);
      throw new UnauthorizedException('Authentication failed: Invalid or expired token');
    }
    return user;
  }
}
