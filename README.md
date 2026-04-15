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

