import { BadgePlus, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { authApi } from "../api/client.js";

function RegisterForm({ currentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
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
    setMessage("");
    setLoading(true);

    try {
      await authApi.register(formData);
      setMessage("Account created. You can sign in now.");
      setFormData({ username: "", password: "" });
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-layout compact">
      <div className="auth-panel">
        <div className="section-kicker">User registration</div>
        <h1>Create account</h1>

        <form className="form-grid" onSubmit={submitForm}>
          <label>
            Username
            <span className="input-shell">
              <UserRound size={18} />
              <input
                name="username"
                value={formData.username}
                onChange={updateField}
                placeholder="your name"
                autoComplete="username"
                minLength={3}
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
                placeholder="minimum 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </span>
          </label>

          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}

          <button className="primary-button" type="submit" disabled={loading}>
            <BadgePlus size={18} />
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="switch-copy">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterForm;