import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, LoginRequestDto } from './dto';
import { PrismaService } from '@prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
  }
}
