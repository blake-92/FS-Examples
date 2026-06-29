// TaskCard ahora recibe "props": datos que le envía quien lo usa.
function TaskCard(props) {
  return (
    // <li> para que cada tarea sea un elemento de la lista <ul> (estilo en App.css).
    <li>
      {/* props.text es el texto que llega desde App.jsx */}
      <p>{props.text}</p>
    </li>
  );
}

// Exportamos el componente para poder importarlo y usarlo en otros archivos.
export default TaskCard;
