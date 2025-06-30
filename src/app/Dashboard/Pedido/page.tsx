'use client'
import React, { useEffect, useState } from "react";
import api from "@/service/Conexao/conn";
import { Pedido } from "@/types/types";
import WhatsAppMessageModal from "@/components/Produtos/whats";
import EmailSendModal from "@/components/Produtos/EmailSendModal";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  const [modalMensagemAberto, setModalMensagemAberto] = useState(false);
  const [mensagemWhatsApp, setMensagemWhatsApp] = useState("");

  const [modalEmailAberto, setModalEmailAberto] = useState(false);
  const [emailCliente, setEmailCliente] = useState("");
  const [assuntoEmail, setAssuntoEmail] = useState("");
  const [mensagemEmail, setMensagemEmail] = useState("");

  useEffect(() => {
    api.get("/pedido/listar")
      .then(res => setPedidos(res.data as Pedido[]))
      .catch(err => {
        console.error("Erro ao buscar pedidos:", err);
        setError("Erro ao buscar pedidos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleVisualizar = (pedido: Pedido) => setPedidoSelecionado(pedido);
  const fecharModalVisualizar = () => setPedidoSelecionado(null);

  const abrirModalMensagem = () => {
    if (!pedidoSelecionado) return;
    const nomeProduto = pedidoSelecionado.itens.length > 0
      ? `Produto: ${pedidoSelecionado.itens[0].produto_nome || `ID ${pedidoSelecionado.itens[0].produto_id}`}`
      : "";

    setMensagemWhatsApp(`Olá ${pedidoSelecionado.nome_completo}, seu pedido #${pedidoSelecionado.id} (${nomeProduto}) foi aprovado! Muito obrigado pela compra!`);
    setModalMensagemAberto(true);
  };

  const fecharModalMensagem = () => {
    setModalMensagemAberto(false);
    setMensagemWhatsApp("");
  };

  const abrirModalEmail = () => {
    if (!pedidoSelecionado) return;

    setEmailCliente(pedidoSelecionado.email || "");
    setAssuntoEmail(`Seu Pedido #${pedidoSelecionado.id}`);
    setMensagemEmail(`Olá ${pedidoSelecionado.nome_completo}, seu pedido #${pedidoSelecionado.id} foi aprovado. Obrigado pela compra!`);
    setModalEmailAberto(true);
  };

  const fecharModalEmail = () => {
    setModalEmailAberto(false);
    setEmailCliente("");
    setAssuntoEmail("");
    setMensagemEmail("");
  };

  const enviarEmail = () => {
    if (!emailCliente.trim() || !assuntoEmail.trim() || !mensagemEmail.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    api.post('/email/enviar', {
      destinatario: emailCliente,
      assunto: assuntoEmail,
      mensagem: mensagemEmail
    })
      .then(() => {
        alert('E-mail enviado com sucesso!');
        fecharModalEmail();
      })
      .catch(err => {
        console.error('Erro ao enviar e-mail:', err);
        alert('Erro ao enviar e-mail.');
      });
  };

  if (loading) return <p>Carregando pedidos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h2 className="title">Todos os Pedidos</h2>
      <div className="table-wrapper">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome Completo</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Valor Total</th>
              <th>Status</th>
              <th>Data Criação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 ? (
              <tr><td colSpan={8} className="no-data">Nenhum pedido encontrado.</td></tr>
            ) : pedidos.map((pedido, index) => (
              <tr key={pedido.id} className={index % 2 === 0 ? "even" : "odd"}>
                <td>{pedido.id}</td>
                <td>{pedido.nome_completo}</td>
                <td>{pedido.cpf}</td>
                <td>{pedido.telefone}</td>
                <td className="valor">R$ {pedido.valor_total.toFixed(2)}</td>
                <td className={`status ${pedido.status.toLowerCase()}`}>{pedido.status}</td>
                <td>{new Date(pedido.data_criacao).toLocaleString()}</td>
                <td className="actions">
                  <button onClick={() => handleVisualizar(pedido)} className="btn btn-view">👁️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pedidoSelecionado && (
        <div className="modal-overlay" onClick={fecharModalVisualizar}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Pedido #{pedidoSelecionado.id}</h3>
            <p><strong>Cliente:</strong> {pedidoSelecionado.nome_completo}</p>
            <p><strong>Telefone:</strong> {pedidoSelecionado.telefone}</p>
            <p><strong>Valor Total:</strong> R$ {pedidoSelecionado.valor_total.toFixed(2)}</p>
            <p><strong>Status:</strong> {pedidoSelecionado.status}</p>
            <h4>Itens:</h4>
            <ul className="itens-list">
              {pedidoSelecionado.itens.map((item, i) => (
                <li key={i}>
                  <strong>Produto:</strong> {item.produto_nome || `ID ${item.produto_id}`} |{" "}
                  <strong>Qtd:</strong> {item.quantidade} |{" "}
                  <strong>Preço Unit:</strong> R$ {item.preco_unitario.toFixed(2)}
                </li>
              ))}
            </ul>
            <button
              className="btn btn-whatsapp"
              onClick={abrirModalMensagem}
              disabled={pedidoSelecionado.status.toLowerCase() !== "aprovado"}
            >
              💬 Mensagem Cliente
            </button>
            <button className="btn btn-email" onClick={abrirModalEmail}>📧 Enviar E-mail</button>
            <button className="btn btn-fechar" onClick={fecharModalVisualizar}>Fechar</button>
          </div>
        </div>
      )}

      <WhatsAppMessageModal
        aberto={modalMensagemAberto}
        mensagem={mensagemWhatsApp}
        setMensagem={setMensagemWhatsApp}
        numeroTelefone={pedidoSelecionado?.telefone || ""}
        fechar={fecharModalMensagem}
      />

      <EmailSendModal
        aberto={modalEmailAberto}
        fechar={fecharModalEmail}
        email={emailCliente}
        setEmail={setEmailCliente}
        assunto={assuntoEmail}
        setAssunto={setAssuntoEmail}
        mensagem={mensagemEmail}
        setMensagem={setMensagemEmail}
        enviarEmail={enviarEmail}
      />

      {/* CSS INLINE NA PÁGINA */}
      <style jsx>{`
        .title {
          text-align: center;
          margin: 20px 0;
          color: #222;
        }
        .table-wrapper {
          max-width: 100%;
          overflow-x: auto;
          padding: 0 10px;
        }
        .pedidos-table {
          width: 100%;
          border-collapse: collapse;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        }
        .pedidos-table th,
        .pedidos-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
        }
        .pedidos-table thead {
          background: #0070f3;
          color: white;
        }
        .pedidos-table tbody tr.even {
          background-color: #f9f9f9;
        }
        .pedidos-table tbody tr.odd {
          background-color: #fff;
        }
        .valor {
          font-weight: 600;
          color: #008000;
        }
        .status {
          text-transform: capitalize;
          font-weight: 600;
          padding: 5px 8px;
          border-radius: 4px;
          color: white;
          text-align: center;
        }
        .status.pendente {
          background-color: #f0ad4e;
        }
        .status.aprovado {
          background-color: #5cb85c;
        }
        .status.cancelado {
          background-color: #d9534f;
        }
        .actions {
          text-align: center;
        }
        .btn {
          cursor: pointer;
          border: none;
          border-radius: 4px;
          padding: 8px 14px;
          margin: 4px 2px;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }
        .btn-view {
          background-color: #3498db;
          color: white;
        }
        .btn-view:hover {
          background-color: #2980b9;
        }
        .btn-whatsapp {
          background-color: #25d366;
          color: white;
        }
        .btn-whatsapp:disabled {
          background-color: #a5d6a7;
          cursor: not-allowed;
        }
        .btn-whatsapp:hover:not(:disabled) {
          background-color: #1ebe57;
        }
        .btn-email {
          background-color: #0070f3;
          color: white;
          margin-left: 6px;
        }
        .btn-email:hover {
          background-color: #005bb5;
        }
        .btn-fechar {
          background-color: #e0e0e0;
          color: #333;
          width: 100%;
          margin-top: 10px;
        }
        .btn-fechar:hover {
          background-color: #c0c0c0;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: #fff;
          border-radius: 8px;
          padding: 25px 30px;
          width: 90%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }
        .itens-list {
          list-style: none;
          padding-left: 0;
          margin-bottom: 20px;
        }
        .itens-list li {
          padding: 6px 0;
          border-bottom: 1px solid #eee;
        }
      `}</style>
    </>
  );
}
