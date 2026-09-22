import * as bcrypt from 'bcrypt';
import { PrismaService } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, LoginRequestDto } from './dto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRE_TIME, JWT_REFRESH_SECRET } from '@config';
import { AuthRepository } from './auth.repository';
import * as crypto from 'crypto';
import { RedisService } from '@helpers';

@Injectable()
export class AuthService {
  private readonly REFRESH_EXPIRES_IN_DAYS = 10;
  private readonly REFRESH_EXPIRES_IN_SECONDS = 10 * 24 * 60 * 60;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly redisService: RedisService
  ) { }

  async findAll() {
    return `This action returns all auth`;
  }

  async validate(email: string) {
    const staff = await this.prisma.staff.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      },
    });

    if (!staff) {
      throw new NotFoundException('Пользователь не существует!');
    }

    return {
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      emai: staff.email,
      password: staff.password,
    };
  }

  async login(data: LoginRequestDto, meta: {ip: string, userAgent: string}) {
    const staff = await this.validate(data.login);

    if (!staff) {
      throw new NotFoundException('User with this login not found!');
    }

    const isMatch = await bcrypt.compare(data.password, staff.password);

    if (!isMatch) {
      throw new UnauthorizedException('Недействительные учетные данные!');
    }

    await this.authRepository.deActivateAllSessions(staff.id)

    const newRefreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_EXPIRES_IN_DAYS);

    const session = await this.authRepository.creaetNewSession({
      staffId: staff.id,
      refreshTokenHash,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
      isActive: true,
      expiresAt
    })

    await this.redisService.set(
      `admin:active_session:${staff.id}`,
      session.id.toString(),
      this.REFRESH_EXPIRES_IN_SECONDS,
    );

    const accessToken = this.accessTokenGenerator(staff.id, session.id)

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken
    }
  }

  private accessTokenGenerator(staffId: number, sid: number): string {
    const accessToken = this.jwtService.sign(
      {
        id: staffId,
        sid: sid
      },
      {
        secret: JWT_ACCESS_SECRET,
      }
    )
    return accessToken
  }
}
