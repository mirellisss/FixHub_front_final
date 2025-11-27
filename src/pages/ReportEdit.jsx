import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function ReportEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    andar: '',
    descricaoLocalizacao: '',
    localizacao: '',
    descricaoTicketUsuario: '',
    imagem: ''
  })
  const [loading, setLoading] = useState(false)

  // 🔥 Função para corrigir o link do Firebase
  function convertFirebaseUrl(url) {
    if (!url) return ""

    // Se já está no formato oficial, retorna como está
    if (url.includes("firebasestorage.googleapis.com")) return url

    const baseIncorrect = "https://storage.googleapis.com/fixhub-dc44c.firebasestorage.app/"

    // Se URL vier no formato errado
    if (url.startsWith(baseIncorrect)) {
      const filePath = url.replace(baseIncorrect, "") // ex: tickets/abc.jpeg
      const encodedPath = encodeURIComponent(filePath) // tickets%2Fabc.jpeg
      return `https://firebasestorage.googleapis.com/v0/b/fixhub-dc44c.firebasestorage.app/o/${encodedPath}?alt=media`
    }

    return url
  }

  useEffect(() => {
    const fetchTicket = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        Swal.fire('Erro', 'Usuário não autenticado.', 'error')
        return
      }
      setLoading(true)
      try {
        const res = await fetch(
          `https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/detalhes/${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        )

        const text = await res.text()
        let data = null
        try {
          data = text ? JSON.parse(text) : null
        } catch (err) {
          console.error('Erro ao parsear ticket:', err, 'raw:', text)
          throw err
        }

        if (!res.ok) {
          console.error('Erro ao buscar ticket:', res.status, data)
          throw new Error(`Erro: ${res.status}`)
        }

        // 🔥 Corrigindo link de imagem aqui
        const img = convertFirebaseUrl(data.imagem || data.imagemBase64 || '')

        setForm({
          andar: data.andar || data.floor || '',
          descricaoLocalizacao:
            data.descricaoLocalizacao || data.area || data.tipo || '',
          localizacao: data.localizacao || data.local || '',
          descricaoTicketUsuario:
            data.descricaoTicketUsuario ||
            data.descricao ||
            data.description ||
            '',
          imagem: img
        })
      } catch (error) {
        console.error('Erro ao carregar ticket:', error)
        Swal.fire('Erro', 'Não foi possível carregar os dados do ticket.', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchTicket()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () =>
        setForm((prev) => ({ ...prev, imagem: reader.result }))
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    if (!token) {
      Swal.fire('Erro', 'Usuário não autenticado.', 'error')
      return
    }

    try {
      const payload = {
        andar: form.andar,
        descricaoLocalizacao: form.descricaoLocalizacao,
        localizacao: form.localizacao,
        descricaoTicketUsuario: form.descricaoTicketUsuario,
        imagem: form.imagem
      }

      const res = await fetch(
        `https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      const text = await res.text()
      let resp = null
      try {
        resp = text ? JSON.parse(text) : null
      } catch {
        resp = text
      }

      if (!res.ok) {
        console.error('Erro ao editar ticket:', res.status, resp)
        throw new Error(`Erro ao editar: ${res.status}`)
      }

      Swal.fire('Sucesso', 'Ticket atualizado com sucesso.', 'success')
      navigate(`/reports/${id}`)
    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
      Swal.fire('Erro', 'Não foi possível salvar as alterações.', 'error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6 transition-all duration-300">
      <h2 className="text-2xl font-bold text-sky-700 border-b pb-3">
        Editar Ticket #{id}
      </h2>

      {loading ? (
        <div className="py-6 text-center text-sm text-gray-500">Carregando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Andar</label>
            <input
              type="text"
              name="andar"
              value={form.andar}
              onChange={handleChange}
              placeholder="Ex: 1º Andar"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-700 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Área</label>
            <input
              type="text"
              name="descricaoLocalizacao"
              value={form.descricaoLocalizacao}
              onChange={handleChange}
              placeholder="Ex: Interna / Externa"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Local</label>
            <input
              type="text"
              name="localizacao"
              value={form.localizacao}
              onChange={handleChange}
              placeholder="Ex: Banheiro, Lanchonete..."
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Descrição</label>
            <textarea
              name="descricaoTicketUsuario"
              value={form.descricaoTicketUsuario}
              onChange={handleChange}
              maxLength={200}
              rows={4}
              placeholder="Descreva o problema ou sugestão..."
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <p className="text-sm text-gray-400 text-right">
              {form.descricaoTicketUsuario.length}/200 caracteres
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full cursor-pointer text-sm"
            />
            {form.imagem && (
              <div className="mt-4 flex justify-center">
                <img
                  src={convertFirebaseUrl(form.imagem)}
                  alt="Pré-visualização"
                  className="rounded-xl shadow-md max-h-60 object-cover border transition hover:scale-105"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate(`/reports/${id}`)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-600 transition shadow-md"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
