import { useEffect, useState } from "react";
import instance from "../Conexao/conn";

export function useMensagem() {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMensagem() {
      try {
        const response = await instance.get("/");
        setMensagem(response.data.mensagem);
      } catch {
        setErro("Erro ao buscar mensagem da API");
      } finally {
        setCarregando(false);
      }
    }

    fetchMensagem();
  }, []);

  return { mensagem, carregando, erro };
}
