import {create} from "zustand";
import { AppHttp } from "./helpers/http";
import { match, None, Option, Some } from "oxide.ts";

export interface UserState {
  user: Option<User>,
  err: Option<Error>,
  /** Tries to retrieve the user information */
  get_user(): Promise<void>;
  /** Tries to register and retrieve the information about the user */
  register(username:string, email:string, password:string): Promise<void>;
  /** Tries to log in and retrieve the information about the user */
  login(email:string, password:string): Promise<void>
}

export interface User {
  username: string;
  id: number;
}

export const useUser = create<UserState>((set, get)=>({
  user: None,
  err: None,

  async login(email:string, password:string){
    await AppHttp.post("auth/login", {email,password});
    await this.get_user();
  },
  
  async register(username:string, email:string, password:string) {
    await AppHttp.post("auth/register", {username, email, password});
    await this.get_user();
  },
  async get_user(){
    const user = await AppHttp.get<User>("auth/user-info");
    console.log(user);
    return match(user, {
      Ok(user){
        return set(()=>({
          user: Some(user),
          err: None,
        }));
      },
      Err(e){
        return set(()=>({
          user: None,
          err:Some(new Error("No user logged"))
        }));
      }
    });
  }
}));
