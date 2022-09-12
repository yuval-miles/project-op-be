import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { Request } from 'express';
import { UserDto } from './dto/user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMyUser(@Param() params: { id: string }, @Req() req: Request) {
    return this.usersService.getMyUser(params.id, req);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  updateUser(
    @Body() dto: UserDto,
    @Param() params: { id: string },
    @Req() req: Request,
  ) {
    return this.usersService.updateUser(params.id, req, dto);
  }
}
