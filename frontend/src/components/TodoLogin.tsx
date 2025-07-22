import "./TodoLogin.css";

import { useState } from "react";
import { Backdrop, Box, FormControl, InputLabel, Modal, Typography } from "@mui/material";
import { AppHttp } from "../helpers/http";
import { useUser } from "../user";

export interface TodoLoginProps {
  button_text: string;
  style: string
}

async function confirmation(register: boolean, email: string, password: string, username?: string) {
  if (register) {
    return await AppHttp.post("auth/register", { username: username!, email, password });
  } else {
    return await AppHttp.post("auth/login", { email, password });
  }
}

export default function TodoLogin(props: TodoLoginProps) {
  const [opened, setOpened] = useState(false);
  const [err, setErr] = useState<null | Error>(null);
  const [register, setRegister] = useState(true);
  const get_user =useUser(state => state.get_user);
  return <div>
    <button className={props.style} onClick={() => setOpened(true)}>{props.button_text}</button>
    <Modal
      open={opened}
      onClose={() => setOpened(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(2px)'
          }
        }
      }}
    >
      <Box className="modal-container">
        <Box className="login-modal">
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {register ? 'Register' : 'Log in'}
          </Typography>
          <div className="login-form">
            <div className="login-form">
              {register && <input className="login-input" placeholder="Your username" type="text" id="username" />}
              <input className="login-input" placeholder="Your email" type="text" id="email" />
              <input className="login-input" placeholder="What is your password" type="text" id="password" />
            </div>
            <div className="login-form">
              <span>
                {register ? 'Already have an account?' : "Don't have an account?"}
                <button className="switch-btn" onClick={() => setRegister(!register)}>{register ? 'Log in!' : 'Create one!'}
                </button>
              </span>
              {err && <span>{err.message}</span>}
              <button className="confirm-button" onClick={async _ => {
                const result = await confirmation(
                  register,
                  (document.getElementById('email')! as HTMLInputElement).value,
                  (document.getElementById('password')! as HTMLInputElement).value,
                  (document.getElementById('username')! as HTMLInputElement)?.value
                );
                if(result.isErr()) setErr(result.unwrapErr());
                else {
                  get_user();
                  setOpened(false);
                }
                }}>Confirm</button>
            </div>
          </div>
        </Box>
      </Box>
    </Modal>
  </div>
}
