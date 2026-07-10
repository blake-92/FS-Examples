import { useState } from "react";

type RegisterProps = {
  apiUrl: string;
  onSwitchToLogin: () => void;
};

function Register(props: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${props.apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, password: password }),
      });
      const data = await response.json();
      if (response.ok) {
        setDone(true);
      } else {
        setError(data.message || "No se pudo registrar");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <h1 className="login-title">¡Cuenta creada!</h1>
          <p className="login-subtitle">Ya puedes iniciar sesión con tu correo y contraseña.</p>
          <button className="login-btn" type="button" onClick={props.onSwitchToLogin}>
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Crear cuenta</h1>
        <p className="login-subtitle">Regístrate para gestionar tus tareas</p>

        <label className="login-field">
          <span>Nombre</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            autoComplete="name"
          />
        </label>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tucorreo@test.com"
            autoComplete="username"
          />
        </label>

        <label className="login-field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••"
            autoComplete="new-password"
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Creando…" : "Registrarme"}
        </button>

        <p className="login-switch">
          ¿Ya tienes cuenta?{" "}
          <button type="button" className="login-link" onClick={props.onSwitchToLogin}>
            Inicia sesión
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
