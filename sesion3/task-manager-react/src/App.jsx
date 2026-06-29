// Importamos el componente Header desde la carpeta components.
import Header from "./components/Header";

// Importamos el componente TaskList desde la carpeta components.
import TaskList from "./components/TaskList";

// App es el componente principal de nuestra aplicación.
function App() {
  return (
    // .app-container centra y da fondo/espaciado a toda la app (ver index.css).
    <div className="app-container">
      {/* Encabezado de la aplicación */}
      <Header />

      {/* Lista de tareas: genera una TaskCard por cada tarea */}
      <TaskList />
    </div>
  );
}

// Exportamos App para que React pueda renderizarlo desde main.jsx.
export default App;
