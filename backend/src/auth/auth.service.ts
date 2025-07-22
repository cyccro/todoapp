import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { Err, match, None, Ok, Option, Result, Some } from 'oxide.ts';
import { AccessTokenDto } from 'src/dto/Auth';
import { UserLoginDto, UserLoginTokenDto, UserRegisterDto } from 'src/dto/User';
import { UserValidation } from 'src/dto/Validation';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService
  ) {

  }

  /**
  * Attempts to register the user with the given credentials. If something goes wrong, such as someone with same email, it returns `Some` indicating some error happened.
  * @obs As that(errors due same email) is the only possibility, I aint adding an enum for the possible errors, but that would be a better solution.
  */
  async register(dto: UserRegisterDto): Promise<Option<void>> {
    if ((await this.users.find_by_email(dto.email)).isSome()) return Some(void 0);
    const obj = new UserRegisterDto(dto.username, dto.email, await hash(dto.password));
    await this.users.register_user(obj);

    return None
  }

  /**
  * Checks if the user with the given credentials is a valid one or not. If so returns an object that can be used as a token.
  */
  async validate(dto: UserLoginDto): Promise<Result<UserLoginTokenDto, UserValidation>> {
    const user = await this.users.find_by_email(dto.email);
    if (user.isNone()) return Err(UserValidation.NonExistent);
    else {
      return await verify(user.unwrap().password, dto.password) ? Ok(new UserLoginTokenDto(user.unwrap().username, user.unwrap().id)) : Err(UserValidation.WrongCredentials);
    }
  }

  /**
  * Validates the user with the given credentials and returns a `AccessTokenDto` if it's valid, else return the UserValidation error.
  */
  async login(dto: UserLoginDto): Promise<Result<AccessTokenDto, UserValidation>> {
    return (await this.validate(dto)).map(tk => new AccessTokenDto(this.jwt.sign(Object.assign({}, tk), {
      privateKey: process.env.JWT_SECRET
    })));
  }
}
