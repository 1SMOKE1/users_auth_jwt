import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { SignInDto } from '../dto/signIn.dto';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ITokens } from '../interfaces/ITokens';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ){}

  @Post('signIn')
  async signIn(
    @Body() body: SignInDto,
    @Res() res: Response
  ){
    try {
      const tokens: ITokens = await this.authService.signIn(body);
      return res.status(HttpStatus.OK).json(tokens);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Post('signUp')
  async signUp(
    @Body() body: CreateUserDto,
    @Res() res: Response
  ){
    try {
      const newUser = await this.authService.signUp(body);
      return res.status(HttpStatus.OK).json(newUser);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @Get('logout')
  async logout(
    @Req() req: Request
  ){
    await this.authService.logout(req.user['sub']);
  }

}
