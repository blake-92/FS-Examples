// TaskList importa TaskCard (ambos viven en components/).
import TaskCard from "./TaskCard";

function TaskList() {
  // Lista de tareas (datos). Por ahora es fija.
  const tasks = [
    "Estudiar React",
    "Practicar componentes",
    "Entender props"
  ];

  return (
    <ul>
      {/* Recorremos el arreglo y creamos una TaskCard por cada tarea */}
      {tasks.map((task, index) => (
        <TaskCard key={index} text={task} />
      ))}
    </ul>
  );
}

export default TaskList;
