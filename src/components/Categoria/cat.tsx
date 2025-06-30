"use client";

import { cadastrarCategoria } from "@/service/Hooks/cathooks";
import { useState } from "react";
import Swal from "sweetalert2";

export default function CategoriaModal({ onCategoriaCriada }: { onCategoriaCriada: () => void }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await cadastrarCategoria({ nome, descricao });
      Swal.fire("Sucesso!", "Categoria cadastrada com sucesso.", "success");
      setNome("");
      setDescricao("");
      onCategoriaCriada();
    } catch (error: unknown) {
      let mensagem = "Erro inesperado";
      if (error instanceof Error) {
        mensagem = error.message;
      }
      Swal.fire("Erro", mensagem, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da categoria"
        required
      />
      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição"
      />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
