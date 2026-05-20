# Mapeamento de Rotas

Este documento lista as rotas implementadas no MVP da aplicação e suas respectivas responsabilidades:

* **`/` (Página Inicial):** Ponto de entrada do usuário. Apresenta o propósito do sistema.
* **`/setups/novo` (Montador):** Core da aplicação. Formulário interativo com validações de UX que coleta as peças desejadas e faz a requisição no backend (via SerpApi) para buscar os menores preços em tempo real. Salva rascunhos e históricos via `localStorage`.
* **`/dashboard` (Painel):** Área do usuário. Recupera os dados persistidos no navegador para exibir o histórico de setups simulados, com datas e valores totais, sem a necessidade de um banco de dados relacional nesta fase.
* **`/pecas` (Catálogo):** Rota estrutural preparada para futuras expansões do catálogo de hardware.