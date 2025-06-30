'use client';

import useLogin from "@/service/Hooks/Login";
import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
 // caminho para seu hook

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { login, loading, error} = useLogin();
  const [sucesso, setSucesso] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSucesso("");

    if (!email.trim() || !senha.trim()) return;

    const result = await login({ email, senha });

    if (result) {
      setSucesso("Login efetuado com sucesso!");
      setEmail("");
      setSenha("");
      // redirecionar, salvar token, etc
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      background: "linear-gradient(135deg, #b76e79 0%, #d8a657 100%)",
      fontFamily: "system-ui, sans-serif",
    }}>
      <section style={{
        backgroundColor: "#fff9f7",
        padding: "2.5rem 2rem",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(216,166,87,0.35)",
        maxWidth: "400px",
        width: "100%",
        border: "2px solid #d8a657",
      }}>
        <h1 style={{
          color: "#b76e79",
          fontWeight: "bold",
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "0.5rem",
        }}>
          Império Store
        </h1>
        <p style={{
          color: "#80545c",
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "1rem",
        }}>
          Acesse sua conta para continuar
        </p>

        {error && (
          <div style={{
            backgroundColor: "#f8d7da",
            color: "#842029",
            border: "1px solid #f5c2c7",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}>
            {error}
          </div>
        )}

        {sucesso && (
          <div style={{
            backgroundColor: "#d1e7dd",
            color: "#0f5132",
            border: "1px solid #badbcc",
            borderRadius: "8px",
            padding: "0.75rem",
            marginBottom: "1rem",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}>
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "1.2rem", position: "relative" }}>
            <FaEnvelope style={{
              position: "absolute",
              top: "50%",
              left: "12px",
              transform: "translateY(-50%)",
              color: "#d8a657",
            }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px 12px 38px",
                borderRadius: "10px",
                border: "2px solid #d8a657",
                outline: "none",
                fontSize: "1rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem", position: "relative" }}>
            <FaLock style={{
              position: "absolute",
              top: "50%",
              left: "12px",
              transform: "translateY(-50%)",
              color: "#d8a657",
            }} />
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 38px 12px 38px",
                borderRadius: "10px",
                border: "2px solid #d8a657",
                outline: "none",
                fontSize: "1rem",
              }}
            />
            <span onClick={() => setMostrarSenha(!mostrarSenha)} style={{
              position: "absolute",
              top: "50%",
              right: "12px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#b76e79",
            }}>
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <a href="/esqueci-senha" style={{
              color: "#b76e79",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.9rem",
            }}>
              Esqueci a senha
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 0",
              fontSize: "1.1rem",
              fontWeight: "700",
              backgroundColor: "#b76e79",
              color: "#f7e6ad",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(183,110,121,0.4)",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <hr style={{ margin: "2rem 0", borderColor: "#d8a657" }} />

        <p style={{ textAlign: "center", fontSize: "0.95rem" }}>
          Não tem uma conta?{" "}
          <a href="/Cadastrar" style={{ color: "#b76e79", fontWeight: "700", textDecoration: "none" }}>
            Cadastre-se aqui
          </a>
        </p>
      </section>

      <style jsx>{`
        @media (max-width: 480px) {
          section {
            padding: 2rem 1rem !important;
          }
          h1 {
            font-size: 1.7rem !important;
          }
          p {
            font-size: 0.95rem !important;
          }
          input,
          button {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </main>
  );
}
