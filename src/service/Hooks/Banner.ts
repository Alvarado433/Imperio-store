import { useState, useEffect } from "react";
import axiosBase from "axios"; // mantém para usar axiosBase.isAxiosError
import api from "@/service/Conexao/conn"; // sua instância customizada do Axios

export interface Banner {
  id?: number;
  titulo: string;
  imagem_base64?: string | null;
  oferta_id: number;
  nivel_id?: number | null;
}

function getErrorMessage(error: unknown): string {
  if (axiosBase.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Erro desconhecido na requisição";
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Erro inesperado";
}

export function useBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function listar() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Banner[]>("/banners/listar");
      setBanners(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function buscarPorId(id: number) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Banner>(`/banners/${id}`);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function cadastrar(banner: Banner) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Banner>("/banners/cadastrar", banner);
      setBanners((prev) => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function atualizar(id: number, banner: Partial<Banner>) {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put<Banner>(`/banners/${id}`, banner);
      setBanners((prev) => prev.map((b) => (b.id === id ? response.data : b)));
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function deletar(id: number) {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listar();
  }, []);

  return {
    banners,
    loading,
    error,
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    deletar,
  };
}
