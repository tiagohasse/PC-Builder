# Arquitetura do Projeto: PC Builder SvelteKit

Esta estrutura segue os princípios de **Feature-Based Architecture** adaptados ao ecossistema SvelteKit.

## Diretórios Principais

-   **src/components**: Contém componentes visuais reutilizáveis. Seguir a convenção `PascalCase.svelte`.
-   **src/routes**: Camada de roteamento e páginas. Arquivos `+page.svelte` representam a interface e `+page.server.js` lida com o carregamento de dados e segurança (SSR).
-   **src/lib/features**: O "coração" da aplicação. Contém regras de negócio isoladas por funcionalidade (Compatibilidade, Busca de Preços).
-   **src/services**: Abstrações para chamadas de APIs externas e integrações com o backend agregador.
-   **src/store**: Gerenciamento de estado global da aplicação (ex: as peças atualmente selecionadas no carrinho).
-   **src/hooks**: Scripts que interceptam requisições no servidor ou no cliente.
-   **src/utils**: Funções auxiliares, formatadores e constantes técnicas (ex: mapeamento de soquetes).

## Convenções
-   **Componentes**: PascalCase (ex: `ProductCard.svelte`).
-   **Lógica/Scripts**: camelCase (ex: `compatibilityEngine.js`).
-   **Aliases**: Utilize `@/` para referenciar a raiz de `src`.

# PC-Builder

**Autor**: Tiago Hasse Niemczewski

**Framework Escolhido**: SvelteKit

## Ideia Preliminar do Projeto

### O Problema
A montagem de um PC personalizado envolve duas barreiras principais para o consumidor:

* **Compatibilidade técnica:** cruzar gerações de processadores, soquetes de placas-mãe (AM4, AM5, LGA1700) e padrões de memória (DDR4, DDR5) exige conhecimento técnico, e erros geram prejuízo financeiro.
* **Fragmentação de preços:** os valores dos componentes flutuam diariamente em múltiplas lojas varejistas. Fazer essa pesquisa manualmente e validar as peças de forma cruzada toma muito tempo e dificulta a busca pelo menor orçamento possível.

### A Solução Proposta
Desenvolver uma aplicação full-stack de montagem de computadores atuando em duas frentes:

1. **Frontend Reativo:** Utilizando a velocidade do Svelte para aplicar filtros instantâneos. Ao selecionar um processador, o sistema invalida e esconde placas-mãe incompatíveis em tempo real.
2. **Backend Agregador:** Utilizando o servidor do SvelteKit para realizar requisições simultâneas às APIs de lojas de hardware, centralizando e comparando os menores preços do mercado sem expor a lógica de busca no navegador do usuário. O servidor também garantirá a geração de links compartilháveis dos setups montados (via Server-Side Rendering).


# Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.15.1 create --template library --types ts --add prettier eslint tailwindcss="plugins:forms" drizzle="database:postgresql+postgresql:postgres.js+docker:yes" better-auth="demo:password" --install npm PC-Builder
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```
