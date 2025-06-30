import { useState } from "react";
import { Usuario } from "@/types/types";
import instance from "../Conexao/conn";
import axios from "axios";

export function useUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Listar todos
  async function listar() {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await instance.get<Usuario[]>("/usuarios/listar");
      setUsuarios(response.data);
      setSuccess(true);
      return response.data;
    } catch (err: unknown) {
      tratarErro(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Buscar por ID
  async function buscarPorId(id: number) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await instance.get<Usuario>(`/usuarios/${id}`);
      setSuccess(true);
      return response.data;
    } catch (err: unknown) {
      tratarErro(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Cadastrar
  async function cadastrar(usuario: Usuario) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await instance.post("/usuarios/cadastrar", usuario);
      setUsuarios((prev) => [...prev, response.data]);
      setSuccess(true);
      return response.data;
    } catch (err: unknown) {
      tratarErro(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Atualizar
  async function atualizar(id: number, dados: Partial<Usuario>) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await instance.put(`/usuarios/${id}`, dados);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? response.data : u))
      );
      setSuccess(true);
      return response.data;
    } catch (err: unknown) {
      tratarErro(err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Deletar
  async function deletar(id: number) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await instance.delete(`/usuarios/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      tratarErro(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // Função privada para tratar erros
  function tratarErro(err: unknown) {
    let mensagem = "Erro na requisição";
    if (axios.isAxiosError(err)) {
      mensagem = err.response?.data?.erro || err.message || mensagem;
    } else if (err instanceof Error) {
      mensagem = err.message;
    }
    setError(mensagem);
  }

  return {
    usuarios,
    loading,
    error,
    success,
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    deletar,
  };
}
