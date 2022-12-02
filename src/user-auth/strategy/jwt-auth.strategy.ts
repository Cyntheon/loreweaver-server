import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {JwtPayload} from "../@types";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, "jwt-auth") {
  public constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  public validate(payload: JwtPayload) {
    return {id: payload.sub, username: payload.username};
  }
}
