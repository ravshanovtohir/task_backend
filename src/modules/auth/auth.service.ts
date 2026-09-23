import * as bcrypt from 'bcrypt';
import { PrismaService } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, LoginRequestDto } from './dto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRE_TIME, JWT_REFRESH_SECRET } from '@config';
import { AuthRepository } from './auth.repository';
import * as crypto from 'crypto';
import { RedisService } from '@redis';

@Injectable()
export class AuthService {
  private readonly REFRESH_EXPIRES_IN_DAYS = 10;
  private readonly REFRESH_EXPIRES_IN_SECONDS = 10 * 24 * 60 * 60;
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly redisService: RedisService,
  ) {}

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

  async login(data: LoginRequestDto, meta: { ip: string; userAgent: string }) {
    const staff = await this.validate(data.login);

    if (!staff) {
      throw new NotFoundException('User with this login not found!');
    }

    const isMatch = await bcrypt.compare(data.password, staff.password);

    if (!isMatch) {
      throw new UnauthorizedException('Недействительные учетные данные!');
    }

    await this.authRepository.deActivateAllSessions(staff.id);

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
      expiresAt,
    });

    await this.redisService.set(
      `admin:active_session:${staff.id}`,
      session.id.toString(),
      this.REFRESH_EXPIRES_IN_SECONDS,
    );

    const accessToken = this.accessTokenGenerator(staff.id, session.id);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async getMe(staffId: number) {
    const staff = await this.authRepository.getStaffById(staffId);
    return {
      id: staff.id,
      first_name: staff.firstName,
      last_name: staff.lastName,
      email: staff.email,
      roles: staff.roles.map((item) => item.role.key),
      created_at: staff.createdAt,
    };
  }

  private accessTokenGenerator(staffId: number, sid: string): string {
    const accessToken = this.jwtService.sign(
      {
        id: staffId,
        sid: sid,
      },
      {
        secret: JWT_ACCESS_SECRET,
      },
    );
    return accessToken;
  }

  async refresh(refreshToken: string) {
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await this.authRepository.findByTokenHash(refreshTokenHash);

    if (!session || !session.isActive || session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Сессия недействительна или срок её действия истёк.');
    }

    const activeSessionId = await this.redisService.get(`admin:active_session:${session.staffId}`);

    if (activeSessionId !== session.id) {
      throw new UnauthorizedException('Сессия была завершена после входа с другого устройства.');
    }

    const newRefreshToken = crypto.randomBytes(64).toString('hex');

    const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    // Refresh token rotation: eski token endi ishlamaydi.
    await this.authRepository.updateRefreshTokenHash(session.id, newRefreshTokenHash);

    const redisTtl = Math.max(1, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000));

    await this.redisService.set(`admin:active_session:${session.staffId}`, session.id, redisTtl);

    const accessToken = this.accessTokenGenerator(session.staffId, session.id);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(staffId: number, sessionId: string) {
    const session = await this.authRepository.findSessionById(sessionId);

    if (!session || session.staffId !== staffId || !session.isActive) {
      throw new UnauthorizedException('Сессия не найдена или уже завершена.');
    }

    await this.authRepository.deactivateSession(session.id);

    const redisKey = `admin:active_session:${staffId}`;
    const activeSessionId = await this.redisService.get(redisKey);

    if (activeSessionId === session.id) {
      await this.redisService.delete(redisKey);
    }

    return {
      message: 'Вы успешно вышли из системы.',
    };
  }
}
