import type { Task } from "../types";
import TaskCard from "./TaskCard";

// TaskList = las tarjetas de UNA columna. Recibe ya filtradas las tareas de su estado.
type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, text: string, dueDate?: string, description?: string) => void;
};

function TaskList(props: TaskListProps) {
  // Si la columna está vacía, mostramos una pista (también sirve de zona para soltar).
  if (props.tasks.length === 0) {
    return <p className="column-empty">Sin tareas</p>;
  }

  return (
    <ul>
      {props.tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDeleteTask={props.onDeleteTask}
          onEditTask={props.onEditTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;
