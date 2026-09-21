import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto';

@Injectable()
export class AuthService {
  findAll() {
    return `This action returns all auth`;
  }
}
