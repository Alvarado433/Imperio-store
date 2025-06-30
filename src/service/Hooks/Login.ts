"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import instance from "../Conexao/conn";
import { Login, Usuario } from "@/types/types";

import Cookies from "js-cookie";
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

  async function login({ email, senha }: Login) {
    setLoading(true);
    setError(null);

    try {
      const response = await instance.post<LoginResponse>("/autenticar/login", { email, senha });

      if (response.data.usuario) {
        const user = response.data.usuario;

        // Salva no contexto
        setUsuario(user);
        // Salva cookie com validade de 7 dias
        Cookies.set("usuario", JSON.stringify(user), { expires: 7, sameSite: "lax" });

        if (user.nivel_id === 1) {
          router.push("/");
        } else if (user.nivel_id === 2) {
          router.push("/Dashboard");
        }

        return user;
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (error: unknown) {
      // Tipo esperado para o erro Axios
      type AxiosErrorResponse = {
        response?: {
          data?: {
            erro?: string;
          };
        };
      };

      const axiosError = error as AxiosErrorResponse;

      if (axiosError.response?.data?.erro) {
        setError(axiosError.response.data.erro);
      } else {
        setError("Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
