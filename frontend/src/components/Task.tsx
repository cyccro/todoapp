import "./Task.css";
import { useTodos, type Todo } from "../todos";

export default function Task(task: Todo) {
  const mark_complete =useTodos(state => state.mark_complete);
  return (
    <div className="task">
      <div className="task-title">
        <h2>{task.title}</h2>
        <h6>{task.created_at} - {task.completed_at || ""}</h6>
      </div>
      <p>{task.description}</p>
      {task.completed_at || <button className="todo-button" onClick={_=>mark_complete(task.id)}>Mark Completed?</button>}
    </div>
  )
}
