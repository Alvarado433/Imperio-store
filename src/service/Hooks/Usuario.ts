import { useState, useEffect } from "react";
import instance from "../Conexao/conn";
import { Usuario } from "@/types/types";

interface AxiosErrorWithResponse {
  response?: {
    data?: {
      erro?: string;
      [key: string]: unknown; // Use unknown em vez de any
    };
  };
}

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        setLoading(true);
        const response = await instance.get<Usuario[]>("/usuarios/Listrar");
        setUsuarios(response.data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (
          typeof err === "object" &&
          err !== null &&
          "response" in err
        ) {
          const erroData = (err as AxiosErrorWithResponse).response?.data?.erro;
          setError(typeof erroData === "string" ? erroData : "Erro ao buscar usuários");
        } else {
          setError("Erro ao buscar usuários");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  async function cadastrarUsuario(novoUsuario: Omit<Usuario, "id" | "nivel">): Promise<{
    sucesso: boolean;
    mensagem?: string;
    usuario?: Usuario;
  }> {
    try {
      setLoading(true);
      const response = await instance.post("/usuarios/cadastrar", novoUsuario);
      if (response.status === 201) {
        setUsuarios((prev) => [...prev, response.data.usuario]);
        return { sucesso: true, usuario: response.data.usuario };
      } else {
        return { sucesso: false, mensagem: response.data.erro || "Erro desconhecido" };
      }
    } catch (error: unknown) {
      let mensagem = "Erro ao cadastrar usuário";
      if (error instanceof Error) {
        mensagem = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as AxiosErrorWithResponse;
        const erroData = err.response?.data?.erro;
        mensagem = typeof erroData === "string" ? erroData : mensagem;
      }
      return { sucesso: false, mensagem };
    } finally {
      setLoading(false);
    }
  }

  async function editarUsuario(
    id: number,
    dadosAtualizados: Partial<Omit<Usuario, "id" | "nivel">>
  ): Promise<{ sucesso: boolean; mensagem?: string; usuario?: Usuario }> {
    try {
      setLoading(true);
      const response = await instance.put(`/usuarios/${id}`, dadosAtualizados);
      if (response.status === 200) {
        const usuarioAtualizado = response.data.usuario;
        setUsuarios((prev) =>
          prev.map((usuario) => (usuario.id === id ? usuarioAtualizado : usuario))
        );
        return { sucesso: true, usuario: usuarioAtualizado };
      } else {
        return { sucesso: false, mensagem: response.data.erro || "Erro ao atualizar usuário" };
      }
    } catch (error: unknown) {
      let mensagem = "Erro ao editar usuário";
      if (error instanceof Error) {
        mensagem = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as AxiosErrorWithResponse;
        const erroData = err.response?.data?.erro;
        mensagem = typeof erroData === "string" ? erroData : mensagem;
      }
      return { sucesso: false, mensagem };
    } finally {
      setLoading(false);
    }
  }

  async function excluirUsuario(id: number): Promise<{ sucesso: boolean; mensagem?: string }> {
    try {
      setLoading(true);
      const response = await instance.delete(`/usuarios/${id}`);
      if (response.status === 200) {
        setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
        return { sucesso: true, mensagem: "Usuário deletado com sucesso" };
      } else {
        return { sucesso: false, mensagem: response.data.erro || "Erro ao deletar usuário" };
      }
    } catch (error: unknown) {
      let mensagem = "Erro ao excluir usuário";
      if (error instanceof Error) {
        mensagem = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as AxiosErrorWithResponse;
        const erroData = err.response?.data?.erro;
        mensagem = typeof erroData === "string" ? erroData : mensagem;
      }
      return { sucesso: false, mensagem };
    } finally {
      setLoading(false);
    }
  }

  return {
    usuarios,
    loading,
    error,
    cadastrarUsuario,
    editarUsuario,
    excluirUsuario,
    setUsuarios,
  };
}
