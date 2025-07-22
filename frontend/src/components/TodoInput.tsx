import { useState } from "react"
import "./TodoInput.css"
import { Backdrop, Box, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from "@mui/material";
import { TodoPriority } from "../todos";
import { useUser, type User } from "../user";
import { AppHttp } from "../helpers/http";

async function create_post(user: User, title: string, description: string) {
  const now = new Date().toISOString();
  return await AppHttp.post("/todo/create", {
    owner: user.id,
    title,description,
    created_at: now
  })
}

export default function TodoInput() {
  const [priority, setPriority] = useState(TodoPriority.Low);
  const [err, setErr] = useState(false);
  const [preclose, setPreClose] = useState(false);
  const [opened, setOpened] = useState(false);
  const user = useUser(state => state.user);
  return (
    <div className="inputs">
      <button className="todo-button" onClick={_ => {
        setPreClose(true);
        setOpened(true)
      }}>Would you like to create some thing?</button>
      <Modal
        open={opened}
        onClose={_ => {
          setPreClose(false);
          setTimeout(() => setOpened(false), 920);
        }}
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
          <Box className={`input-modal ${!preclose ? "close-modal" : ""}`}>
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Start here your new todo
            </Typography>
            <input placeholder="Todo Title" type="text" id="todo-title" />
            <textarea id="todo-desc" placeholder="Todo Description"></textarea>

            <FormControl className="priority-dropbox"
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'white',
                }, '& .MuiSelect-icon': {

                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  color: 'white', // dropdown arrow
                },
              }}>
              <InputLabel className="priority-label" id="priority-label">What's the priority</InputLabel>
              <Select
                labelId="priority-label"
                value={priority}
                label="Choose an option"
                onChange={e => setPriority(e.target.value)}
              >
                <MenuItem className="low-priority" value={TodoPriority.Low}>Low</MenuItem>
                <MenuItem className="medium-priority" value={TodoPriority.Medium}>Medium</MenuItem>
                <MenuItem className="high-priority" value={TodoPriority.High}>High</MenuItem>
              </Select>
            </FormControl>
            {err && <p>{user.isSome() ? 'Todo is incomplete!' : 'Login before creating a task'}</p>}
            <button className="confirm-button" onClick={async _ => {

              const title = document.getElementById('todo-title')!.value;
              const description = document.getElementById('todo-desc')!.value;
              const flag = !(user.isSome() && title != '');

              setErr(flag);
              setPreClose(flag);

              if (!flag) {
                try {
                  await create_post(user.unwrap(), title, description);
                  setTimeout(() => setOpened(flag), 920);
                }catch(e){
                  setErr(true)
                }
              }
            }}>Confirm</button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
