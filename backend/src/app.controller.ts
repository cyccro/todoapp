import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({summary: 'Returns hello world'})
  @ApiOkResponse({description: "Returns 'Hello World' successfully"})
  @Get("/hello")
  getHello(): string {
    return this.appService.getHello();
  }
}
