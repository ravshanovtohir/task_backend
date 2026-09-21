import { Controller, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll() {
    return this.authService.findAll();
  }
}
