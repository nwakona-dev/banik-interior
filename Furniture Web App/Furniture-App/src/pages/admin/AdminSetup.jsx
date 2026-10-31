
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { setupAdmin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function AdminSetup() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return <div className="admin-loading">Checking session...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await setupAdmin(form);

      setSuccess(
        response?.message ||
          "Admin account created. You can now sign in."
      );

      setTimeout(
        () => navigate("/admin/login", { replace: true }),
        1200
      );
    } catch (err) {
      setError(
        err.message || "Unable to create the admin account."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">

        {/* Banik Interior Brand - Non-clickable */}
        <div className="admin-auth-brand">
          <img
            src="/logo.png"
            alt="Banik Interior Logo"
            className="admin-auth-logo"
          />

          <span className="admin-auth-brand-name">
            BANIK <span>INTERIOR</span>
          </span>
        </div>

        <h1>Set Up Administrator</h1>

        <p className="admin-auth-subtitle">
          Create the initial administrator account for Banik Interior.
        </p>

        {/* Setup Information */}
        <div className="admin-alert admin-alert-info">
          Your backend must not already have an administrator account.
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="admin-alert admin-alert-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            className="admin-alert admin-alert-success"
            role="status"
          >
            {success}
          </div>
        )}

        {/* Admin Setup Form */}
        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="username">Username</label>

          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />

          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            minLength={12}
            required
          />

          <p className="admin-field-hint">
            Use at least 12 characters if that is the rule configured by your backend.
          </p>

          <button
            type="submit"
            className="admin-primary-button admin-auth-submit"
            disabled={submitting}
          >
            {submitting
              ? "Creating account..."
              : "Create Admin Account"}
          </button>
        </form>

        {/* Login Link */}
        <p className="admin-auth-footer">
          Already have an account?{" "}
          <Link to="/admin/login">
            Sign in
          </Link>
        </p>

      </section>
    </main>
  );
}
