import { useState, useEffect } from 'react';

interface ResumoCompraItem {
  nome: string;
  quantidade: number;
  preco: number;
}

interface UsePaymentModalProps {
  total: number;
  onClose: () => void;
  resumoCompra?: ResumoCompraItem[]; // opcional
}

export default function usePaymentModal({ total, onClose, resumoCompra = [] }: UsePaymentModalProps) {
  // Evita warning de variável não usada
  void resumoCompra;

  const [activeTab, setActiveTab] = useState<'dados' | 'endereco' | 'pagamento'>('dados');
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix'>('cartao');

  // Dados pagamento cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Dados cliente
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Dados entrega
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cepErro, setCepErro] = useState<string | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Máscaras sem libs
  const mascaraCpf = (value: string) => {
    let v = value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return v;
  };

  const mascaraTelefone = (value: string) => {
    let v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
      v = v.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return v;
  };

  const mascaraCep = (value: string) => {
    let v = value.replace(/\D/g, '').slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    return v;
  };

  const mascaraCartao = (value: string) => {
    let v = value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    return v;
  };

  const mascaraValidade = (value: string) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    return v;
  };

  // Busca endereço ViaCEP
  const buscarEnderecoViaCep = async (cepLimpo: string) => {
    setBuscandoCep(true);
    setCepErro(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepErro('CEP não encontrado.');
        setEndereco('');
        setBairro('');
        setCidade('');
        setEstado('');
      } else {
        setEndereco(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
        setCepErro(null);
      }
    } catch {
      setCepErro('Erro ao buscar CEP.');
    } finally {
      setBuscandoCep(false);
    }
  };

  // Quando cep muda, tenta buscar se válido
  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarEnderecoViaCep(cepLimpo);
    }
  }, [cep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações simples
    if (!nomeCompleto.trim()) return alert('Preencha o nome completo');
    if (cpf.replace(/\D/g, '').length !== 11) return alert('CPF inválido');
    if (telefone.replace(/\D/g, '').length < 10) return alert('Telefone inválido');
    if (!email.trim()) return alert('Preencha o email');
    if (cep.replace(/\D/g, '').length !== 8) return alert('CEP inválido');
    if (!endereco.trim()) return alert('Preencha o endereço');
    if (!numero.trim()) return alert('Preencha o número');
    if (!bairro.trim()) return alert('Preencha o bairro');
    if (!cidade.trim()) return alert('Preencha a cidade');
    if (estado.trim().length !== 2) return alert('Estado inválido');

    alert(
      `Pagamento via ${paymentMethod.toUpperCase()} processado!\n` +
        `Total: R$ ${total.toFixed(2)}\n` +
        `Nome: ${nomeCompleto}\n` +
        `CPF: ${cpf}\n` +
        `Telefone: ${telefone}\n` +
        `Email: ${email}\n` +
        `Endereço: ${endereco}, ${numero}, ${bairro}, ${cidade} - ${estado}\n` +
        `CEP: ${cep}\n` +
        `Complemento: ${complemento}`
    );
    onClose();
  };

  const nextTab = () => {
    if (activeTab === 'dados') setActiveTab('endereco');
    else if (activeTab === 'endereco') setActiveTab('pagamento');
  };

  const prevTab = () => {
    if (activeTab === 'pagamento') setActiveTab('endereco');
    else if (activeTab === 'endereco') setActiveTab('dados');
  };

  const progressPercent = {
    dados: 33,
    endereco: 66,
    pagamento: 100,
  }[activeTab];

  return {
    activeTab,
    setActiveTab,
    paymentMethod,
    setPaymentMethod,
    cardNumber,
    setCardNumber,
    cardName,
    setCardName,
    cardExpiry,
    setCardExpiry,
    cardCvv,
    setCardCvv,
    nomeCompleto,
    setNomeCompleto,
    cpf,
    setCpf,
    telefone,
    setTelefone,
    email,
    setEmail,
    cep,
    setCep,
    endereco,
    setEndereco,
    numero,
    setNumero,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    cidade,
    setCidade,
    estado,
    setEstado,
    cepErro,
    buscandoCep,
    mascaraCpf,
    mascaraTelefone,
    mascaraCep,
    mascaraCartao,
    mascaraValidade,
    handleSubmit,
    nextTab,
    prevTab,
    progressPercent,
  };
}
