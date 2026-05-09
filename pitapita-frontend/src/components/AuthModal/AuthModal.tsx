"use client";

import { useState } from "react";
import styles from "./AuthModal.module.css";
import { authService } from "@/services/auth";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await authService.login(email, password);
        if (res.error) throw new Error(res.error);
      } else {
        const res = await authService.register(username, email, password);
        if (res.error) throw new Error(res.error);
        // Auto login after register
        await authService.login(email, password);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} glass-card`}>
        <div className={styles.header}>
          <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className={styles.inputGroup}>
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="puzzle_master"
              />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Processing..." : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button className="btn-link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create one" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
