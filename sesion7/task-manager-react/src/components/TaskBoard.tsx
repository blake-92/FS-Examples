import type { DragEvent } from "react";
import type { Task, TaskStatus } from "../types";
import TaskList from "./TaskList";

type TaskBoardProps = {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, text: string, dueDate?: string, description?: string) => void;
  onMoveTask: (id: number, status: TaskStatus) => void;
};

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "idea", title: "Ideas" },
  { status: "pendiente", title: "Por hacer" },
  { status: "en-progreso", title: "En progreso" },
  { status: "hecho", title: "Hecho" },
];

function TaskBoard(props: TaskBoardProps) {
  const handleDrop = (event: DragEvent<HTMLElement>, status: TaskStatus) => {
    event.preventDefault();
    const id = Number(event.dataTransfer.getData("text/plain"));
    props.onMoveTask(id, status);
  };

  return (
    <div className="board">
      {COLUMNS.map((column) => {
        const columnTasks = props.tasks.filter((task) => task.status === column.status);

        return (
          <section
            key={column.status}
            className={`column status-${column.status}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, column.status)}
          >
            <h2 className="column-title">
              {column.title}
              <span className="column-count">{columnTasks.length}</span>
            </h2>

            <TaskList
              tasks={columnTasks}
              onDeleteTask={props.onDeleteTask}
              onEditTask={props.onEditTask}
            />
          </section>
        );
      })}
    </div>
  );
}

export default TaskBoard;
