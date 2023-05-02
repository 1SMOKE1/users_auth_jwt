import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersService } from '../users/services/users.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.strategy';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({})
  ],
  providers: [
    AuthService,
    UsersService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
