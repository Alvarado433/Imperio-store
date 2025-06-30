import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

export interface FiltroState {
  busca: string;
  precoMin: number | '';
  precoMax: number | '';
  freteGratis: boolean;
  descontoMin: number;
}

interface FiltroProdutosProps {
  filtro: FiltroState;
  setFiltro: (f: FiltroState) => void;
  limparFiltros: () => void;
}

export function FiltroProdutos({ filtro, setFiltro, limparFiltros }: FiltroProdutosProps) {
  // Controle local para inputs numéricos que aceitam '' (vazio)
  const [precoMin, setPrecoMin] = useState<string>(filtro.precoMin.toString() || '');
  const [precoMax, setPrecoMax] = useState<string>(filtro.precoMax.toString() || '');

  useEffect(() => {
    // Sincroniza quando filtro externo muda (ex: limpar)
    setPrecoMin(filtro.precoMin.toString() || '');
    setPrecoMax(filtro.precoMax.toString() || '');
  }, [filtro.precoMin, filtro.precoMax]);

  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro({ ...filtro, busca: e.target.value });
  };

  const handlePrecoMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPrecoMin(val);
    const numVal = val === '' ? '' : Number(val);
    setFiltro({ ...filtro, precoMin: numVal });
  };

  const handlePrecoMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPrecoMax(val);
    const numVal = val === '' ? '' : Number(val);
    setFiltro({ ...filtro, precoMax: numVal });
  };

  const handleFreteGratisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltro({ ...filtro, freteGratis: e.target.checked });
  };

  const handleDescontoMinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltro({ ...filtro, descontoMin: Number(e.target.value) });
  };

  return (
    <div className="filtro-box">
      <h5 className="mb-3 text-rosa fw-bold">Filtrar Produtos</h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label className="text-rosa fw-semibold">Buscar</Form.Label>
          <Form.Control
            type="search"
            name="busca"
            value={filtro.busca}
            placeholder="Ex: notebook, TV..."
            onChange={handleBuscaChange}
            className="input-rosa"
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-rosa fw-semibold">Preço Mínimo (R$)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            value={precoMin}
            onChange={handlePrecoMinChange}
            className="input-rosa"
            placeholder="0"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-rosa fw-semibold">Preço Máximo (R$)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            value={precoMax}
            onChange={handlePrecoMaxChange}
            className="input-rosa"
            placeholder="9999"
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex align-items-center gap-2">
          <Form.Check
            type="checkbox"
            id="freteGratis"
            label="Frete grátis"
            checked={filtro.freteGratis}
            onChange={handleFreteGratisChange}
            className="text-rosa fw-semibold"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="text-rosa fw-semibold">Desconto mínimo</Form.Label>
          <Form.Select value={filtro.descontoMin} onChange={handleDescontoMinChange} className="input-rosa">
            <option value={0}>Todos</option>
            <option value={5}>5% ou mais</option>
            <option value={10}>10% ou mais</option>
            <option value={15}>15% ou mais</option>
            <option value={20}>20% ou mais</option>
          </Form.Select>
        </Form.Group>

        <Button variant="outline-danger" onClick={limparFiltros} className="w-100 btn-reset" type="button">
          Limpar filtros
        </Button>
      </Form>
    </div>
  );
}
