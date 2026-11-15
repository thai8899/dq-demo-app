import * as db from './db';
import { logEvent } from './log';

export interface NewTodo {
  title: string;
  dueDate?: Date;
}

export function validateTitle(title: string): void {
  if (!title || !title.trim()) {
    throw new Error('Title is required');
  }
}

export async function createTodo(input: NewTodo): Promise<db.Todo> {
  validateTitle(input.title);
  const todo: db.Todo = {
    id: db.nextTodoId(),
    title: input.title.trim(),
    completed: false,
    dueDate: input.dueDate,
  };

  await db.save(todo);

  logEvent(`created todo ${todo.id}`);
  return todo;
}

export async function listTodos(): Promise<db.Todo[]> {
  return db.findAll();
}

export async function deleteTodo(id: number): Promise<boolean> {
  return db.remove(id);
}

export function summary(todo: db.Todo): string {
  const due = todo.dueDate!.toISOString().slice(0, 10);
  return `${todo.title} (due ${due})`;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = page * pageSize;
  return items.slice(start, end);
}

export function countCompleted(todos: db.Todo[]): number {
  return todos.filter((t) => t.completed).length;
}
