# Menu CMS

Painel administrativo do cardápio digital e da operação de um restaurante, integrado ao backend NestJS do primeiro bimestre.

## Etapa atual

Terceira etapa: CRUDs de categorias e produtos integrados à API. Produtos incluem imagem, descrição, categoria, preço, situação, vegetariano e novidade, além de filtro por categoria. As duas áreas possuem validação, confirmação de exclusão, mensagens de sucesso e erro, carregamento e lista vazia. Mesas, comandas e pedidos ainda estão em desenvolvimento.

O CRUD de mesas, a leitura de comandas, os pedidos e o Kanban serão implementados nas etapas seguintes. Esta versão ainda não é a entrega completa.

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
- `src/cases/categories` e `src/cases/products`: DTOs, services, hooks e componentes de cada módulo, seguindo o mesmo padrão do menu-frontend de aula.

As leituras usam `useQuery`; as gravações usam `useMutation`, com `invalidateQueries` após o sucesso. Edição e exclusão de categorias também invalidam produtos, pois os produtos carregam a categoria relacionada.

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
| sonner | Mensagens de sucesso e erro após as gravações, com o componente Toaster do padrão shadcn/ui. |
| tw-animate-css | Utilitários de animação dos componentes shadcn/ui. |
| @fontsource-variable/inter | Fonte Inter hospedada junto da aplicação, sem requisição a serviço de fontes. |
| @tailwindcss/vite | Integração do Tailwind CSS com o Vite. |
| @vitejs/plugin-react | Integração React com o Vite e atualização durante o desenvolvimento. |
| ESLint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh e globals | Análise estática, regras de hooks e Fast Refresh. |

## Backend necessário

Use o menu-backend atualizado. O contrato de categorias inclui `id`, `name`, `icon`, `displayOrder` e `active`. O ID é gerado pelo backend; os demais campos são administrados pelo formulário.

Os ajustes para as próximas etapas também já estão no backend: indicadores `isVegetarian` e `isNew` dos produtos, filtro por categoria, listagem e total das comandas, pedidos com relações e status `NEW`, `PREPARING`, `READY` e `DELIVERED` com transições livres.

Antes de iniciar essa versão sobre um banco antigo, siga a migração de status descrita no README do menu-backend. A API precisa estar em execução no endereço configurado por `VITE_API_URL`, com o banco acessível e CORS habilitado.

A última tentativa de conexão ao banco retornou `tenant/user not found`. A validação com banco real e no Insomnia continua pendente até que a conexão esteja funcionando.

## Etapas planejadas

1. Estrutura inicial e navegação.
2. CRUD de categorias.
3. CRUD de produtos.
4. CRUD de mesas.
5. Comandas e pedidos com alteração de status.
6. Kanban, revisão e documentação da entrega.

Cada etapa é implementada e verificada separadamente. Os commits e pushes são feitos manualmente pelo aluno; categorias correspondem ao segundo commit e produtos ao terceiro commit do CMS. O vídeo explicativo deverá ser gravado pelo aluno, demonstrando e explicando a versão final.

## Validação da etapa de categorias

O campo de ordem usa números inteiros não negativos. O nome é obrigatório e limitado a 60 caracteres. O ícone é uma URL HTTP(S) opcional e pode ser removido. O ID é gerado pelo backend e não é um campo editável.

Com o backend atualizado em execução, confira as rotas no Insomnia antes do teste no CMS:

- `GET /categories`: listar por ordem e nome.
- `POST /categories`: enviar nome, ícone, ordem e situação.
- `PATCH /categories/:id`: editar os campos e remover ícone enviando `null`.
- `DELETE /categories/:id`: excluir uma categoria sem produtos vinculados.

Depois, teste no CMS: cadastrar uma categoria inativa, editar nome/ícone/ordem/situação, recarregar para conferir a persistência, cancelar uma exclusão e confirmar a exclusão de uma categoria de teste. Verifique também nome vazio, URL inválida, ordem negativa e o comportamento com o backend desligado.

Os testes automatizados do backend usam repositório isolado; não alteram registros do banco. Eles não substituem a validação da API real no Insomnia.

Validação local desta etapa: builds do CMS e backend aprovados; lint do CMS e do módulo de categorias aprovado. Os testes isolados não dependem do banco. Na última tentativa de execução real do backend, a conexão retornou `tenant/user not found`; revisar `DATABASE_URL` no `.env` local antes de validar a persistência real e as rotas no Insomnia. Nenhuma credencial deve ser adicionada ao Git.

## Produtos: terceira etapa

A listagem administrativa inclui produtos ativos e inativos, imagem, nome, categoria, preço formatado em reais, vegetariano, novidade e situação. O filtro por categoria fica na URL e cada filtro possui sua própria chave de cache no TanStack Query.

O formulário permite cadastrar e editar nome, descrição, preço, imagem, categoria, situação e os dois indicadores. O ID é gerado pela API. O preço aceita vírgula ou ponto decimal, deve ser maior que zero e ter no máximo duas casas decimais; valores inválidos não são arredondados silenciosamente nem enviados à API. Nome vazio e URL de imagem inválida também são tratados antes do envio.

As opções do select de categoria vêm de `GET /categories`. Um produto pode ficar sem categoria porque esse relacionamento é opcional no backend. Novos vínculos exigem uma categoria ativa. Na edição, uma categoria já atribuída que foi inativada pode ser mantida: o formulário omite `categoryId` quando esse vínculo não mudou, respeitando a regra da API.

Criação, edição e exclusão usam `useMutation` e invalidam todas as listagens de produtos. Edição e exclusão também invalidam pedidos e comandas, que podem exibir dados relacionados ao produto. Os valores históricos dos itens de pedidos não são alterados pelo CMS.

Select e Textarea são componentes do shadcn/ui adicionados nesta etapa. Nenhuma dependência adicional foi necessária.

Com o backend atualizado em execução, valide no Insomnia:

- `GET /products` e `GET /products?categoryId=<uuid>`.
- `POST /products` com todos os campos, inclusive os indicadores e a situação inicial.
- `PATCH /products/:id` para editar e limpar campos opcionais com `null`.
- `DELETE /products/:id` para excluir um produto de teste sem pedidos vinculados.

No CMS, confira cadastro ativo e inativo, indicadores ligados e desligados, imagem ausente ou inválida, filtro por categoria e sua remoção, edição de todos os campos, cancelamento da exclusão e confirmação da exclusão. Recarregue a página para verificar a persistência. Teste também preço zero/negativo, mais de duas casas decimais, nome vazio e o comportamento com a API desligada.

As rotas de categorias e produtos não responderam na verificação desta etapa. A validação com banco real e no Insomnia continua pendente; não foram adicionados registros simulados à aplicação.