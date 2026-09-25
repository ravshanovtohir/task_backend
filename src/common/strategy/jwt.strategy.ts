import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@interfaces';
import { PrismaService } from '@prisma';
import { RedisService } from '@redis';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }
  async validate(payload: IUser) {
    const [staff, activeSessionId] = await Promise.all([
      this.prisma.staff.findUnique({
        where: { id: payload.id, deletedAt: null },
        select: {
          id: true,
          roles: {
            select: {
              role: {
                select: {
                  key: true,
                },
              },
            },
          },
        },
      }),
      this.redisService.get(`admin:active_session:${payload.id}`),
    ]);

    if (!staff) {
      throw new UnauthorizedException('main.error.auth.userNotFound');
    }

    if (!activeSessionId || activeSessionId !== String(payload.sid)) {
      throw new UnauthorizedException('main.error.auth.sessionRevoked');
    }

    return {
      id: +staff.id,
      sid: payload.sid,
      roles: staff.roles.map((item) => item.role.key),
    };
  }
}
