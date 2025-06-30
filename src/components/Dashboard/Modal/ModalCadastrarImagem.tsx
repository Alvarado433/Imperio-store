import React, { useState, useEffect } from "react";
import { Modal, Button, Image, Row, Col, Spinner, Alert, Badge } from "react-bootstrap";
import { ImagemProduto, Produto } from "@/types/types";
import conn from "@/service/Conexao/conn";

interface ModalCadastrarImagemProps {
  show: boolean;
  onHide: () => void;
  produto: Produto | null;
}

export default function ModalCadastrarImagem({
  show,
  onHide,
  produto,
}: ModalCadastrarImagemProps) {
  const [imagensDisponiveis, setImagensDisponiveis] = useState<ImagemProduto[]>([]);
  const [imagensSelecionadas, setImagensSelecionadas] = useState<Set<number>>(new Set());
  const [loadingImagens, setLoadingImagens] = useState(false);

  useEffect(() => {
    if (show) {
      buscarImagensDisponiveis();
      setImagensSelecionadas(new Set());
    }
  }, [show]);

  const montarSrcBase64 = (base64: string | null, tipo = "jpeg") => {
    return base64 ? `data:image/${tipo};base64,${base64}` : "";
  };

  const buscarImagensDisponiveis = async () => {
    setLoadingImagens(true);
    try {
      const resp = await conn.get("/imagens/Listrar");
      // Só imagens sem produto_id (não associadas)
      const disponiveis = resp.data.filter(
        (img: ImagemProduto) => !img.produto_id
      );
      setImagensDisponiveis(disponiveis);
    } catch (error) {
      console.error("Erro ao buscar imagens disponíveis", error);
      setImagensDisponiveis([]);
    } finally {
      setLoadingImagens(false);
    }
  };

  const toggleSelecionarImagem = (id: number) => {
    setImagensSelecionadas((oldSet) => {
      const newSet = new Set(oldSet);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const associarImagensAoProduto = async () => {
    if (!produto) return;

    try {
      await Promise.all(
        Array.from(imagensSelecionadas).map((imgId) =>
          conn.put(`/imagens/${imgId}`, { produto_id: produto.id })
        )
      );

      onHide();

      // Recarrega a página para atualizar tudo
      window.location.reload();
    } catch (error) {
      console.error("Erro ao associar imagens ao produto", error);
      alert("Erro ao associar imagens ao produto");
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Selecionar Imagens para o Produto: {produto?.nome}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingImagens ? (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : imagensDisponiveis.length === 0 ? (
          <Alert variant="info">Não há imagens disponíveis para associar.</Alert>
        ) : (
          <Row className="gap-3">
            {imagensDisponiveis.map((img) => (
              <Col
                key={img.id}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                className="mb-3"
                style={{ cursor: "pointer", position: "relative" }}
                onClick={() => toggleSelecionarImagem(img.id)}
              >
                <Image
                  src={montarSrcBase64(img.imagem_base64)}
                  alt={`Imagem ${img.id}`}
                  thumbnail
                  style={{
                    border: imagensSelecionadas.has(img.id)
                      ? "3px solid #ffc107"
                      : "1px solid #ddd",
                    borderRadius: 4,
                    height: "120px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                {imagensSelecionadas.has(img.id) && (
                  <Badge
                    bg="warning"
                    text="dark"
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      borderRadius: "50%",
                      padding: "0.2rem 0.5rem",
                      fontSize: "0.9rem",
                    }}
                  >
                    ✓
                  </Badge>
                )}
              </Col>
            ))}
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={associarImagensAoProduto}
          disabled={imagensSelecionadas.size === 0}
        >
          Associar Imagens Selecionadas
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
