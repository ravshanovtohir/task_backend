import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {LoginRequestDto} from './dto'
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({summary: "Login", description: "Login"})
  @Post('login')
  async login(@Body()data: LoginRequestDto) {
    return this.authService.login(data);
  }

  @ApiOperation({summary: "Get me", description: "Get me"})
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe() {
    return
  }
}
