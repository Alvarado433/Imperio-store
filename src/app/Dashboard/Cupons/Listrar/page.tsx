"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import conn from "@/service/Conexao/conn";
import Swal from "sweetalert2";

type Cupom = {
  codigo: string;
  minPrice: number;
  maxPrice?: number | null;
  discount?: number | null;
  freeShipping: boolean;
  label?: string | null;
  statusId: number; // 3 = ativo, 4 = inativo
  statusNome?: string | null;
  validade?: string | null;
};

export default function ListarCupons() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Modais
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  // Cupom selecionado para visualizar ou editar
  const [cupomSelecionado, setCupomSelecionado] = useState<Cupom | null>(null);

  // Formulário de edição
  const [formData, setFormData] = useState({
    minPrice: "",
    maxPrice: "",
    discount: "",
    freeShipping: false,
    label: "",
    statusId: 3, // ativo por padrão
    validade: "",
  });

  // Buscar cupons do backend
  async function fetchCupons() {
    setLoading(true);
    setErro(null);
    try {
      const res = await conn.get("/cupons/listar");
      setCupons(res.data);
    } catch {
      setErro("Erro ao carregar cupons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCupons();
  }, []);

  // Abrir modal visualizar
  function abrirModalVisualizar(cupom: Cupom) {
    setCupomSelecionado(cupom);
    setModalViewOpen(true);
  }

  // Fechar modal visualizar
  function fecharModalVisualizar() {
    setModalViewOpen(false);
    setCupomSelecionado(null);
  }

  // Abrir modal editar preenchendo formulário
  function abrirModalEditar(cupom: Cupom) {
    setCupomSelecionado(cupom);
    setFormData({
      minPrice: cupom.minPrice.toString(),
      maxPrice: cupom.maxPrice ? cupom.maxPrice.toString() : "",
      discount: cupom.discount ? cupom.discount.toString() : "",
      freeShipping: cupom.freeShipping,
      label: cupom.label || "",
      statusId: cupom.statusId,
      validade: cupom.validade ? new Date(cupom.validade).toISOString().substring(0, 10) : "",
    });
    setModalEditOpen(true);
  }

  // Fechar modal editar
  function fecharModalEditar() {
    setModalEditOpen(false);
    setCupomSelecionado(null);
  }

  // Atualizar campo do formulário de edição
  function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: target.value,
      }));
    }
  }

  // Submeter edição
  async function handleSubmitEdit(e: FormEvent) {
    e.preventDefault();
    if (!cupomSelecionado) return;

    try {
      // Monta payload com tipos corretos
      const payload = {
        minPrice: parseFloat(formData.minPrice),
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
        discount: formData.discount ? parseFloat(formData.discount) : null,
        freeShipping: formData.freeShipping,
        label: formData.label.trim() || null,
        statusId: Number(formData.statusId),
        validade: formData.validade || null,
      };

      await conn.put(`/cupons/${cupomSelecionado.codigo}`, payload);
      Swal.fire("Sucesso", "Cupom atualizado com sucesso!", "success");
      fecharModalEditar();
      fetchCupons();
    } catch {
      Swal.fire("Erro", "Falha ao atualizar cupom.", "error");
    }
  }

  // Excluir cupom com confirmação
  async function excluirCupom(codigo: string) {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: `Excluir cupom ${codigo}? Esta ação não pode ser desfeita.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
    });

    if (result.isConfirmed) {
      try {
        await conn.delete(`/cupons/${codigo}`);
        Swal.fire("Excluído!", "O cupom foi excluído.", "success");
        fetchCupons();
      } catch {
        Swal.fire("Erro", "Não foi possível excluir o cupom.", "error");
      }
    }
  }

  // Toggle status ativo/inativo (3 = ativo, 4 = inativo)
  async function toggleStatus(cupom: Cupom) {
    const novoStatusId = cupom.statusId === 3 ? 4 : 3;
    try {
      await conn.patch(`/cupons/${cupom.codigo}/status`, { statusId: novoStatusId });
      Swal.fire({
        icon: "success",
        title: "Status atualizado",
        timer: 1200,
        showConfirmButton: false,
      });
      fetchCupons();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro ao atualizar status",
      });
    }
  }

  if (loading) return <p>Carregando cupons...</p>;
  if (erro) return <p className="error">{erro}</p>;
  if (cupons.length === 0) return <p>Nenhum cupom cadastrado.</p>;

  return (
    <>
      <div className="table-container" role="region" aria-label="Lista de cupons">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Preço Mínimo</th>
              <th>Preço Máximo</th>
              <th>Desconto (%)</th>
              <th>Frete Grátis</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Validade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cupons.map((cupom) => (
              <tr key={cupom.codigo}>
                <td>{cupom.codigo}</td>
                <td>R$ {cupom.minPrice.toFixed(2)}</td>
                <td>{cupom.maxPrice ? `R$ ${cupom.maxPrice.toFixed(2)}` : "-"}</td>
                <td>{cupom.discount ? `${cupom.discount}%` : "-"}</td>
                <td>{cupom.freeShipping ? "Sim" : "Não"}</td>
                <td>{cupom.label || "-"}</td>
                <td>
                  <label className="switch" aria-label={`Status do cupom ${cupom.codigo}`}>
                    <input
                      type="checkbox"
                      checked={cupom.statusId === 3}
                      onChange={() => toggleStatus(cupom)}
                    />
                    <span className={`slider round ${cupom.statusId === 3 ? "active" : ""}`}></span>
                  </label>
                </td>
                <td>{cupom.validade ? new Date(cupom.validade).toLocaleDateString() : "-"}</td>
                <td>
                  <button className="btn-view" onClick={() => abrirModalVisualizar(cupom)}>
                    Visualizar
                  </button>
                  <button className="btn-edit" onClick={() => abrirModalEditar(cupom)}>
                    Editar
                  </button>
                  <button className="btn-delete" onClick={() => excluirCupom(cupom.codigo)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Visualizar */}
      {modalViewOpen && cupomSelecionado && (
        <div
          className="modal-overlay"
          onClick={fecharModalVisualizar}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-view-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 id="modal-view-title">Detalhes do Cupom: {cupomSelecionado.codigo}</h2>
            <ul>
              <li>
                <strong>Status:</strong> {cupomSelecionado.statusId === 3 ? "Ativo" : "Inativo"}
              </li>
              <li>
                <strong>Preço Mínimo:</strong> R$ {cupomSelecionado.minPrice.toFixed(2)}
              </li>
              <li>
                <strong>Preço Máximo:</strong>{" "}
                {cupomSelecionado.maxPrice ? `R$ ${cupomSelecionado.maxPrice.toFixed(2)}` : "-"}
              </li>
              <li>
                <strong>Desconto:</strong> {cupomSelecionado.discount ? `${cupomSelecionado.discount}%` : "-"}
              </li>
              <li>
                <strong>Frete Grátis:</strong> {cupomSelecionado.freeShipping ? "Sim" : "Não"}
              </li>
              <li>
                <strong>Descrição:</strong> {cupomSelecionado.label || "-"}
              </li>
              <li>
                <strong>Validade:</strong>{" "}
                {cupomSelecionado.validade
                  ? new Date(cupomSelecionado.validade).toLocaleDateString()
                  : "-"}
              </li>
            </ul>
            <button className="btn-close" onClick={fecharModalVisualizar}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalEditOpen && cupomSelecionado && (
        <div
          className="modal-overlay"
          onClick={fecharModalEditar}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-edit-title"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 id="modal-edit-title">Editar Cupom: {cupomSelecionado.codigo}</h2>
            <form onSubmit={handleSubmitEdit}>
              <label>
                Preço Mínimo*:
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  required
                />
              </label>

              <label>
                Preço Máximo:
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                />
              </label>

              <label>
                Desconto (%):
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleFormChange}
                  step="0.01"
                  min="0"
                  max="100"
                />
              </label>

              <label>
                Frete Grátis:
                <input
                  type="checkbox"
                  name="freeShipping"
                  checked={formData.freeShipping}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Descrição:
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleFormChange}
                  maxLength={255}
                />
              </label>

              <label>
                Status:
                <select name="statusId" value={formData.statusId} onChange={handleFormChange} required>
                  <option value={3}>Ativo</option>
                  <option value={4}>Inativo</option>
                </select>
              </label>

              <label>
                Validade:
                <input
                  type="date"
                  name="validade"
                  value={formData.validade}
                  onChange={handleFormChange}
                />
              </label>

              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  Salvar
                </button>
                <button type="button" className="btn-cancel" onClick={fecharModalEditar}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .table-container {
          max-width: 900px;
          margin: 2rem auto;
          overflow-x: auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          color: #34495e;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #ecf0f1;
          font-size: 0.95rem;
          user-select: text;
        }
        th {
          background-color: #2980b9;
          color: #fff;
          font-weight: 600;
          position: sticky;
          top: 0;
          z-index: 1;
        }
        tbody tr:hover {
          background-color: #f0f8ff;
        }

        /* Toggle Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 22px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 22px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }
        .slider.active {
          background-color: #4caf50;
        }
        input:checked + .slider {
          background-color: #4caf50;
        }
        input:checked + .slider:before {
          transform: translateX(18px);
        }

        /* Botões na tabela */
        button {
          margin-right: 0.5rem;
          padding: 0.3rem 0.7rem;
          font-size: 0.85rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        .btn-view {
          background-color: #3498db;
          color: white;
        }
        .btn-view:hover {
          background-color: #1f6fa0;
        }
        .btn-edit {
          background-color: #2980b9;
          color: white;
        }
        .btn-edit:hover {
          background-color: #1c5980;
        }
        .btn-delete {
          background-color: #e74c3c;
          color: white;
        }
        .btn-delete:hover {
          background-color: #a83227;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          color: #34495e;
        }
        .modal-content h2 {
          margin-bottom: 1rem;
        }
        .modal-content ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1rem;
        }
        .modal-content li {
          margin-bottom: 0.5rem;
        }
        form label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        form input[type="text"],
        form input[type="number"],
        form input[type="date"],
        form select {
          width: 100%;
          padding: 0.4rem 0.6rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-sizing: border-box;
          margin-top: 0.3rem;
        }
        form input[type="checkbox"] {
          margin-left: 0.5rem;
          transform: scale(1.2);
          vertical-align: middle;
          cursor: pointer;
        }
        .modal-buttons {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
        .btn-save {
          background-color: #27ae60;
          color: white;
          margin-right: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease;
        }
        .btn-save:hover {
          background-color: #1e874b;
        }
        .btn-cancel {
          background-color: #95a5a6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          transition: background-color 0.3s ease;
        }
        .btn-cancel:hover {
          background-color: #6e7a7b;
        }
        .btn-close {
          background-color: #3498db;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          margin-top: 1rem;
          width: 100%;
          font-weight: 600;
        }
        .btn-close:hover {
          background-color: #1f6fa0;
        }
      `}</style>
    </>
  );
}
