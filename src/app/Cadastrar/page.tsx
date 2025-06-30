'use client';

import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard } from "react-icons/fa";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Toast, ToastContainer } from "react-bootstrap";

import { AxiosError, isAxiosError } from "axios";
import conn from "@/service/Conexao/conn";

interface UsuarioFormulario {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  nivel_id?: number;
}

// Máscaras
function aplicarMascaraTelefone(valor: string) {
  const numero = valor.replace(/\D/g, "");
  if (numero.length <= 2) return `(${numero}`;
  if (numero.length <= 7) return `(${numero.slice(0, 2)}) ${numero.slice(2)}`;
  if (numero.length <= 11) return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
  return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7, 11)}`;
}

function aplicarMascaraCPF(valor: string) {
  const numero = valor.replace(/\D/g, "");
  if (numero.length <= 3) return numero;
  if (numero.length <= 6) return `${numero.slice(0, 3)}.${numero.slice(3)}`;
  if (numero.length <= 9) return `${numero.slice(0, 3)}.${numero.slice(3, 6)}.${numero.slice(6)}`;
  return `${numero.slice(0, 3)}.${numero.slice(3, 6)}.${numero.slice(6, 9)}-${numero.slice(9, 11)}`;
}

// Validação de e-mail forte
function validarEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

export default function Cadastrar() {
  const [form, setForm] = useState<UsuarioFormulario>({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
    nivel_id: 1,
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "danger">("success");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "telefone") {
      setForm(f => ({ ...f, telefone: aplicarMascaraTelefone(value) }));
    } else if (name === "cpf") {
      setForm(f => ({ ...f, cpf: aplicarMascaraCPF(value) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (!form.nome || !form.email || !form.senha || !form.telefone || !form.cpf) {
      setErrorMsg("Por favor, preencha todos os campos.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    if (!validarEmail(form.email)) {
      setErrorMsg("Digite um e-mail válido.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    if (form.senha.length < 6) {
      setErrorMsg("A senha deve ter no mínimo 6 caracteres.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const res = await conn.post("/usuarios/cadastrar", form);
      setSuccessMsg(res.data.mensagem || "Usuário cadastrado com sucesso!");
      setToastVariant("success");
      setShowToast(true);
      setForm({ nome: "", email: "", senha: "", telefone: "", cpf: "", nivel_id: 1 });
      setMostrarSenha(false);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<{ erro?: string }>;
        const msg = axiosError.response?.data?.erro || "Erro ao cadastrar usuário.";
        setErrorMsg(msg);
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Erro ao cadastrar usuário.");
      }
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <style jsx>{`
        main {
          background: #9b2c61;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #fce7f3;
        }
        section.card {
          background: #6f1e44;
          border-radius: 1rem;
          box-shadow: 0 0 25px rgba(155, 44, 97, 0.8);
          padding: 2rem;
          width: 100%;
          max-width: 480px;
        }
        h2 {
          color: #f8bbd0;
          font-weight: 700;
          margin-bottom: 2rem;
          text-align: center;
          text-shadow: 0 0 8px #f8bbd0aa;
        }
        form {
          width: 100%;
        }
        .input-container {
          display: flex;
          align-items: center;
          background: #7d2a5a;
          border: 2px solid #f8bbd0;
          border-radius: 0.6rem;
          padding: 0.5rem 0.75rem;
          margin-bottom: 1.2rem;
        }
        .input-icon {
          color: #f8bbd0;
          font-size: 1.25rem;
          margin-right: 0.5rem;
          display: flex;
          align-items: center;
        }
        .input-container input {
          background: transparent;
          border: none;
          outline: none;
          color: #fce7f3;
          font-size: 1rem;
          flex: 1;
        }
        .input-container input::placeholder {
          color: #f8bbd0cc;
        }
        .input-container:focus-within {
          border-color: #fce7f3;
          box-shadow: 0 0 8px #f8bbd0aa;
        }
        .show-password-btn {
          background: transparent;
          border: none;
          color: #f8bbd0;
          font-size: 1.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        button.btn-submit {
          background: #8e3b6b;
          border: none;
          border-radius: 0.8rem;
          width: 100%;
          padding: 0.85rem 0;
          font-weight: 700;
          font-size: 1.1rem;
          color: #fce7f3;
          cursor: pointer;
          box-shadow: 0 0 15px #f8bbd0aa;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
          letter-spacing: 0.05em;
        }
        button.btn-submit:hover:not(:disabled) {
          background: #b65785;
          box-shadow: 0 0 20px #fce7f3cc;
        }
        button.btn-submit:disabled {
          background: #5a2040;
          cursor: not-allowed;
          box-shadow: none;
          color: #f8bbd044;
        }
        p.text-center a {
          color: #f8bbd0;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        p.text-center a:hover {
          color: #fce7f3;
          text-decoration: underline;
        }
      `}</style>

      <main>
        <section className="card">
          <h2>
            Criar Conta <br />
            <span>Império Store</span>
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-container">
              <span className="input-icon"><FaUser /></span>
              <input
                type="text"
                name="nome"
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-container">
              <span className="input-icon"><FaEnvelope /></span>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-container">
              <span className="input-icon"><FaPhone /></span>
              <input
                type="text"
                name="telefone"
                placeholder="(11) 91234-5678"
                value={form.telefone}
                onChange={handleChange}
                maxLength={15}
                required
              />
            </div>

            <div className="input-container">
              <span className="input-icon"><FaIdCard /></span>
              <input
                type="text"
                name="cpf"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={handleChange}
                maxLength={14}
                required
              />
            </div>

            <div className="input-container">
              <span className="input-icon"><FaLock /></span>
              <input
                type={mostrarSenha ? "text" : "password"}
                name="senha"
                placeholder="Sua senha"
                value={form.senha}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <BsEyeSlashFill /> : <BsEyeFill />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="text-center mt-3">
            Já tem conta? <a href="/Login">Entrar agora</a>
          </p>
        </section>
      </main>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={toastVariant}
          autohide
          delay={3500}
        >
          <Toast.Body className="text-white fw-semibold">
            {toastVariant === "danger" ? errorMsg : successMsg}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
