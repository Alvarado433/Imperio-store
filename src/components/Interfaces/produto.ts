export  interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  nivel: number;
  imagens?: { imagem_base64: string }[];
  // ... outros campos que quiser adicionar
}