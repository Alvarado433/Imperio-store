"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Login, Usuario } from "@/types/types";

import instance from "@/service/Conexao/conn";
import { useAuth } from "@/context/AuthContext";

interface LoginResponse {
  usuario?: Usuario;
  erro?: string;
}

export default function useLogin() {
  const { setUsuario } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function login({ email, senha }: Login): Promise<Usuario | undefined> {
    setLoading(true);
    setError(null);

    try {
      const response = await instance.post<LoginResponse>("/autenticar/login", {
        email,
        senha,
      });

      const user = response.data.usuario;

      if (user) {
        setUsuario(user);

        // Redireciona baseado no nível de usuário
        switch (user.nivel_id) {
          case 1:
            router.push("/");
            break;
          case 2:
            router.push("/Dashboard");
            break;
          default:
            // Redirecionamento padrão ou mensagem
            router.push("/");
        }

        return user;
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (err) {
      let mensagem = "Erro ao fazer login";

      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data && typeof data === "object" && "erro" in data) {
          mensagem = (data as { erro?: string }).erro ?? mensagem;
        }
      }

      setError(mensagem);
    } finally {
      setLoading(false);
    }
  }

  const clearError = () => setError(null);

  return { login, loading, error, clearError };
}
