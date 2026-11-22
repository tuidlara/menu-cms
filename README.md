# Menu CMS

Sistema administrativo para gerenciar o cardápio, as mesas, as comandas e os pedidos do restaurante.

## Instalação e execução

Requer Node.js 22.12 ou superior e o backend NestJS em execução.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e configure `VITE_API_URL` com o endereço do backend.

3. Inicie a aplicação:

   ```bash
   npm run dev
   ```

4. Abra no navegador o endereço informado pelo Vite.

## Dependências fora da stack obrigatória

| Dependência | Justificativa |
| --- | --- |
| `react-dom` | Renderizar a aplicação React no navegador. |
| `react-router-dom` | Navegação entre as páginas do CMS. |
| `@base-ui/react` | Primitivas dos componentes shadcn/ui usados no projeto. |
| `class-variance-authority` | Definir variantes dos componentes de interface. |
| `cn` | Combinar classes CSS dos componentes. |
| `lucide-react` | Ícones da interface. |
| `sonner` | Mensagens de sucesso e erro das operações. |
| `tw-animate-css` | Animações dos componentes shadcn/ui. |
| `@fontsource-variable/inter` | Disponibilizar a fonte Inter localmente. |
| `@tailwindcss/vite` | Integrar o Tailwind CSS ao Vite. |
| `@vitejs/plugin-react` | Integrar o React ao Vite. |
| `typescript`, `@types/node`, `@types/react` e `@types/react-dom` | Tipagem do código e das bibliotecas. |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` e `globals` | Verificar o código e as regras de hooks e Fast Refresh. |
