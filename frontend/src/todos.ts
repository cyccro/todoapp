import { create } from "zustand";
import { AppHttp } from "./helpers/http";

export enum TodoPriority {
  Low, Medium, High
}

export interface TodoState {
  todos: Todo[],
  add_todo(todo: Todo): void;
  /** Gets all the todos that were retrieved by the backend */
  get_todos(): Todo[];
  get_active_todos(): Todo[];
  get_completed_todos(): Todo[];
  /** Requests all the todos on the backend */
  request_todos():Promise<Todo[]>;
  mark_complete(id:number): Promise<void>;
}

export interface Todo {
  id: number,
  owner_id: number,
  description: string,
  title: string;
  created_at: string;
  completed_at?: string;
}

export const useTodos = create<TodoState>((set, get) => ({
  todos: [] as Todo[],
  add_todo(todo: Todo) {
    return set(() => ({ todos: [...get().todos, todo]}));
  },
  get_todos() {
    return get().todos;
  },
  get_active_todos() {
    return get().todos.filter(t => !t.completed_at);
  },
  get_completed_todos() {
    return get().todos.filter(t => t.completed_at);
  },
  async request_todos() {
    const todos = await AppHttp.get<Todo[]>("/todo/all");
    if(todos.isOk()) {
      return todos.unwrap();
    }else{
      return [];
    }
  },
  async mark_complete(id) {
    const out = await AppHttp.put<Todo[]>(`/todo/mark-complete/${id}`);
    return out;
  },
}));
