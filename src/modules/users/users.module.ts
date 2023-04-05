import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { AuthService } from '../auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule
  ],
  providers: [UsersService, AuthService],
  controllers: [UsersController],
  exports: [TypeOrmModule.forFeature([UserEntity]), UsersService]
})
export class UsersModule {}
