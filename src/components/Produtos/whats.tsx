import React from "react";

interface WhatsAppMessageModalProps {
  mensagem: string;
  setMensagem: (msg: string) => void;
  numeroTelefone: string;
  aberto: boolean;
  fechar: () => void;
}

export default function WhatsAppMessageModal({
  mensagem,
  setMensagem,
  numeroTelefone,
  aberto,
  fechar,
}: WhatsAppMessageModalProps) {
  if (!aberto) return null;

  const gerarLinkWhatsapp = () => {
    const numero = numeroTelefone.replace(/\D/g, "");
    return `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <>
      <div className="modal-overlay" onClick={fechar}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h3>Mensagem para o Cliente</h3>
          <textarea
            rows={8}
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            className="textarea-mensagem"
            placeholder="Edite a mensagem antes de enviar..."
          />
          <div className="btn-group">
            <a
              href={gerarLinkWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp-send"
            >
              📲 WhatsApp
            </a>
            <button className="btn btn-fechar" onClick={fechar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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
          z-index: 1100;
        }

        h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #222;
        }

        .textarea-mensagem {
          width: 100%;
          resize: vertical;
          padding: 12px;
          border-radius: 6px;
          border: 1.8px solid #ccc;
          box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          font-size: 16px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .textarea-mensagem:focus {
          border-color: #0070f3;
          outline: none;
          box-shadow: 0 0 8px rgba(0, 112, 243, 0.5);
        }

        .btn-group {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .btn {
          cursor: pointer;
          border: none;
          border-radius: 6px;
          padding: 12px 0;
          font-weight: 600;
          color: white;
          flex: 1;
          user-select: none;
          transition: background-color 0.3s ease;
          text-align: center;
          text-decoration: none;
        }

        .btn-whatsapp-send {
          background-color: #25d366;
        }

        .btn-whatsapp-send:hover {
          background-color: #1ebe57;
        }

        .btn-fechar {
          background-color: #e0e0e0;
          color: #333;
        }

        .btn-fechar:hover {
          background-color: #c0c0c0;
        }
      `}</style>
    </>
  );
}
