import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoController } from './todo/todo.controller';
import { TodoService } from './todo/todo.service';
import { TodoModule } from './todo/todo.module';
import { Drizzle } from './drizzle/drizzle';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TodoModule, UsersModule, AuthModule, JwtModule],
  controllers: [AppController, TodoController, AuthController],
  providers: [AppService, TodoService, Drizzle, AuthService,UsersService,],
})
export class AppModule {}
