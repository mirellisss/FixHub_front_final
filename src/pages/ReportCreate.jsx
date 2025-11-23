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

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  // Buscar ticket
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) return Swal.fire("Erro", "Usuário não autenticado", "error")

      setLoading(true)

      try {
        const res = await fetch(
          `https://projeto-integrador-fixhub.onrender.com/api/fixhub/tickets/detalhes/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        )

        const text = await res.text()
        let data = null
        try {
          data = text ? JSON.parse(text) : null
        } catch {
          console.error("Erro ao parsear JSON:", text)
          throw new Error()
        }

        if (!res.ok) throw new Error()

        setForm({
          andar: data.andar || "",
          descricaoLocalizacao: data.descricaoLocalizacao || "",
          localizacao: data.localizacao || "",
          descricaoTicketUsuario: data.descricaoTicketUsuario || "",
          imagem: data.imagem || "",
        })

        setPreview(data.imagem || null)

      } catch {
        Swal.fire("Erro", "Não foi possível carregar esse ticket.", "error")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  // Atualização dos inputs
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Upload IGUAL ao ReportCreate
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imagem: reader.result }))
        setPreview(URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("authToken")
    if (!token) return Swal.fire("Erro", "Usuário não autenticado", "error")

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
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) throw new Error()

      Swal.fire("Sucesso!", "Ticket atualizado com sucesso!", "success")
      navigate(`/reports/${id}`)

    } catch {
      Swal.fire("Erro", "Não foi possível editar o ticket.", "error")
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-sky-700 border-b pb-3">
        Editar Ticket #{id}
      </h2>

      {loading ? (
        <div className="py-6 text-center text-gray-500">Carregando...</div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* ANDAR */}
          <div>
            <label className="font-medium">Andar</label>
            <input
              type="text"
              name="andar"
              value={form.andar}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* ÁREA */}
          <div>
            <label className="font-medium">Área</label>
            <input
              type="text"
              name="descricaoLocalizacao"
              value={form.descricaoLocalizacao}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* LOCAL */}
          <div>
            <label className="font-medium">Local</label>
            <input
              type="text"
              name="localizacao"
              value={form.localizacao}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="font-medium">Descrição *</label>
            <textarea
              name="descricaoTicketUsuario"
              value={form.descricaoTicketUsuario}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* UPLOAD IGUAL AO ReportCreate */}
          <div>
            <label className="font-medium text-sm">Adicionar Imagem (opcional)</label>

            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-600 
                         file:py-2 file:px-4 file:border-0 file:rounded-lg 
                         file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              onChange={handleImageChange}
            />

            {preview && (
              <div className="mt-3">
                <p className="text-sm font-medium">Pré-visualização:</p>
                <img
                  src={preview}
                  className="max-h-48 rounded-xl shadow-lg border object-cover mt-1"
                  alt="preview"
                />
              </div>
            )}
          </div>

          {/* BOTÕES */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate(`/reports/${id}`)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700"
            >
              Salvar Alterações
            </button>
          </div>

        </form>
      )}
    </div>
  )
}
