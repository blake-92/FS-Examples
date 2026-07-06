// Footer = sumario de tareas. Solo recibe números y los muestra (componente "tonto").
type FooterProps = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
};

function Footer(props: FooterProps) {
  return (
    <footer className="summary">
      <span>Total: <strong>{props.total}</strong></span>
      <span>Completadas: <strong>{props.completed}</strong></span>
      <span>Pendientes: <strong>{props.pending}</strong></span>
      <span className="summary-overdue">Vencidas: <strong>{props.overdue}</strong></span>
    </footer>
  );
}

export default Footer;
