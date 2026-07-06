import { useState } from "react";
import type { Task, TaskStatus } from "./types";

import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskBoard from "./components/TaskBoard";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";

function App() {
  // App es la "dueña" del estado: todas las tareas viven aquí.
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Estudiar React", status: "pendiente" },
    { id: 2, text: "Practicar TypeScript", status: "en-progreso", dueDate: "2026-06-20" },
    { id: 3, text: "Entender estado", status: "hecho" },
  ]);

  // Agregar: crea una tarea nueva (entra como "idea", la 1ª columna).
  const addTask = (text: string, dueDate?: string, description?: string) => {
    const newTask: Task = {
      id: Date.now(),
      text: text,
      status: "idea",
      dueDate: dueDate,
      description: description,
    };
    setTasks([...tasks, newTask]);
  };

  // Eliminar: deja todas las tareas menos la del id dado.
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Editar: reemplaza el texto, la fecha y la descripción de la tarea con ese id.
  const editTask = (id: number, text: string, dueDate?: string, description?: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: text, dueDate: dueDate, description: description }
          : task
      )
    );
  };

  // Mover: cambia el estado de una tarea (lo usa el drag & drop del tablero).
  const moveTask = (id: number, status: TaskStatus) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status: status } : task))
    );
  };

  // Sumario (valores derivados del estado, se recalculan en cada render).
  const today = new Date().toISOString().slice(0, 10);
  const completed = tasks.filter((task) => task.status === "hecho").length;
  const pending = tasks.filter((task) => task.status !== "hecho").length;
  const overdue = tasks.filter(
    (task) => task.status !== "hecho" && task.dueDate !== undefined && task.dueDate < today
  ).length;

  return (
    <div className="app-container">
      <Header />
      <TaskInput onAddTask={addTask} />

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <TaskBoard
            tasks={tasks}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
            onMoveTask={moveTask}
          />
          <Footer
            total={tasks.length}
            completed={completed}
            pending={pending}
            overdue={overdue}
          />
        </>
      )}
    </div>
  );
}

export default App;
