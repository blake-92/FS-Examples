// useState para el formulario; useRef para abrir el selector de fecha al hacer clic.
import { useState, useRef } from "react";

// Hace que un textarea crezca con su contenido (sin scroll interno).
function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

// TaskInput avisa al padre (App) con el texto, la fecha y la descripción (opcionales).
type TaskInputProps = {
  onAddTask: (text: string, dueDate?: string, description?: string) => void;
};

function TaskInput(props: TaskInputProps) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [descOpen, setDescOpen] = useState(false); // desplegable de descripción
  const dateRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    // No agregamos tareas vacías (ni solo espacios).
    if (text.trim() === "") {
      return;
    }
    // Si no eligieron fecha/descripción, mandamos undefined (no "").
    props.onAddTask(text, dueDate || undefined, description.trim() || undefined);
    setText("");
    setDueDate("");
    setDescription("");
    setDescOpen(false); // volver a colapsar
  };

  return (
    <div className="task-add">
      <div className="task-input">
        {/* Campo de texto con icono guía a la izquierda */}
        <div className="field field-text">
          <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          <input
            type="text"
            placeholder="Escribe una nueva tarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-label="Nueva tarea"
          />
        </div>

        {/* Toggle de descripción (icono): muestra/oculta el textarea de abajo */}
        <button
          type="button"
          className={`task-desc-btn${descOpen ? " open" : ""}`}
          onClick={() => setDescOpen((open) => !open)}
          aria-expanded={descOpen}
          aria-label="Descripción"
          title="Descripción"
        >
          {/* Icono de líneas de texto (descripción) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </button>

        {/* Campo de fecha: vacío = solo icono; al elegir fecha, la muestra. Clic abre el selector. */}
        <div
          className={`field field-date${dueDate ? " has-value" : ""}`}
          onClick={() => dateRef.current?.showPicker?.()}
          title="Fecha límite (opcional)"
        >
          <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <input
            ref={dateRef}
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            aria-label="Fecha límite (opcional)"
          />
        </div>

        <button className="task-add-btn" onClick={handleSubmit} aria-label="Agregar tarea" title="Agregar">
          {/* Icono + (SVG inline, estilo line) */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Descripción opcional: se despliega con el icono de la barra (colapsada por defecto) */}
      <div className={`task-desc-wrap${descOpen ? " open" : ""}`}>
        <textarea
          className="task-input-desc"
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            autoGrow(event.target);
          }}
          aria-label="Descripción (opcional)"
        />
      </div>
    </div>
  );
}

export default TaskInput;
