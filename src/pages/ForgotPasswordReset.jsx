import React, { useState } from "react";
import FormCard from "../components/FormCard";
import Swal from "sweetalert2";

export default function ForgotPasswordReset() {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (!senha || !confirmar) {
      Swal.fire("Erro", "Preencha todos os campos.", "error");
      return;
    }

    if (senha !== confirmar) {
      Swal.fire("Erro", "As senhas não coincidem.", "error");
      return;
    }

    Swal.fire("Sucesso!", "Sua senha foi redefinida.", "success");

    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  };

  return (
    <div className="py-6">
      <FormCard title="Redefinir Senha">
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="label">Nova senha</label>
            <input
              type="password"
              className="input"
              placeholder="Digite sua nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Confirmar nova senha</label>
            <input
              type="password"
              className="input"
              placeholder="Confirme a nova senha"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
            />
          </div>

          <button className="btn-primary w-full">Salvar nova senha</button>
        </form>
      </FormCard>
    </div>
  );
}
