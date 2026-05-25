"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Login gagal");

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "#f3f4f8" }}
    >
      <div className="card shadow-sm" style={{ width: "100%", maxWidth: 400 }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>🏨</div>
            <h4
              className="fw-bold mt-2 mb-1"
              style={{ color: "var(--primary-color)" }}
            >
              Liras Admin
            </h4>
            <p className="text-muted small mb-0">Masuk ke panel manajemen</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="admin@gmail.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                required
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                <i className="fas fa-exclamation-circle me-1" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
