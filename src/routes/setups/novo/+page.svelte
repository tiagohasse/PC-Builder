<script lang="ts">
    import { onMount } from 'svelte';
    import { buscarPrecos } from '../../../services/api.ts';

    const categorias = [
        { id: 'cpu', nome: 'Processador (CPU)', placeholder: 'Ex: Ryzen 5 7600' },
        { id: 'cooler', nome: 'CPU Cooler', placeholder: 'Ex: Noctua NH-D15' },
        { id: 'motherboard', nome: 'Placa-mãe', placeholder: 'Ex: B650 Aorus' },
        { id: 'memory', nome: 'Memória RAM', placeholder: 'Ex: 32GB DDR5' },
        { id: 'storage', nome: 'Armazenamento', placeholder: 'Ex: NVMe 1TB' },
        { id: 'gpu', nome: 'Placa de Vídeo', placeholder: 'Ex: RTX 4060' },
        { id: 'power', nome: 'Fonte', placeholder: 'Ex: 650W 80 Plus' },
        { id: 'case', nome: 'Gabinete', placeholder: 'Ex: NZXT H510' }
    ] as const;

    let setup = $state(
    categorias.reduce((acc, cat) => {
        // Adicionado: link: ''
        acc[cat.id] = { termo: '', preco: 0, loja: '', nomeReal: '', link: '' }; 
        return acc;
    // Adicionado: link: string na tipagem
    }, {} as Record<string, { termo: string; preco: number; loja: string; nomeReal: string; link: string }>) 
);

    let tentouFinalizar = $state(false);
    let carregando = $state(false);
    let statusAPI = $state({ tipo: '', mensagem: '' });
    
    // UX: Controle de blur (se o usuário já visitou e saiu do campo)
    let touched = $state<Record<string, boolean>>({});

    // UX: Não perca o progresso (Recupera dados ao carregar a tela)
    onMount(() => {
        const rascunho = localStorage.getItem('pc-builder-rascunho');
        if (rascunho) {
            try {
                const dados = JSON.parse(rascunho);
                for (const key in dados) {
                    if (setup[key]) setup[key].termo = dados[key].termo;
                }
            } catch (e) {
                console.error("Falha ao ler rascunho:", e);
            }
        }
    });

    // UX: Salva no localStorage silenciosamente a cada letra digitada
    $effect(() => {
        const apenasTermos = Object.fromEntries(
            Object.entries(setup).map(([k, v]) => [k, { termo: v.termo }])
        );
        localStorage.setItem('pc-builder-rascunho', JSON.stringify(apenasTermos));
    });

    let erros = $derived.by(() => {
        let resultadoErros: Record<string, string | null> = {};
        for (const key in setup) {
            const termo = setup[key].termo.trim();
            if (termo.length > 0 && termo.length < 3) {
                resultadoErros[key] = 'Mínimo de 3 caracteres.';
            } else {
                resultadoErros[key] = null;
            }
        }
        return resultadoErros;
    });

    let formValido = $derived.by(() => {
        let temPeca = false;
        for (const key in setup) {
            if (setup[key].termo.trim().length > 0) temPeca = true;
            if (erros[key] !== null) return false;
        }
        return temPeca;
    });

    let total = $derived(
        Object.values(setup).reduce((soma, item) => soma + (item.preco || 0), 0)
    );

    async function finalizarMontagem(evento: Event) {
        // UX: Previne o recarregamento da página pelo <form>
        evento.preventDefault(); 
        
        tentouFinalizar = true;
        statusAPI = { tipo: '', mensagem: '' };
        
        if (formValido) {
            carregando = true;
            
            const pecasPreenchidas = Object.entries(setup)
                .filter(([, item]) => item.termo.trim().length >= 3)
                .map(([id, item]) => ({ id, termo: item.termo }));
                
            try {
                const resultados = await buscarPrecos(pecasPreenchidas);
                
                resultados.forEach((resultado: { id: string; preco: number; loja?: string; debug_nome?: string; link?: string }) => {
                    setup[resultado.id].preco = resultado.preco;
                    setup[resultado.id].loja = resultado.loja || '';
                    setup[resultado.id].nomeReal = resultado.debug_nome || '';
                    setup[resultado.id].link = resultado.link || '';
                });

                // --- INÍCIO DO CÓDIGO NOVO: Salvar no Histórico ---
                // Definimos o formato que a API devolve
                type ResultadoAPI = { id: string; preco: number; loja?: string; debug_nome?: string; link?: string };
                
                const pecasValidas = resultados.map((r: ResultadoAPI) => ({
                    categoria: categorias.find(c => c.id === r.id)?.nome || r.id,
                    termo: setup[r.id].termo,
                    preco: r.preco,
                    loja: r.loja || '',
                    nomeReal: r.debug_nome || '',
                    link: r.link || ''
                }));

                // Tipamos a variável 'p' para avisar que ela contém pelo menos um 'preco' numérico
                const somaTotal = pecasValidas.reduce((acc: number, p: { preco: number }) => acc + p.preco, 0);

                const novoSetup = {
                    id: Date.now(),
                    data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    total: somaTotal,
                    pecas: pecasValidas
                };

                const historicoAntigo = JSON.parse(localStorage.getItem('pc-builder-historico') || '[]');
                historicoAntigo.unshift(novoSetup); 
                localStorage.setItem('pc-builder-historico', JSON.stringify(historicoAntigo));
                // --- FIM DO CÓDIGO NOVO ---

                statusAPI = { tipo: 'sucesso', mensagem: 'Preços atualizados com sucesso!' };
            } catch (erro) {
                console.error("Erro na requisição:", erro);
                statusAPI = { tipo: 'erro', mensagem: 'Falha ao buscar preços. Tente novamente.' };
            } finally {
                carregando = false;
            }
        }
    }
</script>

<div class="max-w-5xl mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold text-orange-500 mb-2">Montador de PC</h1>
    <p class="text-slate-400 mb-8">Digite o modelo das peças desejadas. O sistema buscará o menor preço.</p>

    <form onsubmit={finalizarMontagem} class="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
        
        <div class="hidden md:grid grid-cols-12 gap-4 bg-slate-900 border-b border-slate-800 p-4 text-sm font-semibold text-slate-300">
            <div class="col-span-3">Componente</div>
            <div class="col-span-7">Seleção</div>
            <div class="col-span-2 text-right">Preço Atual</div>
        </div>

        {#each categorias as cat (cat.id)}
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-slate-800/50 items-start md:items-center hover:bg-slate-900/50 transition-colors">
                
                <label for={cat.id} class="col-span-3 font-bold text-slate-200 cursor-pointer">
                    {cat.nome}
                </label>
                
                <div class="col-span-7">
                    <input 
                        id={cat.id}
                        type="text" 
                        bind:value={setup[cat.id].termo}
                        onblur={() => touched[cat.id] = true}
                        autocomplete="off"
                        placeholder={cat.placeholder}
                        aria-invalid={!!(erros[cat.id] && (tentouFinalizar || touched[cat.id]))}
                        aria-describedby={erros[cat.id] && (tentouFinalizar || touched[cat.id]) ? `erro-${cat.id}` : undefined}
                        class="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm focus:outline-none focus:border-orange-500 transition-colors {((tentouFinalizar || touched[cat.id]) && erros[cat.id]) ? 'border-red-500' : ''}"
                    />
                    
                    {#if (tentouFinalizar || touched[cat.id]) && erros[cat.id]}
                        <p id={`erro-${cat.id}`} class="text-red-500 text-xs mt-1 font-semibold">{erros[cat.id]}</p>
                    {/if}
                </div>

                <div class="col-span-2 flex flex-col items-start md:items-end justify-center font-mono">
    <span class="text-orange-400 font-semibold">
        R$ {setup[cat.id].preco.toFixed(2)}
    </span>
    
    {#if setup[cat.id].loja}
        {#if setup[cat.id].link}
            <a 
                href={setup[cat.id].link}
                target="_blank"
                rel="noopener noreferrer"
                class="text-[10px] text-slate-500 mt-0.5 truncate max-w-full hover:underline"
                title={setup[cat.id].nomeReal}
            >
                via {setup[cat.id].loja}
            </a>
        {:else}
            <span 
                class="text-[10px] text-slate-500 mt-0.5 truncate max-w-full cursor-help" 
                title={setup[cat.id].nomeReal}
            >
                via {setup[cat.id].loja}
            </span>
        {/if}
    {/if}
</div>
            </div>
        {/each}

        <div class="p-6 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-xl font-bold text-slate-200">
                Total Estimado: <span class="text-orange-500 ml-2">R$ {total.toFixed(2)}</span>
            </div>

            <div class="flex flex-col items-end gap-2">
                {#if tentouFinalizar && !formValido}
                    <span class="text-red-500 text-sm font-bold">Preencha corretamente ou adicione uma peça.</span>
                {/if}
                {#if statusAPI.mensagem}
                    <span class="text-sm font-bold px-3 py-1 rounded {statusAPI.tipo === 'sucesso' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}">
                        {statusAPI.mensagem}
                    </span>
                {/if}

                <button 
                    type="submit"
                    disabled={carregando}
                    class="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center min-w-55"
                >
                    {#if carregando}
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Buscando...
                    {:else}
                        Buscar Preços e Finalizar
                    {/if}
                </button>
            </div>
        </div>
    </form>
</div>