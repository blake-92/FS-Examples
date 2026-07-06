import type { Task } from "../types";
import TaskCard from "./TaskCard";

type TaskListProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, text: string, dueDate?: string, description?: string) => void;
};

function TaskList(props: TaskListProps) {
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
