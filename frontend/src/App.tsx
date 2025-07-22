import { useEffect, useState, } from 'react';
import './App.css'
import TodoHeader from './components/TodoHeader';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { useTodos, type Todo } from "./todos";
import { useUser } from './user';

function App() {

  const get_user = useUser(s=>s.get_user);
  const request_todos = useTodos(state => state.request_todos);
  const [todos, setTodos] = useState<Todo[]>([])
  useEffect(()=>{
    async function fetch_user(){
      await get_user();
      await request_todos().then(setTodos);
    }
    fetch_user();
  }, [request_todos, get_user])
  
  const active_todos = useTodos(t => t.get_active_todos);
  const completed_todos = useTodos(t => t.get_completed_todos);
  return (
    <>
      <TodoHeader activeTodosCount={active_todos().length} completedTodosCount={completed_todos().length} />
      <TodoInput />
      <TodoList todos={todos}/>
    </>
  );
}
export default App;
