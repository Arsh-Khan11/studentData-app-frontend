import { useState } from "react";
import type { LoginInput } from "../types/student";
import { loginStudent } from "../services/studentService";


interface LoginFormProps {
       onLoginSuccess: () => void;
}

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [login, setLogin] = useState<LoginInput>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

   try {
    await loginStudent(login);
    onLoginSuccess();
  } catch (requestError) {
    setError(
      requestError instanceof Error ? requestError.message : "Login failed",
    );
  }
};
  return (
    <main className="login-page">
      <header className="page-header">
        <p className="eyebrow">STUDENT MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="page-subtitle">Sign in to your student records.</p>
      </header>
      <section className="paper-card login-card">
        <form className="student-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={login.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="Your password"
              value={login.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <button className="button button-green" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginForm;
