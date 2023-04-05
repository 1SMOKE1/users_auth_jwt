import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';


@Injectable()
export class UsersService {

  @InjectRepository(UserEntity)
  private readonly usersRepository: Repository<UserEntity> 

  public async getAll(): Promise<UserEntity[]>{
    return await this.usersRepository.find();
  }

  public async getOneById( id: number ): Promise<UserEntity | null>{
    return await this.usersRepository.findOne({where: {id}});
  } 

  public async getOneByEmail( email: string ): Promise<UserEntity | null>{
    return await this.usersRepository.findOne({where: {email}});
  }

  public async getOneByName( name: string ): Promise<UserEntity | null>{
    return await this.usersRepository.findOne({where: {name}});
  }

  public async createUser( body: CreateUserDto ): Promise<UserEntity>{
    const newUser = this.usersRepository.create(body);
    return await this.usersRepository.save(newUser);
  }

  public async updateUser( id: number, body: UpdateUserDto ): Promise<UserEntity | null>{
    return await this.usersRepository.update(id, body).then(() => this.getOneById(id));
  }

}
