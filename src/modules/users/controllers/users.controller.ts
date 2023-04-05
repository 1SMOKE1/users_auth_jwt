import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Res, UseGuards  } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { Response } from 'express';
import { UsersService } from '../services/users.service';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ){}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    // @Headers('Authorization') authorization: string,
    @Res() res: Response
  ) {
    try {
      const users = await this.usersService.getAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('registration')
  async registrUser(
    @Body() user: CreateUserDto,
    @Res() res: Response
  ){
    try {
      const newUser = await this.authService.registrUser(user);
      return res.status(HttpStatus.OK).json(newUser);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

}
