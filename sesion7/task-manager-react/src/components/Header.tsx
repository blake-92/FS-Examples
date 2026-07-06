type HeaderProps = {
  onLogout?: () => void;
};

function Header(props: HeaderProps) {
  return (
    <header>
      <h1>Prisma</h1>
      {props.onLogout && (
        <button className="logout-btn" onClick={props.onLogout} type="button">
          Salir
        </button>
      )}
    </header>
  );
}

export default Header;
