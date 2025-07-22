import { pgTable, integer, text, date } from "drizzle-orm/pg-core";
import { users_table } from "./user";


export const task_table =pgTable("tasks", {
  owner_id: integer().notNull().references(()=>users_table.id),
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  description: text().notNull(),
  created_at:date().notNull(),
  completed_at:date()
});
