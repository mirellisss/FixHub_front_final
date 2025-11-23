import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormCard from '../components/FormCard';
import Swal from 'sweetalert2';

const NAME_REGEX = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/;
const PHONE_REGEX = /^\d*$/;

// Converte "2005-11-16" -> "16/11/2005"
function formatarDataParaBR(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // -------- VALIDAÇÕES --------
    if (!nome || !dataNascimento || !email || !telefone || !senha || !confirmarSenha) {
      Swal.fire('Erro', 'Preencha todos os campos obrigatórios!', 'error');
      return;
    }

    if (!NAME_REGEX.test(nome.trim())) {
      Swal.fire('Erro', 'O nome deve conter apenas letras e espaços.', 'error');
      return;
    }

    const numeroLimpo = telefone.replace(/\D/g, '');
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      Swal.fire('Erro', 'O telefone deve ter 10 ou 11 dígitos.', 'error');
      return;
    }

    if (senha.length < 6) {
      Swal.fire('Erro', 'A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    if (senha !== confirmarSenha) {
      Swal.fire('Erro', 'As senhas não coincidem!', 'error');
      return;
    }

    try {
      // ------- JSON QUE A API EXIGE -------
      const payload = {
        nome: nome.trim(),
        dataNascimento: formatarDataParaBR(dataNascimento),
        telefone: numeroLimpo,
        email: email.trim(),
        senha: senha
      };

      const response = await fetch(
        'https://projeto-integrador-fixhub.onrender.com/api/fixhub/register',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        Swal.fire('Erro', data?.message || 'Falha ao cadastrar usuário.', 'error');
        return;
      }

      Swal.fire('Sucesso!', data?.message || 'Usuário cadastrado com sucesso!', 'success')
        .then(() => navigate('/'));

    } catch (error) {
      console.error('Erro no cadastro:', error);
      Swal.fire('Erro', 'Falha ao conectar ao servidor.', 'error');
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-8 border border-slate-200">

        {/* logo */}
        <div className="text-center mb-4">
          <img src="/logo_fixhub.png" className="mx-auto w-20" alt="logo" />
          <h1 className="text-2xl font-semibold mt-2 text-slate-700">
            Criar Conta
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-slate-700">Nome completo</label>
            <input
              className="input bg-white border border-slate-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Data de nascimento</label>
            <input
              className="input bg-white border border-slate-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <input
              className="input bg-white border border-slate-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400"
              type="email"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Telefone</label>
            <input
              className="input bg-white border border-slate-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400"
              placeholder="11999999999"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              maxLength={11}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Senha</label>
              <input
                className="input bg-white border border-slate-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400"
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Confirmar senha</label>
              <input
                className="input bg-white border border-slate-300 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-400"
                type="password"
                placeholder="Confirmar"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              className="text-sm text-slate-600 hover:underline"
              onClick={() => navigate(-1)}
            >
              Voltar
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              Cadastrar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
