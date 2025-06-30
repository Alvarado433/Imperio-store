import instance from "@/service/Conexao/conn";
import axios from "axios";

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

interface NovaCategoria {
  nome: string;
  descricao?: string;
}

// 🔹 Listar todas as categorias
export async function listarCategorias(): Promise<Categoria[] | null> {
  try {
    const response = await instance.get<Categoria[]>("/categorias/listrar"); // mantendo typo
    return response.data;
  } catch (err: unknown) {
    tratarErro(err, "Erro ao listar categorias");
    return null;
  }
}

// 🔹 Obter uma categoria por ID
export async function obterCategoria(id: number): Promise<Categoria | null> {
  try {
    const response = await instance.get<Categoria>(`/categorias/${id}`);
    return response.data;
  } catch (err: unknown) {
    tratarErro(err, `Erro ao obter categoria ID ${id}`);
    return null;
  }
}

// 🔹 Cadastrar nova categoria
export async function cadastrarCategoria(dados: NovaCategoria): Promise<Categoria | null> {
  try {
    const response = await instance.post<Categoria>("/categorias/cadastrar", dados);
    return response.data;
  } catch (err: unknown) {
    tratarErro(err, "Erro ao cadastrar categoria");
    return null;
  }
}

// 🔹 Atualizar uma categoria existente
export async function atualizarCategoria(
  id: number,
  dados: Partial<NovaCategoria>
): Promise<Categoria | null> {
  try {
    const response = await instance.put<Categoria>(`/categorias/atualizar/${id}`, dados);
    return response.data;
  } catch (err: unknown) {
    tratarErro(err, `Erro ao atualizar categoria ID ${id}`);
    return null;
  }
}

// 🔹 Excluir uma categoria
export async function excluirCategoria(id: number): Promise<{ message: string } | null> {
  try {
    const response = await instance.delete<{ message: string }>(`/categorias/excluir/${id}`);
    return response.data;
  } catch (err: unknown) {
    tratarErro(err, `Erro ao excluir categoria ID ${id}`);
    return null;
  }
}

// Função helper para tratamento de erros
function tratarErro(err: unknown, prefixoMensagem: string) {
  if (axios.isAxiosError(err)) {
    console.error(`${prefixoMensagem}:`, err.response?.data || err.message);
  } else if (err instanceof Error) {
    console.error(`${prefixoMensagem}:`, err.message);
  } else {
    console.error(`${prefixoMensagem}: Erro desconhecido`);
  }
}
