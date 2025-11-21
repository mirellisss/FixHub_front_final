import React, { useState, useMemo } from "react";

// Lista de perguntas
const DEFAULT_FAQS = [
  {
    id: 1,
    question: "Como faço para criar um ticket pelo FixHub?",
    answer:
      "Crie uma conta, na tela inicial você encontrará a opção de criar um novo ticket. Preencha os detalhes do serviço que você precisa e envie sua solicitação.",
  },
  {
    id: 2,
    question: "Como vizualizar meus tickets realizados?",
    answer:
      "Na sua conta, acesse a seção 'Seus Tickets' para ver uma lista completa dos tickets que você criou.",
  },
  {
    id: 3,
    question: "Posso acompanhar o andamento do meu ticket?",
    answer:
      "Sim! Acompanhe o status do seu ticket na mesma seção 'Seus Tickets'.",
  },
  {
    id: 4,
    question: "Onde posso conferir sobre a privacidade dos meus dados?",
    answer:
      "Acesse nossa política de privacidade no menu lateral em 'Política de Privacidade'.",
  },
  {
    id: 5,
    question: "Posso cancelar um ticket depois de enviá-lo?",
    answer:
      "Sim, desde que o status esteja 'Pendente'. Acesse 'Seus Tickets' e clique no ícone de lixeira.",
  },
  {
    id: 6,
    question: "Como posso editar minhas informações pessoais?",
    answer:
      "Clique em 'Informações da Conta' no menu lateral e edite seus dados como nome, e-mail ou telefone.",
  },
  {
    id: 7,
    question: "Passagens podem ser compradas pelo FixHub?",
    answer:
      "Não diretamente, mas recomendamos links confiáveis na seção 'Passagens'.",
  },
  {
    id: 8,
    question: "Esqueci minha senha. O que devo fazer?",
    answer:
      "Clique em 'Esqueci minha senha' na tela de login e siga o passo a passo.",
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [mostrarContato, setMostrarContato] = useState(false);

  // Filtra as perguntas com base na busca
  const filtered = useMemo(() => {
    return DEFAULT_FAQS.filter((f) => {
      const searchLower = search.toLowerCase();
      return (
        f.question.toLowerCase().includes(searchLower) ||
        f.answer.toLowerCase().includes(searchLower)
      );
    });
  }, [search]);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="faq-container">
      <header className="faq-header">
        <h1>Perguntas Frequentes</h1>
        <p>Encontre respostas rápidas sobre o FixHub.</p>
      </header>

      {/* Barra de pesquisa */}
      <div className="faq-search-container">
        <input
          type="text"
          placeholder="Pesquisar pergunta..."
          className="faq-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista */}
      <div className="faq-list">
        {filtered.length === 0 ? (
          <div className="faq-empty">Nenhuma pergunta encontrada.</div>
        ) : (
          filtered.map((faq) => (
            <div className="faq-card" key={faq.id}>
              <button className="faq-question" onClick={() => toggle(faq.id)}>
                <span>{faq.question}</span>
                <span className="faq-icon">{openId === faq.id ? "−" : "+"}</span>
              </button>

              {openId === faq.id && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contato */}
      <div className="faq-footer">
        <p>
          Ainda precisa de ajuda?{" "}
          <button
            className="faq-link"
            onClick={() => setMostrarContato(!mostrarContato)}
          >
            Fale com o suporte
          </button>
        </p>

        {mostrarContato && (
          <div className="faq-contact-box">
            <p>
              📧 <strong>Email:</strong>{" "}
              <a href="mailto:suporte@empresa.com">suporte@empresa.com</a>
            </p>
            <p>
              📞 <strong>Telefone:</strong>{" "}
              <a href="tel:+5511999999999">(11) 99999-9999</a>
            </p>
          </div>
        )}
      </div>

<style>{`
  .faq-container {
    max-width: 820px;
    margin: 28px auto;
    padding: 0 16px;
    font-family: Inter, system-ui, sans-serif;
  }

  .faq-header h1 {
    font-size: 24px;
    margin-bottom: 4px;
    font-weight: 700;
    color: #1e3a8a;
  }

  .faq-header p {
    font-size: 14px;
    color: #4b5563;
    margin-bottom: 20px;
  }

  /* Barra de pesquisa */
  .faq-search-container {
    margin-bottom: 20px;
  }

  .faq-search {
    width: 100%;
    padding: 9px 14px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    font-size: 14px;
    transition: 0.2s;
  }

  .faq-search:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.22);
    outline: none;
  }

  /* Cards */
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .faq-card {
    background: #ffffff;
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0px 3px 9px rgba(0,0,0,0.05);
    transition: 0.2s;
  }

  .faq-card:hover {
    box-shadow: 0px 4px 12px rgba(0,0,0,0.07);
  }

  .faq-question {
    width: 100%;
    background: none;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    color: #1f2937;
  }

  .faq-icon {
    font-size: 20px;
    font-weight: 700;
    color: #2563eb;
  }

  .faq-answer {
    margin-top: 8px;
    font-size: 14px;
    line-height: 1.45;
    color: #4b5563;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-3px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .faq-empty {
    text-align: center;
    color: #6b7280;
    padding: 22px;
    font-size: 14px;
  }

  /* Contato */
  .faq-footer {
    margin-top: 24px;
    text-align: center;
    color: #4b5563;
    font-size: 14px;
  }

  .faq-link {
    color: #2563eb;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
  }

  .faq-contact-box {
    background: #f3f4f6;
    padding: 10px 16px;
    border-radius: 12px;
    margin-top: 10px;
    display: inline-block;
    animation: fadeIn 0.25s ease;
  }

  .faq-contact-box a {
    color: #2563eb;
    text-decoration: none;
  }
`}</style>

    </main>
  );
}
