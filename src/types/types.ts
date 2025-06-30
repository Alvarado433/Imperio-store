export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  nivel_id: number;
  nivel?: Nivel | null;
}

export interface Login {
  email: string;
  senha: string;
}

export interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  open: boolean;
  ativo?: boolean;
  color?: string;
}

export interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export interface Nivel {
  id: number;
  nome: string;
  descricao: string;
}

export interface ImagemData {
  id?: number;
  produto_id: number | null;
  imagem_base64: string;
  descricao?: string | null;
}

export interface ImagemProduto {
  id: number;
  imagem_base64: string | null;
  descricao?: string | null;
  produto_id?: number | null;  // <-- adicionado aqui
}


export interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: string;
  parcelamento?: string | null;
  pix_valor?: number | null;
  formas_pagamento?: string[] | null;
  categoria_id: number;
  categoria?: { id: number; nome: string }; // adicionado
  imagens: ImagemProduto[];
}

export interface ProdutoCreate {
  nome: string;
  preco: number;
  estoque: string;
  parcelamento?: string | null;
  pix_valor?: number | null;
  formas_pagamento?: string[] | null;
  categoria_id: number;
  imagens?: {
    imagem_base64: string;
    descricao?: string;
  }[];
}

export interface Oferta {
  id: number;
  titulo: string;
  descricao?: string;
  desconto: number;
  data_inicio: string;
  data_fim?: string | null;
  produto_id: number;
}

export interface OfertaForm {
  titulo: string;
  descricao?: string;
  desconto: string | number;
  data_inicio?: string;
  data_fim?: string;
  produto_id: number | null;
  produtos_ids: number[];
}

export interface Banner {
  id?: number;
  titulo: string;
  imagem_base64?: string | null;
  oferta_id: number;
  nivel_id?: number | null;
}
export  interface Categoria {
  id: number;
  nome: string;
} 

export interface ResumoCompraItem {
  nome: string;
  quantidade: number;
  preco: number;
}

// src/types.ts

export interface PedidoItem {
  produto_id: number;
  produto_nome?: string;
  quantidade: number;
  preco_unitario: number;
}

export interface Pedido {
  id: number;
  nome_completo: string;
  cpf: string;
  telefone: string;
  email: string;
  valor_total: number;
  status: string;
  data_criacao: string;
  itens: PedidoItem[];
}
export interface UsuarioFormulario {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cpf: string;
  nivel_id: number;
}