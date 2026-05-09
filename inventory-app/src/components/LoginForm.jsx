import { LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authApi } from "../api/client.js";
function LoginForm({ currentUser, onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  if (currentUser) {
    return <Navigate to="/products" replace />;
  }
  function updateField(event) {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  }
  async function submitForm(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await authApi.login(formData);
      onLogin(session);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="auth-layout">
      <div className="auth-panel">
        <div className="section-kicker">Secure access</div>
        <h1>Sign in to inventory</h1>
        <p className="muted"></p>
        <form className="form-grid" onSubmit={submitForm}>
          <label>
            Username
            <span className="input-shell">
              <UserRound size={18} />
              <input
                name="username"
                value={formData.username}
                onChange={updateField}
                placeholder=""
                autoComplete="username"
                required
              />
            </span>
          </label>
          <label>
            Password
            <span className="input-shell">
              <LockKeyhole size={18} />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={updateField}
                placeholder=""
                autoComplete="current-password"
                required
              />
            </span>
          </label>
          {error && <div className="alert error">{error}</div>}
          <button className="primary-button" type="submit" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="switch-copy">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </div>       
    </section>
  );
}
export default LoginForm;