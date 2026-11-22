# Menu CMS

Painel administrativo do cardápio digital e da operação de um restaurante, integrado ao backend NestJS do primeiro bimestre.

## Etapa atual

Primeira etapa: estrutura React, tema, componentes básicos, navegação entre Categorias, Produtos, Mesas e Comandas, instância Axios e provider do TanStack Query. As páginas sinalizam que os módulos ainda estão em desenvolvimento; não apresentam dados simulados.

Os CRUDs, a leitura de comandas, os pedidos e o Kanban serão implementados nas etapas seguintes. Esta versão ainda não é a entrega completa.

## Instalação e execução

Requer Node.js compatível com o Vite 8 (20.19+ ou 22.12+) e npm.

1. Execute `npm install`.
2. Copie `.env.example` para `.env`.
3. Ajuste `VITE_API_URL` para o endereço do backend em execução.
4. Execute `npm run dev` e abra o endereço informado pelo Vite.

No PowerShell, a cópia pode ser feita com `Copy-Item .env.example .env`.

O backend deve permitir CORS para o frontend. Antes dos módulos de dados, valide as rotas no Insomnia. O endereço padrão do exemplo é o da execução local do backend; nenhuma URL de API deve ser colocada nos componentes.

## Comandos

- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: verifica TypeScript e gera a aplicação em `dist/`.
- `npm run lint`: verifica as regras do código.
- `npm run preview`: serve localmente o build de produção.

## Organização

- `src/pages`: páginas vinculadas às rotas.
- `src/components/layout`: estrutura administrativa e navegação.
- `src/components/ui`: componentes locais do shadcn/ui.
- `src/lib/axios.ts`: única instância Axios, com baseURL obtida de `VITE_API_URL`.
- `src/lib/utils.ts`: utilitário de classes.
- `src/cases/<domínio>`: receberá DTOs, services, hooks e componentes específicos, seguindo o menu-frontend de aula.

As leituras serão feitas por `useQuery`; as gravações, por `useMutation`, com `invalidateQueries` após o sucesso.

## Tecnologias e dependências

Stack obrigatória: Vite, React, Tailwind CSS, shadcn/ui, Axios e TanStack Query.

Dependências de apoio, seguindo o projeto de aula:

| Dependência | Justificativa |
| --- | --- |
| TypeScript e pacotes `@types/*` | Tipagem do código, das APIs do navegador e da configuração. |
| react-dom | Renderização do React no navegador. |
| react-router-dom | Rotas e navegação entre módulos. |
| @base-ui/react | Primitivas acessíveis dos componentes shadcn/ui no estilo Base UI usado em aula. |
| class-variance-authority | Variantes dos componentes shadcn/ui, como botões. |
| cn | Composição das classes CSS, conforme o projeto de aula. |
| lucide-react | Ícones da navegação e dos componentes. |
| tw-animate-css | Utilitários de animação dos componentes shadcn/ui. |
| @fontsource-variable/inter | Fonte Inter hospedada junto da aplicação, sem requisição a serviço de fontes. |
| @tailwindcss/vite | Integração do Tailwind CSS com o Vite. |
| @vitejs/plugin-react | Integração React com o Vite e atualização durante o desenvolvimento. |
| ESLint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh e globals | Análise estática, regras de hooks e Fast Refresh. |

## Pendências identificadas no backend local

A inspeção do código não substitui testes das rotas em execução no Insomnia.

- A entidade Category ainda não possui o campo de ordem de exibição exigido no enunciado.
- A entidade Product ainda não possui os indicadores de vegetariano e novidade.
- O controller de comandas (`guest-checks`) ainda não possui uma rota GET de listagem.
- O enum OrderStatus usa `DELIVERY`, enquanto o enunciado pede `DELIVERED` para a última coluna do Kanban. É necessário alinhar o contrato antes dessa etapa.

Essas diferenças devem ser resolvidas antes da integração dos respectivos requisitos. O CMS não deve simular campos ou registros ausentes na API.

## Etapas planejadas

1. Estrutura inicial e navegação.
2. CRUD de categorias.
3. CRUD de produtos.
4. CRUD de mesas.
5. Comandas e pedidos com alteração de status.
6. Kanban, revisão e documentação da entrega.

Cada etapa será implementada e verificada antes do respectivo commit. O vídeo explicativo deverá ser gravado pelo aluno, demonstrando e explicando a versão final.
