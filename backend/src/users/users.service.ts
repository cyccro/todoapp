import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { None, Option, Some } from 'oxide.ts';
import { users_table } from 'src/db/schema/user';
import { Drizzle } from 'src/drizzle/drizzle';
import { UserRegisterDto } from 'src/dto/User';

export interface User {
  id: number;
  username: string;
  email:string;
  password:string;
}

@Injectable()
export class UsersService {
  constructor(private readonly drizzle:Drizzle) {}

  /**
  * Register a new user using the provided `dto`
  */
  async register_user(dto: UserRegisterDto){
    return await this.drizzle.instance().insert(users_table).values({
      email: dto.email,
      username: dto.username,
      password: dto.password
    });
  }
  
  async find_by_email(email:string):Promise<Option<User>> {
    const out = await this.drizzle.instance().select().from(users_table).where(eq(users_table.email, email)).execute();
    if(out.length == 0) return None;
    else return Some(out[0]);
  }

  async find_by_id(id:number):Promise<Option<User>> {
    const out = await this.drizzle.instance().select().from(users_table).where(eq(users_table.id, id)).execute();
    if(out.length == 0) return None;
    else return Some(out[0]);
  }
}
