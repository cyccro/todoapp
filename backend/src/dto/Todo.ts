import { ApiProperty } from "@nestjs/swagger";
import {IsISO8601, IsNotEmpty, IsNumber} from "class-validator";

export class TodoCreationDto {
  @ApiProperty({description: 'The owner id of the requested todo'})
  @IsNumber()
  public readonly owner: number;
  
  @ApiProperty({description: 'The title of the todo'})
  @IsNotEmpty()
  public readonly title:string;
  
  @ApiProperty({description: 'The description of the todo'})
  @IsNotEmpty()
  public readonly description: string;
  
  @ApiProperty({description: 'The date the todo was created'})
  @IsISO8601()
  public readonly created_at:string;
}

export class TodoModificationDto {
  @IsNotEmpty()
  @ApiProperty({description: 'The owner id'})
  public readonly owner:number;
  @IsNotEmpty()
  @ApiProperty({description: 'The task id'})
  public readonly id:number;

  @ApiProperty({description: 'The new title of the todo'})
  @IsNotEmpty()
  public readonly title:string;

  @ApiProperty({description: 'The new description of the todo'})
  @IsNotEmpty()
  public readonly description: string;
}
