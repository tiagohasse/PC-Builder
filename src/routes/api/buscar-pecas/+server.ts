import { json } from '@sveltejs/kit';
import { SERPAPI_KEY } from '$env/static/private';

export async function POST({ request }) {
    try {
        const body = await request.json();
        
        if (!body || !Array.isArray(body.pecas)) {
            return json({ erro: 'Formato de requisição inválido.' }, { status: 400 });
        }

        const pecas = body.pecas.slice(0, 10);
        const precosEncontrados = [];

        for (const peca of pecas) {
            if (!peca || typeof peca.termo !== 'string' || peca.termo.trim().length === 0) {
                continue; 
            }
            
            const termoSanitizado = peca.termo.trim().substring(0, 100);
            
            try {
                const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(termoSanitizado)}&gl=br&hl=pt-br&sort_by=1&api_key=${SERPAPI_KEY}`;
                
                const resposta = await fetch(url);
                const dados = await resposta.json();

                if (dados.shopping_results && dados.shopping_results.length > 0) {
                    const melhorOpcao = dados.shopping_results[0];
                    
                    precosEncontrados.push({
                        id: String(peca.id).substring(0, 50),
                        preco: Number(melhorOpcao.extracted_price) || 0,
                        debug_nome: String(melhorOpcao.title),
                        loja: String(melhorOpcao.source),
                        link: String(melhorOpcao.product_link || melhorOpcao.link || "")
                    });
                } else {
                    precosEncontrados.push({ id: peca.id, preco: 0 });
                }
            } catch (erroBusca) {
                console.error(`Erro ao buscar:`, erroBusca);
                precosEncontrados.push({ id: peca.id, preco: 0 });
            }
        }

        return json(precosEncontrados);

    } catch (erroGeral) {
        console.error('Erro crítico na API:', erroGeral);
        
        return json({ erro: 'Ocorreu um erro ao processar a solicitação.' }, { status: 500 });
    }
}