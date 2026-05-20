import { json } from '@sveltejs/kit';
import { SERPAPI_KEY } from '$env/static/private';

export async function POST({ request }) {
    try {
        const { pecas } = await request.json();
        const precosEncontrados = [];

        for (const peca of pecas) {
            console.log(`Buscando no Google Shopping: ${peca.termo}...`);
            
            try {
                const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(peca.termo)}&gl=br&hl=pt-br&sort_by=1&api_key=${SERPAPI_KEY}`;
                
                const resposta = await fetch(url);
                const dados = await resposta.json();

                if (dados.shopping_results && dados.shopping_results.length > 0) {
                    
                    const melhorOpcao = dados.shopping_results[0];
                    
                    precosEncontrados.push({
                        id: peca.id,
                        preco: melhorOpcao.extracted_price || 0,
                        debug_nome: melhorOpcao.title,
                        loja: melhorOpcao.source
                    });

                    console.log(`Encontrado: ${melhorOpcao.title} por R$ ${melhorOpcao.extracted_price} na ${melhorOpcao.source}`);
                } else {
                    precosEncontrados.push({ 
                        id: peca.id, 
                        preco: 0, 
                        debug_msg: "Sem resultados no Google Shopping" 
                    });
                    console.log(`Nenhum resultado para: ${peca.termo}`);
                }
            } catch (erroBusca) {
                console.error(`Erro ao buscar ${peca.termo}:`, erroBusca);
                precosEncontrados.push({ id: peca.id, preco: 0 });
            }
        }

        return json(precosEncontrados);

    } catch (erroGeral) {
        console.error('Erro geral na API:', erroGeral);
        return json({ erro: 'Falha interna no servidor' }, { status: 500 });
    }
}