import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';

interface IJwtPayload {
  sub: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: IJwtPayload) {
    const data = { id: payload.sub, email: payload.email };

    const { password, ...user } = await this.userService.findByCondition(data);

    if (!user) {
      throw new UnauthorizedException('У вас не доступа к этой странице');
    }

    return user;
  }
}
