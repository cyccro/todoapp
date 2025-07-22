import "./TodoList.css";

import Task from "./Task";
import { useTodos, type Todo } from "../todos";
import { useEffect, useState } from "react";

export interface TodoListProps {
  todos: Todo[]
}

export default function TodoList(props: TodoListProps) {
  
   return (
    <div className="todo-list">
      {props.todos.map(t => {
        console.log(t);
        return <Task key={t.id} {...t} />;
        }
      )}
    </div>
  )
}
