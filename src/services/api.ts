export async function buscarPrecos(pecas: { id: string, termo: string }[]) {
    try {
        const response = await fetch('/api/buscar-pecas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pecas })
        });

        if (!response.ok) {
            throw new Error(`Erro no servidor: ${response.status}`);
        }

        return await response.json();
        
    } catch (erro) {
        console.error("Falha ao conectar com o endpoint:", erro);
        throw erro;
    }
}