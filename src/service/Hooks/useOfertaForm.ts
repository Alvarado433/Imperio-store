import { useState } from "react";
import { OfertaForm } from "@/types/types";
import { cadastrarOferta, listarProdutos } from "./OfertasService";

export function useOfertaForm() {
  const [novaOferta, setNovaOferta] = useState<OfertaForm>({
    titulo: "",
    descricao: "",
    desconto: "",
    data_inicio: "",
    data_fim: "",
    produto_id: null,
    produtos_ids: [],
  });

  const [produtos, setProdutos] = useState<{ id: number; nome: string }[]>([]);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<"success" | "danger">("success");
  const [showModal, setShowModal] = useState(false);

  const carregarProdutos = async () => {
    try {
      const data = await listarProdutos();
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "desconto") {
      const val = value === "" ? "" : parseFloat(value);
      setNovaOferta((prev) => ({ ...prev, desconto: val }));
    } else {
      setNovaOferta((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiProdutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    setNovaOferta((prev) => ({
      ...prev,
      produtos_ids: options,
      produto_id: options.includes(prev.produto_id ?? -1) ? prev.produto_id : null,
    }));
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    if (
      !novaOferta.titulo ||
      novaOferta.desconto === "" ||
      novaOferta.produtos_ids.length === 0 ||
      novaOferta.produto_id === null
    ) {
      setMensagem("Preencha todos os campos obrigatórios: Título, Desconto, Produtos e Produto Principal.");
      setAlertVariant("danger");
      return false;
    }

    try {
      await cadastrarOferta(novaOferta);
      setMensagem("Oferta cadastrada com sucesso!");
      setAlertVariant("success");
      setShowModal(false);
      setNovaOferta({
        titulo: "",
        descricao: "",
        desconto: "",
        data_inicio: "",
        data_fim: "",
        produto_id: null,
        produtos_ids: [],
      });
      if (onSuccess) onSuccess();
      return true;
    } catch (e) {
      console.error("Erro ao cadastrar oferta:", e);
      setMensagem("Erro ao cadastrar oferta.");
      setAlertVariant("danger");
      return false;
    }
  };

  return {
    novaOferta,
    setNovaOferta,
    produtos,
    mensagem,
    alertVariant,
    showModal,
    setShowModal,
    carregarProdutos,
    handleChange,
    handleMultiProdutoChange,
    handleSubmit,
  };
}
