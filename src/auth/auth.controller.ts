import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signIn(@Body() dto: AuthDto, @Res() res: Response) {
    return this.authService.signIn(dto, res);
  }

  @Get('signout')
  signOut(@Res() res: Response) {
    return this.authService.signOut(res);
  }

  @Get('checkemail')
  checkEmail(@Query() { email }: { email: string }) {
    return this.authService.checkEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAuth(@Req() req: Request) {
    return req.user;
  }
}
