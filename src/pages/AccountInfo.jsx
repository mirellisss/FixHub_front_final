import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function AccountInfo() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    avatar: '/user_maria.png'
  })

  const [preview, setPreview] = useState('/user_maria.png')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) {
          Swal.fire('Erro', 'Usuário não autenticado. Faça login novamente.', 'error')
          return
        }

        const response = await fetch('https://projeto-integrador-fixhub.onrender.com/api/fixhub/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) throw new Error('Erro ao buscar usuário')

        const data = await response.json()

        setForm({
          nome: data.pessoa?.nome || '',
          email: data.email || '',
          telefone: data.pessoa?.telefone || '',
          avatar: '/user_maria.png'
        })
      } catch (error) {
        setMensagem('❌ Não foi possível carregar os dados.')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      setForm(prev => ({ ...prev, avatar: file }))
    }
  }

  const handleSave = async () => {
    setMensagem('')
    try {
      const token = localStorage.getItem('authToken')

      const response = await fetch('https://projeto-integrador-fixhub.onrender.com/api/fixhub/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          telefone: form.telefone
        })
      })

      if (!response.ok) throw new Error()

      Swal.fire('Sucesso!', 'Informações atualizadas com sucesso!', 'success')
      setIsEditing(false)

    } catch (error) {
      Swal.fire('Erro', 'Não foi possível salvar as alterações.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-slate-500 animate-pulse">
        Carregando...
      </div>
    )
  }

  return (
    <div className="py-10 px-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6 px-6 text-center">
          <h2 className="text-xl font-semibold">Minha Conta</h2>
          <p className="text-blue-100 text-sm mt-1">Gerencie suas informações pessoais</p>
        </div>

        <div className="p-8">

          {/* ALERTA */}
          {mensagem && (
            <div className={`p-3 rounded-lg text-center mb-6 text-sm font-medium
              ${mensagem.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {mensagem}
            </div>
          )}

          {/* VISUALIZAÇÃO */}
          {!isEditing ? (
            <div className="flex flex-col items-center gap-4">

              <img
                src={preview}
                className="w-28 h-28 rounded-full shadow-lg border-4 border-blue-100 object-cover object-center"
                alt="Avatar"
              />

              <div className="text-center mt-2">
                <div className="text-xl font-bold text-gray-900">{form.nome}</div>
                <div className="text-gray-600">{form.email}</div>
                <div className="text-gray-600">{form.telefone}</div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                Editar Informações
              </button>
            </div>
          ) : (
            <>
              {/* EDIÇÃO */}
              <div className="flex flex-col items-center mb-4">
                <label className="cursor-pointer group flex flex-col items-center">
                  <img
                    src={preview}
                    className="w-28 h-28 rounded-full border-4 border-blue-200 shadow-md object-cover object-center group-hover:opacity-80 transition"
                    alt="avatar"
                  />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  <span className="mt-1 text-sm text-blue-600 group-hover:underline">Alterar foto</span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">E-mail</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 text-sm"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold shadow-md"
                >
                  Salvar
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
