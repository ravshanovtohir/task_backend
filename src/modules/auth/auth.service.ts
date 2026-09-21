import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto';
import { PrismaService } from '@prisma';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return `This action returns all auth`;
  }

  async login(data: LoginRequestDto) {
    void data;
    throw new Error('Login is not implemented yet.');
  }
}
