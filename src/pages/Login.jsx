import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormCard from '../components/FormCard'
import Swal from 'sweetalert2'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !senha) {
      Swal.fire('Erro', 'Preencha todos os campos!', 'error')
      return
    }

    try {
      // Prepara os dados no formato x-www-form-urlencoded
      const formData = new URLSearchParams()
      formData.append('email', email)
      formData.append('senha', senha)

      const response = await fetch('https://projeto-integrador-fixhub.onrender.com/api/fixhub/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`)
      }

      const data = await response.json()

      // Salva o token no localStorage
      localStorage.setItem('authToken', data.token)

      Swal.fire('Sucesso', 'Login realizado com sucesso!', 'success')
        .then(() => {
          navigate('/home') // redireciona para a pÃ¡gina protegida
        })

    } catch (error) {
      console.error('Erro no login:', error)
      Swal.fire('Erro', 'Falha ao fazer login. Verifique suas credenciais.', 'error')
    }
  }

  return (
    <div className="py-6">
      <FormCard title="Tela Login">
        <div className="text-center">
          <img src="logo_fixhub.png" className="mx-auto w-24" alt="logo" />
        </div>

        <form onSubmit={handleLogin} className="space-y-2">
          <div>
            <label className="label">E-mail</label>
            <input
              className="input"
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Senha</label>
            <input
              className="input"
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-sm text-[var(--primary)]">
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <Link to="/register" className="text-sm text-slate-600">Cadastrar-se</Link>
            <button type="submit" className="btn-primary">Login</button>
          </div>
        </form>
      </FormCard>
    </div>
  )
}