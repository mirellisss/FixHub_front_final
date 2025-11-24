import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Ticket,
  Loader2,
  XCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [userName, setUserName] = useState("Usuário");
  const [totals, setTotals] = useState({
    total: 0,
    pendente: 0,
    andamento: 0,
    concluido: 0,
    reprovado: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");

    const token = localStorage.getItem("authToken");
    if (!token) return;

    fetch(
      "https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/listar-meus-tickets",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        setTotals({
          total: data.length,
          pendente: data.filter((t) => t.status === "PENDENTE").length,
          andamento: data.filter((t) => t.status === "EM_ANDAMENTO").length,
          concluido: data.filter((t) => t.status === "CONCLUIDO").length,
          reprovado: data.filter((t) => t.status === "REPROVADO").length,
        });
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Boas-vindas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)]/15 flex items-center justify-center">
            <span className="text-[var(--primary)] font-semibold text-lg">{userName[0]}</span>
          </div>

          <div>
            <p className="text-sm text-slate-500">Bem-vindo(a) de volta,</p>
            <p className="font-semibold text-lg text-slate-900">{userName}</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatsCard title="Total" value={totals.total} icon={<Ticket size={18} />} color="bg-slate-100" />
          <StatsCard title="Pendentes" value={totals.pendente} icon={<AlertCircle size={18} />} color="bg-yellow-100" />
          <StatsCard title="Em andamento" value={totals.andamento} icon={<Loader2 size={18} />} color="bg-blue-100" />
          <StatsCard title="Concluídos" value={totals.concluido} icon={<CheckCircle size={18} />} color="bg-green-100" />
          <StatsCard title="Reprovados" value={totals.reprovado} icon={<XCircle size={18} />} color="bg-red-100" />
        </div>

        {/* Abrir Ticket */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Abra um Ticket</h2>

          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Relate um problema rapidamente.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <Link className="px-5 py-2 rounded-md bg-[var(--primary)] text-white shadow-sm hover:bg-[var(--primary-dark)] transition" to="/reports/create">
              Criar
            </Link>
            <Link className="px-5 py-2 rounded-md bg-yellow-400 text-slate-800 shadow-sm hover:bg-yellow-500 transition" to="/reports">
              Seus Tickets
            </Link>
          </div>
        </div>

        {/* GUIA — versão bonita */}
<div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center space-y-7">

  <div className="space-y-2">
    <h2 className="text-xl font-semibold text-slate-900 flex items-center justify-center gap-2">
      <MapPin className="w-6 h-6 text-[var(--primary)]" />
      Guia da Rodoviária
    </h2>

    <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto">
      Encontre informações organizadas sobre setores, plataformas e serviços 
      disponíveis dentro da rodoviária.
    </p>
  </div>

  <div className="pt-2">
    <Link
      to="/terminal-map"
      className="inline-block px-7 py-3 rounded-lg bg-[var(--primary)] text-white font-medium shadow-sm hover:bg-[var(--primary-dark)] hover:shadow transition"
    >
      Acessar Guia
    </Link>
  </div>

</div>


      </div>
    </div>
  );
}

/* Card de estatística */
function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`${color} rounded-xl border border-slate-200 p-4 shadow-sm`}>
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-medium text-slate-600">{title}</p>
        <div className="text-slate-600">{icon}</div>
      </div>

      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
