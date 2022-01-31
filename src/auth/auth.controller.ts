import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/Guard/jwt-auth.guard';
// import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { UserDto } from 'src/users/DTO/user';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signup')
  async signUp(@Body() body: UserDto) {
    const result = await this.authService.signup(body);
    return result;
  }
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: any) {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
