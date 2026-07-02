// TaskCard ahora recibe "props": datos que le envía quien lo usa.
function TaskCard(props) {
  return (
    // <li> porque cada tarjeta es un elemento de la lista <ul> de TaskList (estilo en index.css).
    <li>
      {/* props.text es el texto que llega desde App.jsx */}
      <p>{props.text}</p>
    </li>
  );
}

// Exportamos el componente para poder importarlo y usarlo en otros archivos.
export default TaskCard;
