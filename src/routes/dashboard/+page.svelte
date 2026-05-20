<script lang="ts">
    import { resolve } from '$app/paths';
    import { onMount } from 'svelte';

    interface PecaSalva {
        categoria: string;
        termo: string;
        preco: number;
        loja: string;
        nomeReal: string;
    }

    interface SetupSalvo {
        id: number;
        data: string;
        total: number;
        pecas: PecaSalva[];
    }

    let historico = $state<SetupSalvo[]>([]);
    let carregado = $state(false);

    onMount(() => {
        const dadosSalvos = localStorage.getItem('pc-builder-historico');
        if (dadosSalvos) {
            try {
                historico = JSON.parse(dadosSalvos);
            } catch (e) {
                console.error("Falha ao ler o histórico:", e);
            }
        }
        carregado = true;
    });

    function limparHistorico() {
        if (confirm('Tem certeza que deseja apagar todo o seu histórico de montagens?')) {
            localStorage.removeItem('pc-builder-historico');
            historico = [];
        }
    }
</script>

<div class="max-w-5xl mx-auto py-10 px-4 min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 class="text-3xl font-bold text-orange-500 mb-2">Meu Painel</h1>
            <p class="text-slate-400">Histórico das suas últimas simulações de hardware.</p>
        </div>
        
        {#if historico.length > 0}
            <button 
                onclick={limparHistorico}
                class="text-sm text-red-400 hover:text-red-300 transition-colors px-4 py-2 border border-red-900/50 hover:bg-red-900/20 rounded"
            >
                Limpar Histórico
            </button>
        {/if}
    </div>

    {#if !carregado}
        <div class="text-center py-20 text-slate-500 animate-pulse">
            Carregando seus dados...
        </div>
    {:else if historico.length === 0}
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-10 text-center flex flex-col items-center justify-center">
            <svg class="w-16 h-16 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h2 class="text-xl font-bold text-slate-300 mb-2">Nenhum setup salvo ainda</h2>
            <p class="text-slate-500 max-w-md mb-6">Você ainda não finalizou nenhuma busca de preços. Vá até o montador para criar sua primeira simulação.</p>
            <a href={resolve("/setups/novo")} class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Criar Novo Setup
            </a>
        </div>
    {:else}
        <div class="grid gap-6 md:grid-cols-2">
            {#each historico as setup (setup.id)}
                <div class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
                    <div class="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                        <span class="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-1 rounded">
                            {setup.data}
                        </span>
                        <span class="text-lg font-bold text-orange-400 font-mono">
                            R$ {setup.total.toFixed(2)}
                        </span>
                    </div>
                    
                    <div class="p-4 grow">
                        <ul class="space-y-3">
                            {#each setup.pecas as peca, index (index)}
                                <li class="flex justify-between items-start text-sm border-b border-slate-800/50 pb-2 last:border-0 last:pb-0">
                                    <div class="flex flex-col pr-4">
                                        <span class="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{peca.categoria}</span>
                                        <span class="text-slate-200">{peca.termo}</span>
                                    </div>
                                    <div class="flex flex-col items-end whitespace-nowrap">
                                        <span class="font-mono text-slate-300 mt-1">R$ {peca.preco.toFixed(2)}</span>
                                        {#if peca.loja}
                                            <span class="text-[10px] text-slate-500 mt-0.5 max-w-25 truncate" title={peca.nomeReal}>
                                                via {peca.loja}
                                            </span>
                                        {/if}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>