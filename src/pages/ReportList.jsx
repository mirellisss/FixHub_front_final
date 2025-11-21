import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { CheckCircle, AlertCircle, Edit2, Trash2, Loader2, XCircle } from 'lucide-react'
import { normalizeStatus } from "../utils/normalize";

export default function ReportList() {
  const [tickets, setTickets] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        Swal.fire('Erro', 'Usuário não autenticado. Faça login novamente.', 'error')
        return
      }

      try {
        const response = await fetch(
          'https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/listar-meus-tickets',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        )

        const raw = await response.text()
        let data = null
        try {
          data = raw ? JSON.parse(raw) : []
        } catch (parseErr) {
          console.error('Resposta não é JSON válido:', parseErr, 'raw:', raw)
          throw parseErr
        }

        if (!response.ok) {
          console.error('Erro na resposta:', response.status, data)
          throw new Error(`Erro: ${response.status}`)
        }

        const normalized = Array.isArray(data)
          ? data.map((item) => ({ ...item, id: item.id || item._id }))
          : []

        setTickets(normalized)
      } catch (error) {
        console.error('Erro ao buscar tickets:', error)
        Swal.fire('Erro', 'Não foi possível carregar os tickets.', 'error')
      }
    }

    fetchTickets()
  }, [])

  // Usar APENAS normalizeStatus
  const filteredTickets = tickets.filter((t) => {
    const ticketStatus = normalizeStatus(t.status || "PENDENTE")
    const filterStatus = normalizeStatus(statusFilter)

    if (filterStatus !== "ALL" && ticketStatus !== filterStatus) return false

    if (query.trim()) {
      const haystack = `${t.localizacao || ''} ${t.descricaoTicketUsuario || ''}`.toLowerCase()
      if (!haystack.includes(query.toLowerCase())) return false
    }

    return true
  })

  const deleteTicket = async (id) => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      Swal.fire('Erro', 'Usuário não autenticado. Faça login novamente.', 'error')
      return
    }

    const result = await Swal.fire({
      title: 'Confirma exclusão?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    try {
      const res = await fetch(
        `https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      if (!res.ok) throw new Error(`Erro ao deletar: ${res.status}`)

      setTickets((prev) => prev.filter((t) => (t.id || t._id) !== id))
      Swal.fire('Removido', 'Ticket excluído com sucesso.', 'success')
    } catch (error) {
      console.error('Erro ao excluir ticket:', error)
      Swal.fire('Erro', 'Não foi possível excluir o ticket.', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-5 shadow-md border rounded-lg bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Seus Tickets</h3>
            <div className="text-sm text-slate-500 mt-1">
              {tickets.length} total • {filteredTickets.length} exibidos
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
              <option value="reprovado">Reprovado</option>
            </select>

            <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-sm flex-1 min-w-0">
              <svg
                className="w-4 h-4 text-slate-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar por local ou descrição..."
                className="w-full border-0 focus:ring-0 outline-none text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setStatusFilter('all')
                setQuery('')
              }}
              className="px-3 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200 shadow-sm"
            >
              Limpar
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {tickets.length === 0 ? (
            <div className="text-sm text-slate-500 italic text-center py-6">
              Nenhum ticket criado ainda.
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-sm text-slate-500 italic text-center py-6">
              Nenhum ticket encontrado para os filtros.
            </div>
          ) : (
            filteredTickets.map((t) => {
              const ticketId = t.id || t._id

              // Agora status é 100% correto
              const statusNorm = normalizeStatus(t.status || "PENDENTE")

              let statusText, StatusIcon, statusBadgeClass
              if (statusNorm === "CONCLUIDO") {
                statusText = 'Concluído'
                StatusIcon = CheckCircle
                statusBadgeClass = 'bg-green-100 text-green-800'
              } else if (statusNorm === "EM_ANDAMENTO") {
                statusText = 'Em andamento'
                StatusIcon = Loader2
                statusBadgeClass = 'bg-blue-100 text-blue-800'
              } else if (statusNorm === "REPROVADO") {
                statusText = 'Reprovado'
                StatusIcon = XCircle
                statusBadgeClass = 'bg-red-100 text-red-800'
              } else {
                statusText = 'Pendente'
                StatusIcon = AlertCircle
                statusBadgeClass = 'bg-yellow-100 text-yellow-800'
              }

              return (
                <div
                  key={ticketId}
                  className="block p-4 border rounded-lg hover:shadow-sm transition bg-white"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <Link to={`/reports/${ticketId}`} className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {t.localizacao || 'Local não informado'}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {t.descricaoTicketUsuario || 'Sem descrição'}
                      </div>
                    </Link>

                    <div className="flex items-center gap-3">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClass}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        <span>{statusText}</span>
                      </div>

                      {/* Botões só aparecem se status for PENDENTE */}
                      {statusNorm === "PENDENTE" && (
                        <>
                          <Link
                            to={`/reports/edit/${ticketId}`}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => deleteTicket(ticketId)}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <Link
            to="/reports/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow"
          >
            Criar Ticket
          </Link>
        </div>
      </div>
    </div>
  )
}
