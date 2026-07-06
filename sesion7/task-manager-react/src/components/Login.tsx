import { useState } from "react";

type LoginProps = {
  apiUrl: string;
  onLogin: (token: string) => void;
};

function Login(props: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${props.apiUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (response.ok) {
        props.onLogin(data.token);
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">Prisma</h1>
        <p className="login-subtitle">Inicia sesión para ver tus tareas</p>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@test.com"
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
            autoComplete="current-password"
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>

        <p className="login-hint">
          Credenciales de práctica: <strong>admin@test.com</strong> / <strong>123456</strong>
        </p>
      </form>
    </div>
  );
}

export default Login;
