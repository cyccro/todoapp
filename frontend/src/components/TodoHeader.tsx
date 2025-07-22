import "./TodoHeader.css";

import React, { useEffect } from 'react';
import './TodoHeader.css';
import { useUser } from "../user";
import TodoLogin from "./TodoLogin";

interface TodoHeaderProps {
  activeTodosCount: number;
  completedTodosCount: number;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({ activeTodosCount, completedTodosCount }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const user = useUser(user=>user.user);
  const user_err = useUser(user=>user.err);
  const get_user =useUser(user=>user.get_user);

  useEffect(()=>{
    get_user().then(()=>console.log(user, user_err));
  }, [get_user]);
  
  return (
    <header className="todo-header">
      <div className="header-gradient"></div>
      <div className="header-content">
        <h1 className="header-title">
          <span className="greeting">{getGreeting()}</span>
          <span className="app-name">Todo Manager</span>
        </h1>
        <div className="header-info">
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{activeTodosCount}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{completedTodosCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="user-info">
            {user.isSome() ? <p>{user.unwrap().username}</p> : <TodoLogin button_text="Register" style="login-btn"/>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TodoHeader;
