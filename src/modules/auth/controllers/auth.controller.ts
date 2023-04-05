import { BadRequestException, Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { IAccessToken } from '../interfaces/IAccessToken';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res() res: Response
  ){
    try {
      const accessToken: IAccessToken = await this.authService.loginUser(body);
      return res.status(HttpStatus.OK).json(accessToken);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

}
