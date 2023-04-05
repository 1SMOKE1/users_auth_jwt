import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersService } from '../users/services/users.service';
import { UserEntity } from '../users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy.service';
import { PassportModule } from '@nestjs/passport';



@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h'
        }
      })
    }),
    PassportModule.register({defaultStrategy: 'jwt'}),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtStrategy, PassportModule],

})
export class AuthModule {}
