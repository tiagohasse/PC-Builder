<script>
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white text-center">
    
    <h1 class="text-6xl font-extrabold text-orange-500">{page.status}</h1>
    
    <h2 class="text-2xl mt-4 font-semibold">Página não encontrada</h2>
    
    <p class="text-slate-400 mt-2 max-w-md">
        A peça que você procura parece ter saído de estoque (ou a URL está errada).
    </p>
    
    <a href={resolve("/")} class="mt-8 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg font-semibold transition-colors border border-slate-700">
        Voltar para a página inicial
    </a>
    
</div>