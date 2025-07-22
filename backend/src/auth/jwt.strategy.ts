import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AccessTokenPayloadDto } from "src/dto/Auth";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private users: UsersService){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req:Request)=>req.cookies['access_token']
      ]),
      secretOrKey: process.env.JWT_SECRET,
      secretOrKeyProvider: null as any
    });
  }
  async validate(payload: AccessTokenPayloadDto): Promise<any> {
    const user = await this.users.find_by_id(payload.sub);
    if(user.isNone()) throw new UnauthorizedException();
    else return user.unwrap();
  }
}
