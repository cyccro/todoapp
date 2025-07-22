import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { Err, Ok, Result } from 'oxide.ts';
import { task_table } from 'src/db/schema/todo';

import { Drizzle } from 'src/drizzle/drizzle';
import { TodoCreationDto, TodoModificationDto } from 'src/dto/Todo';
import { DbError } from 'src/enums/DbError';

@Injectable()
export class TodoService {
  constructor(private readonly drizzle: Drizzle) { }

  /**
  * Returns the todo task with the given id
  */
  async from_id(id: number) {
    return await this.drizzle.instance().select().from(task_table).where(eq(task_table.id, id)).execute();
  }
  /**
  * Returns every todo task from everyone
  */
  async all() {
    return await this.drizzle.instance().select().from(task_table).execute();

  }

  /**
  * Returns every todo task of the owner with the given `email`
  */
  async all_with_owner(id: number) {
    return await this.drizzle.instance().select().from(task_table).where(eq(task_table.owner_id, id));
  }

  /**
  * Creates a new todo task with the given `dto` and return it's id
  */
  async create_todo(dto: TodoCreationDto): Promise<Result<number, DbError>> {
    const task = await this.drizzle.instance().insert(task_table).values({
      title: dto.title,
      description: dto.description,
      created_at: dto.created_at,
      owner_id: dto.owner
    }).returning();
    if (task.length == 0) return Err(DbError.Conflict);
    else return Ok(task[0].id);
  }

  /**
  * Removes the task with the given `task` id from the given `owner` id
  */
  async delete_from_user(owner: number, task: number) {
    const rm_task = await this.drizzle.instance()
      .delete(task_table)
      .where(
        and(
          eq(task_table.id, task),
          eq(task_table.owner_id, owner)
        )
      ).returning();
    return rm_task;
  }

  /**
  * Updates the todo based on the given `dto`.
  * Sets the todo title and description to have with the given `dto.id` to have the values of the dto
  */
  async update(dto: TodoModificationDto) {
    return await this.drizzle.instance().update(task_table).set({
      title: dto.title,
      description: dto.description
    }).where(eq(task_table.id, dto.id));
  }

  /**
  * Marks the task with the given id as completed
  */
  async mark_complete(owner: number, id: number) {
    return await this.drizzle.instance()
      .update(task_table)
      .set({
        completed_at: new Date().toISOString()
      }).where(
        and(
          eq(task_table.id, id),
          eq(task_table.owner_id, owner)
        )
      )
  }
}
