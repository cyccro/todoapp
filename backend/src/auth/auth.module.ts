import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

import {config} from "dotenv";
import { JwtStrategy } from './jwt.strategy';
config();


@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions: {expiresIn: '1h'}
    })
  ],
  providers: [AuthService,JwtStrategy]
})
export class AuthModule {}
