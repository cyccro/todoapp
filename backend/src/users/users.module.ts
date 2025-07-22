import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Drizzle } from 'src/drizzle/drizzle';

@Module({
  providers: [Drizzle, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
