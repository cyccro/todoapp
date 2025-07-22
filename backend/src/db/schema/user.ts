import { pgTable, integer, text, } from "drizzle-orm/pg-core";
import { task_table } from "./todo";


/**
* Table used for getting track of users on the db.
*/
export const users_table = pgTable("users",{
  id: integer().notNull().generatedAlwaysAsIdentity(),
  username: text().notNull(),
  email: text().unique().notNull(),
  password: text().notNull(),
});
