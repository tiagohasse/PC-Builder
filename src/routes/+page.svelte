<script>
    import { resolve } from '$app/paths';
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-900 text-white">
    <div class="text-center">
        <h1 class="text-4xl font-bold text-orange-500 mb-4">PC Builder</h1>
        <p class="text-slate-400 mb-8">Monte seu setup com garantia de compatibilidade e o menor preço.</p>
        <a href={resolve("/setups/novo")} class="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition-colors">
            Iniciar Montagem
        </a>
    </div>
</div>