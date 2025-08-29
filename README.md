# MedAssist Pro

Sistema de gestão médica moderno e intuitivo com foco em qualidade, performance e acessibilidade.

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript 5
- **Build**: Vite 4+
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Auth + Database + Storage)
- **Estado**: Zustand
- **Testes**: Jest + React Testing Library + Storybook
- **Deploy**: Vercel

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

## 🛠️ Desenvolvimento

```bash
# Servidor de desenvolvimento
npm run dev

# Storybook (design system)
npm run storybook

# Verificação de tipos
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

## 🧪 Testes

```bash
# Testes unitários
npm test
npm run test:watch
npm run test:ci

# Testes do Storybook
npm run test:storybook
npm run test:storybook:smoke

# Testes de acessibilidade
npm run test:a11y
```

## 🏗️ Build e Deploy

```bash
# Build de produção
npm run build

# Preview local
npm run preview

# Build do Storybook
npm run build-storybook
```

## 📊 Qualidade e Performance

```bash
# Análise do bundle
npm run analyze:bundle

# Auditoria de performance
npm run performance:audit

# Verificação de tamanho do bundle
npm run performance:bundle-size
```

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── features/       # Componentes específicos
├── stores/             # Estados globais (Zustand)
├── lib/                # Utilitários e configurações
├── types/              # Definições TypeScript
├── stories/            # Stories do Storybook
└── __tests__/          # Testes unitários
```

## 🚦 CI/CD

O projeto utiliza GitHub Actions para:

- ✅ Verificação de tipos TypeScript
- ✅ Linting com ESLint
- ✅ Testes unitários e de integração
- ✅ Testes de acessibilidade
- ✅ Build e deploy automático

## 📋 Scripts Disponíveis

| Script       | Descrição                   |
| ------------ | --------------------------- |
| `dev`        | Servidor de desenvolvimento |
| `build`      | Build de produção           |
| `test`       | Testes unitários            |
| `test:ci`    | Testes para CI com coverage |
| `storybook`  | Interface do Storybook      |
| `lint`       | Verificação de código       |
| `type-check` | Verificação TypeScript      |

## 🔒 Segurança

- ✅ Variáveis de ambiente seguras
- ✅ Validação de dados de entrada
- ✅ Autenticação via Supabase
- ✅ Sanitização de dados

## 🎯 Qualidade de Código

- **ESLint**: Detecção de problemas e anti-patterns
- **Prettier**: Formatação automática
- **TypeScript**: Tipagem estática
- **Jest**: Testes unitários com coverage
- **Storybook**: Documentação de componentes
- **axe-core**: Testes de acessibilidade

## 📈 Performance

- ⚡ Vite para build rápido
- 🎯 Code splitting automático
- 📦 Bundle otimizado
- 🖼️ Lazy loading de imagens
- 💾 Cache inteligente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/17a5537f-945e-44a2-bdb7-22b95ba452b6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/17a5537f-945e-44a2-bdb7-22b95ba452b6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
