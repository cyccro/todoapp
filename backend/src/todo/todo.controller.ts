import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from 'src/auth/jwt_auth.guard';
import { TodoCreationDto, TodoModificationDto } from 'src/dto/Todo';
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('todo-controller')
@Controller('todo')
export class TodoController {

  constructor(
    private readonly todo_service: TodoService
  ) { }

  @ApiOperation({ summary: 'Gets all the tasks from the respective user' })
  @ApiOkResponse({ description: 'Values returned successfully' })
  @ApiForbiddenResponse({ description: 'The provided token is expired or invalid' })
  @ApiBearerAuth("AccessToken")
  @UseGuards(JwtAuthGuard)
  @Get("all")
  async get_all_of(@Request() req) {
    const todos = await this.todo_service.all_with_owner(req.user.id);
   
    return todos;
  }

  /**
  * Creates a new post with the given `dto`
  */
  @ApiOperation({ summary: 'Creates a todo task' })
  @ApiOkResponse({ description: 'The todo was created correctly' })
  @ApiForbiddenResponse({ description: 'The provided token is expired or invalid, or the user id and the requested owner id do not match' })
  @ApiConflictResponse({ description: 'The request was malformmed and the data could not be inserted' })
  @ApiBody({
    description: 'The data that will be saved on the todo', type: TodoCreationDto, examples: {
      sample: {
        summary: 'A new todo',
        value: {
          owner: 0,
          title: 'A basic todo',
          description: 'The todo description',
          created_at: new Date().toISOString()
        }
      }
    }
  })
  @ApiBearerAuth("AccessToken")
  @UseGuards(JwtAuthGuard)
  @Post("create")
  async create_todo(@Request() req, @Body() dto: TodoCreationDto) {
    if (req.user.id != dto.owner) throw new HttpException("You gave no permissions to do this action", HttpStatus.FORBIDDEN);

    const todo_id = (await this.todo_service.create_todo(dto)).ok();

    if (todo_id.isSome()) return todo_id.unwrap();
    else throw new HttpException("Some error during task creation", HttpStatus.CONFLICT);
  }

  /**
  * Deletes the task from the given user with the gien `id`
  */
  @ApiOperation({ summary: 'Deletes the the task with the given id' })
  @ApiForbiddenResponse({ description: 'The provided token is invalid or expired' })
  @ApiOkResponse({ description: 'The task was sucessfully deleted' })
  @UseGuards(JwtAuthGuard)
  @Delete("delete/:id")
  async delete_todo(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return await this.todo_service.delete_from_user(req.user.id, id);
  }

  @ApiOperation({ summary: 'Updates the todo based on the given modification dto' })
  @ApiOkResponse({ description: 'The todo was updated successfully' })
  @ApiForbiddenResponse({ description: 'The provided token is expired or invalid' })
  @ApiBody({
    'description': 'The new contents of the todo to be set', type: TodoModificationDto, examples: {
      sample: {
        summary: 'Simple update',
        value: {
          owner: 0, //id of the owner
          id: 1,
          title: 'New todo title',
          description: 'New todo description'
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  @Put("update")
  async update_todo(@Request() req, @Body() todo: TodoModificationDto) {
    if (todo.owner != req.user.id) throw new HttpException("You gave no permissions to do this action", HttpStatus.FORBIDDEN);
    return await this.todo_service.update(todo)
  }

  @ApiOperation({ summary: 'Marks the request of the given id as completed' })
  @ApiOkResponse({ description: 'The todo was successfully set as completed' })
  @ApiForbiddenResponse({ description: 'The token is invalid or expired' })
  @UseGuards(JwtAuthGuard)
  @Put("mark-complete/:id")
  async complete_todo(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.todo_service.mark_complete(req.user.id, id);
  }
}
