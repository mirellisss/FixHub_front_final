import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ============================================================
   DADOS DO TERMINAL (MANTIDOS IGUAIS AOS SEUS)
   ============================================================ */

const sectorsData = {
  mezanino: [
    {
      id: "alimentacao",
      name: "Praça de Alimentação",
      detail: `
Local com diversas opções de lanchonetes e restaurantes:
- McDonald's
- Subway
- Lanchonete X
- Restaurante Y
      `,
    },
    {
      id: "sanitarios",
      name: "Sanitários / Banhos",
      detail: `
O Terminal possui 8 pontos de sanitários:
- 4 comuns (2 no mezanino e 2 nas plataformas)
- 4 adaptados (2 no mezanino e 2 nas plataformas)

Banhos disponíveis no mezanino.
Preço: R$ 15,50 (banhos quentes)
      `,
    },
    {
      id: "informacoes",
      name: "Serviços / Balcão de Informações",
      detail: `
Localizado no saguão do mezanino, com funcionamento 24h.
Informações: (19) 3731-2930

Serviços:
- Balcão de Informações
- Banca de Jornais
- Loja de Presentes
      `,
    },
  ],

  terreo: [
    {
      id: "bilheterias",
      name: "Bilheterias",
      detail: `
Guichês de venda de passagens:
- Viação Cometa
- Expresso 1001
- Catarinense
- Expresso do Sul
... entre outras
      `,
    },
    {
      id: "caixa-estacionamento",
      name: "Caixa Automático / Estacionamento",
      detail: `
Caixa 24h disponível.
Estacionamento com 307 vagas.

PREÇOS:
- 30 min: R$ 6,90
- 1h: R$ 12,45
- 2h: R$ 17,74
- 3h: R$ 23,03
- 4h: R$ 28,32
- 5h: R$ 33,61
- 6h: R$ 38,90
- Diária: R$ 43,79

Pagamento: Dinheiro, Débito, PIX, Conectar Car, Veloe, Sem Parar.
      `,
    },
    {
      id: "acessibilidade",
      name: "Acessibilidade",
      detail: `
O terminal possui:
- Cadeiras de rodas
- Sanitários adaptados
- Escadas rolantes
- Elevadores
- Piso tátil
- Telefones adaptados
- Vagas PCD/Idosos
      `,
    },
    {
      id: "guarda-volumes",
      name: "Guarda-volumes",
      detail: `
Localizado próximo ao balcão de informações.
Preço: R$ 9,30 (8 horas).
Funcionamento 24h.
      `,
    },
  ],

  plataformas: [
    {
      id: "embarque",
      name: "Plataformas de Embarque",
      detail: `
Área de embarque com sanitários comuns e adaptados.
Sinalização tátil disponível.
      `,
    },
    {
      id: "desembarque",
      name: "Desembarque / Táxi",
      detail: `
Área de desembarque e ponto de táxi com sanitários e acessibilidade.
      `,
    },
    {
      id: "administracao",
      name: "Outros",
      detail: `
Administração e Achados e Perdidos:
- Seg a Sex: 8h–12h / 13h–17h
- Telefone: (19) 3731-2930

Órgãos Fiscalizadores:
- ANTT: 0800-610300
- ARTESP: 0800-7278377
- EMDEC: (19) 3772-4067
- União Express: 0800-779-4990
      `,
    },
  ],
};

/* ============================================================
   COMPONENTE PRINCIPAL — ESTILO FIXHUB MODERNO
   ============================================================ */

export default function TerminalMap() {
  const [openId, setOpenId] = useState(null);
  const navigate = useNavigate();

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const renderFloor = (nome, setores) => (
    <section className="tm-floor">
      <h2 className="tm-floor-title">{nome}</h2>

      <div className="tm-floor-box">
        {setores.map((sec) => (
          <div className="tm-item" key={sec.id}>
            <button className="tm-question" onClick={() => toggle(sec.id)}>
              <span>{sec.name}</span>
              <span className="tm-icon">{openId === sec.id ? "−" : "+"}</span>
            </button>

            {openId === sec.id && (
              <div className="tm-answer">
                <pre>{sec.detail}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="tm-container">

      {/* Botão voltar */}
      <button className="tm-back-btn" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      {/* Título */}
      <h1 className="tm-title">
        Terminal Rodoviário de Campinas
        <span className="tm-subtitle">(Dr. Ramos de Azevedo)</span>
      </h1>

      {/* Painel introdutório */}
      <div className="tm-info-card">
        <h3>Mapa Esquemático</h3>
        <p>Clique em um setor para visualizar os detalhes.</p>
      </div>

      {/* Pisos */}
      {renderFloor("1. Mezanino – Alimentação e Informações", sectorsData.mezanino)}
      {renderFloor("2. Térreo – Bilheterias e Serviços", sectorsData.terreo)}
      {renderFloor("3. Plataformas – Embarque e Fiscalização", sectorsData.plataformas)}

      {/* ESTILOS */}
      <style>{`
        .tm-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: Inter, sans-serif;
          background: #f8fbff;
        }

        .tm-back-btn {
          background: #2563eb;
          color: white;
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 12px;
          transition: 0.2s;
        }

        .tm-back-btn:hover {
          background: #1e4ed8;
        }

        .tm-title {
          text-align: center;
          font-size: 22px;
          color: #1e3a8a;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .tm-subtitle {
          display: block;
          font-size: 14px;
          color: #475569;
        }

        .tm-info-card {
          background: white;
          border-radius: 14px;
          padding: 14px;
          text-align: center;
          margin: 16px 0;
          box-shadow: 0 4px 14px rgba(0,0,0,0.06);
          border: 1px solid #e2e8f0;
        }

        .tm-info-card h3 {
          margin-bottom: 2px;
          color: #2563eb;
          font-weight: 600;
        }

        .tm-floor {
          margin-top: 20px;
        }

        .tm-floor-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #1e3a8a;
          border-left: 4px solid #2563eb;
          padding-left: 8px;
        }

        .tm-floor-box {
          background: white;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .tm-item {
          border-top: 1px solid #e5e7eb;
          padding: 10px 0;
        }

        .tm-item:first-child {
          border-top: none;
        }

        .tm-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 4px 0;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          color: #1e293b;
        }

        .tm-question:hover {
          color: #2563eb;
        }

        .tm-icon {
          font-size: 20px;
          color: #2563eb;
          font-weight: 700;
        }

        .tm-answer {
          margin-top: 10px;
          background: #f1f5f9;
          padding: 12px;
          border-radius: 8px;
        }

        .tm-answer pre {
          white-space: pre-wrap;
          font-size: 14px;
          color: #334155;
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
