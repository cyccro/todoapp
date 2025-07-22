import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UserLoginDto {
  @ApiProperty({description: 'The email that will be checked during login'})
  @IsEmail()
  public readonly email: string;
  @IsNotEmpty()
  @ApiProperty({description: 'The password that will be checked during login'})
  public readonly password: string;
  constructor(email:string, password:string) {
    this.email = email;
    this.password = password;
  }
}

export class UserRegisterDto {
  @ApiProperty({description: 'The username to be used during creation'})
  @IsNotEmpty()
  public readonly username: string;
  @ApiProperty({description: 'The email to be used during creation'})
  @IsEmail()
  public readonly email: string;
  @IsNotEmpty()
  @ApiProperty({description: 'The password to be used during creation'})
  public readonly password: string;
  constructor(username:string, email:string, password:string){
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

/**
 * Dto Used when a user tries to log-in or retrieve a new access token
 */
export class UserLoginTokenDto {
  public readonly username: string;
  public readonly sub: number;

  constructor(username:string, sub:number){
    this.username = username;
    this.sub = sub;
  }
}
