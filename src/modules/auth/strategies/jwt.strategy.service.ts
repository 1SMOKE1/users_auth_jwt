import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/services/users.service';
import { IUserJwtPayload } from '../interfaces/IUserJwtPayload';
import { UserEntity } from 'src/modules/users/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ){
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jsonWebTokenOptions: {
        complete: true
      }
    })
  }

  async validate( payload: IUserJwtPayload ): Promise<UserEntity> {

    const { sub } = payload.payload;

    const { signature } = payload;

    const user = await this.usersService.getOneById(sub);

    if(user === null) {
      throw new UnauthorizedException();
    }

    const userSignature = user.access_token.split('.');

    if(userSignature[userSignature.length - 1] !== signature){
      throw new UnauthorizedException();
    }




    return user;
  }
}
