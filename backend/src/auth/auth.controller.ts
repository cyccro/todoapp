import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from 'src/dto/User';
import { AuthService } from './auth.service';
import { match } from 'oxide.ts';
import { ApiBody, ApiConflictResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessTokenDto } from 'src/dto/Auth';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt_auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth_service: AuthService) { }

  @ApiOperation({ summary: 'Tries to create a new user with the provided dto and generate an access token'})
  @ApiOkResponse({ description: 'Did create the user and returned the access token', type: AccessTokenDto })
  @ApiConflictResponse({ description: 'An user with the provided email already exists' })
  @ApiUnauthorizedResponse({ description: 'The provided credentials are invalid(which does not make much sense of happening here)' })
  @ApiBody({
    examples: {
      sample: {
        summary: 'Simple register',
        value: {
          username: 'caina',
          email: 'cainapinheiro@hotmail.com',
          password: '564718293'
        }
      }
    },
    type: UserRegisterDto,
  })
  @Post('register')
  async register(@Body() dto: UserRegisterDto, @Res({passthrough: false}) res:Response) {
    if ((await this.auth_service.register(dto)).isSome()) throw new HttpException('The given email is already registered', HttpStatus.CONFLICT); //Some error
    else try {
      return await this.login(new UserLoginDto(dto.email, dto.password), res);
    } catch (e) {
      throw e;
    }
  }
  
  @ApiOperation({ summary: 'Tries to retrieve an access token for the user'})
  @ApiOkResponse({ description: 'Did return the access token successfully', type: AccessTokenDto, example: {token: "the token here"} })
  @ApiUnauthorizedResponse({ description: 'Email does not exist, or, if it exists, password might be wrong' })
  @ApiBody({
    examples: {
      sample: {
        summary: 'Simple register',
        value: {
          email: 'cainapinheiro@hotmail.com',
          password: '564718293'
        }
      }
    },
    type: UserLoginDto,
  })
  @Post('login')
  async login(@Body() dto: UserLoginDto, @Res({passthrough: true}) res: Response) {
    return match(await this.auth_service.login(dto), {
      Ok(val) {
        res.cookie('access_token', val.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV=='production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60, //1 hour
        })
        return val;
      },
      Err(_) {
        throw new HttpException('Invalid credentials. Email is not register or password might be wrong', HttpStatus.UNAUTHORIZED);
      }
    })
  }
  @ApiOperation({summary: 'Retrieves the user information based on the provided token'})
  @ApiOkResponse({description: 'The data was successfully retrieved'})
  @ApiForbiddenResponse({description: 'The token expired or was invalid'})
  @ApiNotFoundResponse({description: 'The user was not found'})
  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  async get_info(@Request() req) {
    return {
      username: req.user.username,
      id: req.user.id
    };
  }
}
