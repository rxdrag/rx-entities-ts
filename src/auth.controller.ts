import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  login(): string {
    return 'login';
  }

  @Get('me')
  getMe(): string {
    return 'me';
  }
}
