# website-panel

Um painel moderno desenvolvido em React + TypeScript + Vite para criação e gerenciamento de websites de forma simples e intuitiva.

## Descrição

O website-panel é uma aplicação web que permite aos usuários criar, personalizar e gerenciar websites através de uma interface amigável. O painel oferece componentes reutilizáveis, visualização em tempo real, gerenciamento de páginas, autenticação e configurações personalizadas.

## Funcionalidades

- **Criação e edição de páginas**: Adicione, edite e remova páginas do seu website.
- **Componentes customizáveis**: Utilize e configure componentes como listas, formulários, carrosséis, menus, alertas, botões, ícones, inputs, links e textos.
- **Visualização em tempo real**: Veja uma prévia do seu website enquanto edita.
- **Gerenciamento de usuários**: Autenticação e controle de acesso.
- **Configurações avançadas**: Personalize o comportamento e aparência dos componentes.
- **Gráficos e estatísticas**: Visualize dados do website com gráficos de área e barras.

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ESLint](https://eslint.org/)

## Estrutura do Projeto

```
src/
  charts/           # Componentes de gráficos
  components/       # Componentes principais do painel
  elements/         # Elementos básicos reutilizáveis
  enums/            # Enumerações de tipos
  exceptions/       # Tratamento de exceções
  factories/        # Fábricas de componentes e elementos
  pages/            # Páginas do painel
  services/         # Serviços
  stores/           # Gerenciamento de estado
  App.tsx           # Componente principal
  main.tsx          # Ponto de entrada
```

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Lucas-SCCP/website-panel.git
   cd website-panel
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o projeto:
   ```bash
   npm run dev
   ```

## Scripts Disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento.
- `npm run build` — Gera a versão de produção.
- `npm run preview` — Visualiza a build de produção localmente.
- `npm run lint` — Executa o linter.
