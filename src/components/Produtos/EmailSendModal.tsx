import React from "react";

interface EmailSendModalProps {
  aberto: boolean;
  fechar: () => void;
  email: string;
  setEmail: (email: string) => void;
  assunto: string;
  setAssunto: (assunto: string) => void;
  mensagem: string;
  setMensagem: (msg: string) => void;
  enviarEmail: () => void;
}

export default function EmailSendModal({
  aberto,
  fechar,
  email,
  setEmail,
  assunto,
  setAssunto,
  mensagem,
  setMensagem,
  enviarEmail,
}: EmailSendModalProps) {
  if (!aberto) return null;

  return (
    <>
      <div className="modal-overlay" onClick={fechar}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <h3>Enviar E-mail para o Cliente</h3>

          <label htmlFor="emailCliente">E-mail:</label>
          <input
            id="emailCliente"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite o email do cliente"
            className="input-email"
          />

          <label htmlFor="assuntoEmail">Assunto:</label>
          <input
            id="assuntoEmail"
            type="text"
            value={assunto}
            onChange={e => setAssunto(e.target.value)}
            placeholder="Digite o assunto do e-mail"
            className="input-assunto"
          />

          <label htmlFor="mensagemEmail">Mensagem:</label>
          <textarea
            id="mensagemEmail"
            rows={8}
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            className="textarea-mensagem"
            placeholder="Digite a mensagem do e-mail"
          />

          <div className="btn-group">
            <button onClick={enviarEmail} className="btn btn-email-send">
              ✉️ Enviar E-mail
            </button>
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

        label {
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
          color: #444;
        }

        .input-email,
        .input-assunto {
          width: 100%;
          padding: 8px;
          margin-bottom: 15px;
          border-radius: 6px;
          border: 1.8px solid #ccc;
          font-size: 16px;
          font-family: inherit;
          box-sizing: border-box;
        }

        .input-email:focus,
        .input-assunto:focus {
          border-color: #0070f3;
          outline: none;
          box-shadow: 0 0 8px rgba(0, 112, 243, 0.5);
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
          margin-top: 20px;
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
        }

        .btn-email-send {
          background-color: #0070f3;
        }

        .btn-email-send:hover {
          background-color: #005bb5;
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
