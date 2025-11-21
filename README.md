# FixHub FRONT

Frontend do sistema **FixHub**, uma aplicação React para abertura e acompanhamento de chamados de manutenção na rodoviária.

## 🧱 Stack

- [Vite](https://vitejs.dev/) + React 18
- React Router DOM 6
- Tailwind CSS
- SweetAlert2 para feedbacks
- Lucide / React Icons para ícones

## 📂 Estrutura

```bash
src/
  components/      # Componentes reutilizáveis (layout, navbar, footer, etc.)
  pages/           # Páginas da aplicação (Login, Home, Reports, Settings, etc.)
  index.css        # Estilos globais + utilitários com @apply
  App.jsx          # Definição das rotas
  main.jsx         # Ponto de entrada (ReactDOM + BrowserRouter)
```

## 🚀 Scripts

```bash
npm install        # Instala as dependências
npm run dev        # Ambiente de desenvolvimento
npm run build      # Build para produção
npm run preview    # Servir build localmente
npm run lint       # Rodar ESLint (se instalado)
```

## 🌐 Rotas principais

- `/login` – Tela de login
- `/register` – Cadastro
- `/home` – Dashboard / tela inicial
- `/reports` – Lista de chamados
- `/reports/create` – Abertura de chamado
- `/reports/:id` – Detalhe do chamado
- `/reports/edit/:id` – Edição do chamado
- `/settings` – Configurações
- `/settings/account` – Dados do usuário
- `/settings/security` – Segurança / senha
- `/faq` – Dúvidas frequentes
- `/terminal-map` – Mapa / guia da rodoviária
- `/forgot-password` – Recuperação de senha

## 🧩 Melhorias aplicadas

- Layout com controle centralizado de exibição de **navbar / menu lateral / footer**.
- Tela de **recuperação de senha** agora usa o layout "limpo" (sem navbar/menu/footer), igual login e registro.
- Documentação básica adicionada para facilitar entendimento e manutenção futura.
