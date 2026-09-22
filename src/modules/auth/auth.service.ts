import * as bcrypt from 'bcrypt';
import { PrismaService } from '@prisma';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, LoginRequestDto } from './dto';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWT_ACCESS_SECRET, JWT_REFRESH_EXPIRE_TIME, JWT_REFRESH_SECRET } from '@config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
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

  async login(data: LoginRequestDto) {
    const staff = await this.validate(data.login);

    if (!staff) {
      throw new NotFoundException('User with this login not found!');
    }

    const isMatch = await bcrypt.compare(data.password, staff.password);

    if (!isMatch) {
      throw new UnauthorizedException('Недействительные учетные данные!');
    }

    const accessToken = this.accessTokenGenerator(staff.id)
    const refreshToken = this.refreshTokenGenerator(staff.id)

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }

  private accessTokenGenerator(staffId: number): string {
    const accessToken = this.jwtService.sign(
      {
        id: staffId
      },
      {
        secret: JWT_ACCESS_SECRET,
      }
    )
    return accessToken
  }

  private refreshTokenGenerator(staffId: number): string {
    const refreshToken = this.jwtService.sign(
      {
        id: staffId
      },
      {
        secret: JWT_REFRESH_SECRET,
        expiresIn: JWT_REFRESH_EXPIRE_TIME,
      }
    )
    return refreshToken
  }
}
