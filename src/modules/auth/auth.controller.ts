import { Body, Controller, Get, Headers, Ip, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginRequestDto } from './dto'
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ summary: "Login", description: "Login" })
  @Post('login')
  async login(@Body() data: LoginRequestDto, @Ip() ip: string, @Headers('user-agent') userAgent: string) {
    return this.authService.login(data, {ip, userAgent});
  }

  @ApiOperation({ summary: "Get me", description: "Get me" })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe() {
    return
  }
}
