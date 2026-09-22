import { Body, Controller, Get, Headers, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LoginRequestDto, RefreshTokenDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { IRequest } from '@interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login', description: 'Login' })
  @Post('login')
  async login(@Body() data: LoginRequestDto, @Ip() ip: string, @Req() request: Request) {
    const rawUserAgent = request.headers['user-agent'];
    const userAgent = Array.isArray(rawUserAgent) ? rawUserAgent[0] : (rawUserAgent ?? 'unknown');
    return this.authService.login(data, { ip, userAgent });
  }

  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Refresh Token',
  })
  @Post('refresh')
  async refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refresh(data.refresh_token);
  }

  @ApiOperation({ summary: 'Logout', description: 'logout' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() request: IRequest) {
    return this.authService.logout(request.user.id, request.user.sid);
  }

  @ApiOperation({ summary: 'Get me', description: 'Get me' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() request: IRequest) {
    return this.authService.getMe(request.user.id);
  }
}
