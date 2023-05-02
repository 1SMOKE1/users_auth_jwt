import { BadRequestException, Controller, Get, HttpStatus, Res, UseGuards  } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';

@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService,
  ){}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(
    @Res() res: Response
  ) {
    try {
      const users = await this.usersService.getAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }


}
