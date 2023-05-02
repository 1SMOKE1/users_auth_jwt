import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserEntity } from 'src/modules/users/users.entity';
import { ITokens } from '../interfaces/ITokens';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ){}

  async signUp( body: CreateUserDto ){

  

    const { email, password, name } = body;

    const newUserBody = new UserEntity();

    if(!email) {
      throw new HttpException('Pls write your email for registr in system', HttpStatus.BAD_REQUEST);
    }

    if(!this.emailValidation(email)){
      throw new HttpException('Your email incorrect', HttpStatus.FORBIDDEN);

      /*
        example of valid email:
        mysite@ourearth.com
        my.ownsite@ourearth.org
        mysite@you.me.net 
      */
    }

    if(await this.userExists(email)){
      throw new HttpException('User with current email already exists. Please sign in', HttpStatus.FORBIDDEN);
    }

    if(!password) {
      throw new HttpException('Pls create your password for registr in system', HttpStatus.BAD_REQUEST);
    }

    if(password.length < 8){
      throw new HttpException('Your password incorrect', HttpStatus.FORBIDDEN);
    } 

    
  

    newUserBody.password = await this.hashedData(password);
    newUserBody.email = email;
    if(name){
      if(name.length < 3){
        throw new HttpException('Your name is too small. Pls write more then  letters', HttpStatus.BAD_REQUEST);  
      }
      newUserBody.name = name;
    } else {
      newUserBody.name = null;
    }
   

    return await this.usersService.createUser(newUserBody);
  }

 

  async signIn( body: CreateUserDto ): Promise<ITokens> {
    
    const { email, password } = body;

    if(!this.emailValidation(email)){
      throw new HttpException('Sorry incorrect email', HttpStatus.UNAUTHORIZED)
    }

    const user = await this.usersService.getOneByEmail(email);

    if(await this.checkHashPassword(password, user.password)){
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED)
    }

    if(user === null){
      throw new HttpException('Sorry user with this email doesn`t exists', HttpStatus.NOT_FOUND);
    }

    

    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user);
    
  

    return tokens;
  }

  private async hashedData( data: string ): Promise<string> {
    return await hash(data, 10);
  }

  private async checkHashPassword( password: string, passwordHash: string ): Promise<boolean> {

    const hashedPass = await this.hashedData(password);

    return await compare(hashedPass, passwordHash);
  }

  private async emailValidation( email: string): Promise<boolean>{
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)
  }

  private async userExists( email: string ): Promise<boolean>{
    
    return await this.usersService.getOneByEmail(email) !== null ? true : false ;

  }

  private async getTokens ( body: UserEntity ): Promise<ITokens>{

    const { email, id } = body;

    const payload = { email, sub: id};

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1h'
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d'
      })
    ])

    return {
      access_token,
      refresh_token
    }
  }
    

  async updateRefreshToken( body: UserEntity ) {

    const { id, email } = body;

    const payload = { email, sub: id};

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d'
    })
    await this.usersService.updateUser(id, {
      refresh_token: newRefreshToken
    });

  }

  async logout(userId: string) {
    return this.usersService.updateUser(+userId, { refresh_token: null });
  }
}
