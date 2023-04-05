import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserEntity } from 'src/modules/users/users.entity';
import { IAccessToken } from '../interfaces/IAccessToken';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ){}

  async registrUser( body: CreateUserDto ){

  

    const { email, password, name } = body;
    console.log(email, name, password);

    const newUserBody = new UserEntity();

    if(await this.userExists(email)){
      throw new HttpException('User with current email already exists. Please sign in', HttpStatus.FORBIDDEN);
    }
    
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

    if(name.length < 3){
      throw new HttpException('Your name is too small. Pls write more then  letters', HttpStatus.BAD_REQUEST);
    }

    if(!password) {
      throw new HttpException('Pls create your password for registr in system', HttpStatus.BAD_REQUEST);
    }

    if(password.length < 8){
      throw new HttpException('Your password incorrect', HttpStatus.FORBIDDEN);
    } 

    
  

    newUserBody.password = await this.hashedPassword(password);
    newUserBody.email = email;
    newUserBody.name = name !== undefined ? name : null;

  
    

    return await this.usersService.createUser(newUserBody);
  }

 

  async loginUser( body: CreateUserDto ): Promise<IAccessToken> {
    
    const { email, password } = body;

    const user = await this.usersService.getOneByEmail(email);

    if(!this.emailValidation(email)){
      throw new HttpException('Sorry incorrect email', HttpStatus.UNAUTHORIZED)
    }

    if(user === null){
      throw new HttpException('Sorry user with this email doesn`t exists', HttpStatus.NOT_FOUND);
    }

    if(await this.checkHashPassword(password, user.password)){
      throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED)
    }

    const jwtToken = await this.generateJWT(user);

    return await this.usersService.updateUser(user.id, {...body, ...jwtToken}).then(() => ({...jwtToken}))
  }

  private async hashedPassword( password: string ): Promise<string> {
    return await hash(password, 10);
  }

  private async checkHashPassword( password: string, passwordHash: string ): Promise<boolean> {

    const hashedPass = await this.hashedPassword(password);

    return await compare(hashedPass, passwordHash);
  }

  private async emailValidation( email: string): Promise<boolean>{
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)
  }

  private async userExists( email: string ): Promise<boolean>{
    
    return await this.usersService.getOneByEmail(email) !== null ? true : false ;

  }

  private async generateJWT ( body: UserEntity): Promise<{access_token: string}>{

    const { name, id } = body;

    const payload = { name, sub: id};

    return {access_token: await this.jwtService.signAsync(payload)}

  }
    
}
