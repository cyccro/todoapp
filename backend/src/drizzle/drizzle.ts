import { Injectable } from '@nestjs/common';
import {drizzle} from "drizzle-orm/node-postgres";

/**
* Drizzle injectable used for managing the database
*/
@Injectable()
export class Drizzle {
  private readonly inner = drizzle(process.env.DATABASE_URL!);
  /**
  * Executes the given `s` string as a raw sql query
  */
  async raw(s:string) {
    return await this.inner.execute(s);
  }

  /**
  * Retrieves the actual drizzle db manager
  */
  public instance(){
    return this.inner;
  }
  
}
