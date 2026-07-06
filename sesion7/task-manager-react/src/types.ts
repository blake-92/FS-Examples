
export type TaskStatus = "idea" | "pendiente" | "en-progreso" | "hecho";

export type Task = {
  id: number;
  text: string;
  status: TaskStatus;
  dueDate?: string;
  description?: string;
};
