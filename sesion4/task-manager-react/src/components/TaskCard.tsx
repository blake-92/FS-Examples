import { useState, useRef, useEffect } from "react";
import type { DragEvent } from "react";
import type { Task } from "../types";

// Hace que un textarea crezca con su contenido (sin scroll interno).
function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

// TaskCard recibe una tarea y las funciones para editarla o eliminarla.
type TaskCardProps = {
  task: Task;
  onDeleteTask: (id: number) => void;
  onEditTask: (id: number, text: string, dueDate?: string, description?: string) => void;
};

// Meses en español para mostrar la fecha de forma legible.
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

// Convierte "2026-06-20" → "20 jun 2026". Parsea por partes (sin new Date) para no
// depender de la zona horaria.
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MESES[Number(month) - 1]} ${year}`;
}

function TaskCard(props: TaskCardProps) {
  const task = props.task;

  // Estado local para la edición inline (texto, fecha y descripción).
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editDate, setEditDate] = useState(task.dueDate ?? "");
  const [editDesc, setEditDesc] = useState(task.description ?? "");
  const editDateRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  // Al abrir la edición, ajusta el alto del textarea a la descripción existente.
  useEffect(() => {
    if (isEditing && descRef.current) {
      autoGrow(descRef.current);
    }
  }, [isEditing]);

  // "vencida": tiene fecha, está en el pasado y la tarea no está hecha.
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const isOverdue =
    task.status !== "hecho" && task.dueDate !== undefined && task.dueDate < today;

  // Al empezar a arrastrar, guardamos el id de la tarea para el "soltar" en TaskBoard.
  const handleDragStart = (event: DragEvent<HTMLLIElement>) => {
    event.dataTransfer.setData("text/plain", String(task.id));
  };

  // Abrir edición: sincroniza los campos con la tarea actual.
  const startEditing = () => {
    setEditText(task.text);
    setEditDate(task.dueDate ?? "");
    setEditDesc(task.description ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editText.trim() === "") {
      return;
    }
    // Guarda texto, fecha y descripción (vacías → undefined: las quita).
    props.onEditTask(task.id, editText, editDate || undefined, editDesc.trim() || undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <li
      className={`task-card status-${task.status}`}
      draggable={!isEditing} // no se arrastra mientras se edita
      onDragStart={handleDragStart}
    >
      {isEditing ? (
        <div className="task-edit">
          <input
            className="task-edit-text"
            type="text"
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            aria-label="Editar texto"
            autoFocus
          />

          <textarea
            ref={descRef}
            className="task-edit-desc"
            placeholder="Descripción (opcional)"
            value={editDesc}
            onChange={(event) => {
              setEditDesc(event.target.value);
              autoGrow(event.target);
            }}
            aria-label="Editar descripción"
          />

          <div className="task-edit-bar">
            {/* Fecha editable: vacía = solo icono; clic abre el selector */}
            <div
              className={`task-edit-date${editDate ? " has-value" : ""}`}
              onClick={() => editDateRef.current?.showPicker?.()}
              title="Fecha límite"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              {/* Texto propio (día-mes-año); el input nativo va invisible (solo abre el selector) */}
              {editDate && <span className="task-edit-date-text">{formatDate(editDate)}</span>}
              <input
                ref={editDateRef}
                type="date"
                value={editDate}
                onChange={(event) => setEditDate(event.target.value)}
                aria-label="Editar fecha límite"
              />
            </div>

            <div className="task-edit-actions">
              <button className="task-edit-save" onClick={handleSave} aria-label="Guardar" title="Guardar">
                {/* Check (guardar) */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </button>
              <button className="task-edit-cancel" onClick={handleCancel} aria-label="Cancelar" title="Cancelar">
                {/* X (cancelar) */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Fila principal: punto de estado + texto (a todo el ancho) */}
          <div className="task-main">
            {/* Punto de color según el estado (lo pinta el CSS según la clase status-*) */}
            <span className="task-dot" />

            <div className="task-body">
              <span className="task-text">{task.text}</span>
              {task.description && <p className="task-desc">{task.description}</p>}
            </div>
          </div>

          {/* Pie: fecha (si hay) a la izquierda + acciones a la derecha */}
          <div className="task-footer">
            {task.dueDate && (
              <span className={isOverdue ? "task-date overdue" : "task-date"}>
                {/* Icono calendario (SVG inline, monocromo) */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                {formatDate(task.dueDate)}
              </span>
            )}

            <div className="task-actions">
              <button onClick={startEditing} aria-label="Editar tarea" title="Editar">
                {/* Lápiz (SVG inline, estilo line) */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button
                onClick={() => props.onDeleteTask(task.id)}
                aria-label="Eliminar tarea"
                title="Eliminar"
              >
                {/* Papelera (SVG inline, estilo line) */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskCard;
