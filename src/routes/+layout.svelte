<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import './layout.css';

    let { children } = $props();

    const navLinks = [
        { href: '/', label: 'Início' },
        { href: '/pecas', label: 'Catálogo' },
        { href: '/setups/novo', label: 'Montar PC' },
        { href: '/dashboard', label: 'Meu Painel' }
    ] as const;
</script>

<div class="min-h-screen bg-slate-900 flex flex-col">
    <nav class="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-50">
        <div class="container mx-auto max-w-5xl flex justify-between items-center">
            
            <a href={resolve("/")} class="text-orange-500 font-extrabold text-2xl tracking-tighter">
                PC<span class="text-white">Builder</span>
            </a>

            <ul class="flex gap-2">
                {#each navLinks as link (link.href)}
                    <li>
                        <a 
                            href={resolve(link.href)}
                            class="px-4 py-2 rounded-md text-sm font-semibold transition-colors
                                {page.url.pathname === resolve(link.href) 
                                    ? 'bg-orange-500 text-white' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
                        >
                            {link.label}
                        </a>
                    </li>
                {/each}
            </ul>
            
        </div>
    </nav>

    <main class="grow">
        {@render children()}
    </main>
</div>