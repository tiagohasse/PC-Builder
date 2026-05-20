# Montador de PC - MVP

Uma aplicação web desenvolvida em SvelteKit que atua como um agregador inteligente de preços de hardware. O sistema consome a API do Google Shopping (SerpApi) para buscar as peças mais baratas do varejo nacional e permite ao usuário salvar um histórico local dos seus orçamentos.

## Tecnologias Utilizadas
* **Frontend:** Svelte 5 (Runes) e Tailwind CSS
* **Backend:** SvelteKit API Routes (Node.js)
* **Integração:** SerpApi (Google Shopping)
* **Persistência:** LocalStorage (UX sem perdas e Histórico de Dashboard)

## Como rodar o projeto localmente

1. **Clone o repositório:**
   Faça o clone deste repositório para a sua máquina local.

2. **Instale as dependências:**
   Abra o terminal na pasta raiz do projeto e rode:
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente (MUITO IMPORTANTE):**
   Crie um arquivo chamado `.env` na raiz do projeto (mesmo nível do `package.json`). Você precisará de uma chave gratuita da [SerpApi](https://serpapi.com/). Adicione o seguinte conteúdo ao arquivo:
   ```env
   SERPAPI_KEY="sua_chave_aqui_sem_aspas"
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   docker-compose -f docker-compose.yml up --build
   ```

5. **Acesse a aplicação:**
   Abra o seu navegador e acesse `http://localhost:5173`.