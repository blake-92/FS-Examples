// Tipos compartidos del proyecto. Definir el tipo UNA sola vez y reutilizarlo
// (import type) evita duplicarlo en cada componente.

// Los 4 estados posibles de una tarea = las 4 columnas del tablero Kanban.
export type TaskStatus = "idea" | "pendiente" | "en-progreso" | "hecho";

export type Task = {
  id: number;
  text: string;
  status: TaskStatus;
  dueDate?: string; // fecha límite opcional, formato "YYYY-MM-DD"
  description?: string; // descripción opcional
};
