// jobs.js
let todasHabilidades = [];
let minhasHabilidades = [];
let todasVagas = [];

// Verificar se usuário está logado
window.addEventListener('DOMContentLoaded', function() {
    verificarSessao();
    carregarDados();
});

function verificarSessao() {
    // Na prática, você faria uma chamada API para verificar a sessão
    // Por enquanto, vamos assumir que se chegou aqui, está logado
    console.log("Usuário logado - carregando dados...");
}

async function carregarDados() {
    try {
        await Promise.all([
            carregarHabilidades(),
            carregarMinhasHabilidades(),
            carregarVagas()
        ]);
        calcularCompatibilidade();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

async function carregarHabilidades() {
    const response = await fetch('/myapp/api/vagas?action=habilidades');
    todasHabilidades = await response.json();
    popularSelectHabilidades();
}

async function carregarMinhasHabilidades() {
    const response = await fetch('/myapp/api/vagas?action=minhas-habilidades');
    minhasHabilidades = await response.json();
    exibirMinhasHabilidades();
}

async function carregarVagas() {
    const response = await fetch('/myapp/api/vagas');
    todasVagas = await response.json();
    exibirVagas();
}

function popularSelectHabilidades() {
    const select = document.getElementById('selectHabilidades');
    select.innerHTML = '<option value="">Selecione uma habilidade</option>';
    
    todasHabilidades.forEach(habilidade => {
        const option = document.createElement('option');
        option.value = habilidade.id;
        option.textContent = habilidade.nome;
        select.appendChild(option);
    });
}

function exibirMinhasHabilidades() {
    const lista = document.getElementById('minhasHabilidadesList');
    lista.innerHTML = '';
    
    if (minhasHabilidades.length === 0) {
        lista.innerHTML = '<li class="muted">Nenhuma habilidade cadastrada</li>';
        return;
    }
    
    minhasHabilidades.forEach(habilidade => {
        const li = document.createElement('li');
        li.textContent = habilidade.nome;
        if (habilidade.descricao) {
            li.innerHTML += ` <span class="muted">- ${habilidade.descricao}</span>`;
        }
        lista.appendChild(li);
    });
}

function exibirVagas() {
    const container = document.getElementById('vagasList');
    container.innerHTML = '';
    
    todasVagas.forEach(vaga => {
        const vagaElement = document.createElement('div');
        vagaElement.className = 'card job-card';
        vagaElement.innerHTML = `
            <h3>${vaga.titulo}</h3>
            <p class="muted">${vaga.descricao || 'Sem descrição'}</p>
            <div class="info">
                <strong>Habilidades necessárias:</strong><br>
                ${obterNomesHabilidades(vaga.habilidadesNecessarias)}
            </div>
            <div class="compatibilidade-indicator" style="margin-top: 10px; padding: 5px; background: #f0f0f0; border-radius: 5px;">
                Compatibilidade: <span id="comp-${vaga.id}">Calculando...</span>
            </div>
        `;
        container.appendChild(vagaElement);
    });
}

function obterNomesHabilidades(idsString) {
    if (!idsString) return 'Não especificadas';
    
    const ids = idsString.split(',').map(id => parseInt(id.trim()));
    const nomes = ids.map(id => {
        const habilidade = todasHabilidades.find(h => h.id === id);
        return habilidade ? habilidade.nome : 'Habilidade desconhecida';
    });
    
    return nomes.join(', ') || 'Não especificadas';
}

function calcularCompatibilidade() {
    todasVagas.forEach(vaga => {
        if (!vaga.habilidadesNecessarias) {
            document.getElementById(`comp-${vaga.id}`).textContent = '0%';
            return;
        }
        
        const habilidadesNecessarias = vaga.habilidadesNecessarias.split(',').map(id => parseInt(id.trim()));
        const minhasHabilidadesIds = minhasHabilidades.map(h => h.id);
        
        const habilidadesMatch = habilidadesNecessarias.filter(id => 
            minhasHabilidadesIds.includes(id)
        );
        
        const compatibilidade = habilidadesNecessarias.length > 0 
            ? Math.round((habilidadesMatch.length / habilidadesNecessarias.length) * 100)
            : 0;
            
        const element = document.getElementById(`comp-${vaga.id}`);
        if (element) {
            element.textContent = `${compatibilidade}%`;
            element.style.color = compatibilidade >= 70 ? 'green' : compatibilidade >= 40 ? 'orange' : 'red';
            element.style.fontWeight = 'bold';
        }
    });
    
    // Atualizar resumo de compatibilidade
    atualizarResumoCompatibilidade();
}

function atualizarResumoCompatibilidade() {
    const resumoElement = document.getElementById('compatibilidadeInfo');
    const vagasCompativeis = todasVagas.filter(vaga => {
        if (!vaga.habilidadesNecessarias) return false;
        const habilidadesNecessarias = vaga.habilidadesNecessarias.split(',').map(id => parseInt(id.trim()));
        const minhasHabilidadesIds = minhasHabilidades.map(h => h.id);
        const match = habilidadesNecessarias.filter(id => minhasHabilidadesIds.includes(id));
        return match.length > 0;
    });
    
    resumoElement.innerHTML = `
        <p>Você possui <strong>${minhasHabilidades.length}</strong> habilidades cadastradas.</p>
        <p>É compatível com <strong>${vagasCompativeis.length}</strong> de <strong>${todasVagas.length}</strong> vagas.</p>
        <p class="muted">Adicione mais habilidades para aumentar sua compatibilidade!</p>
    `;
}

async function adicionarHabilidade() {
    const select = document.getElementById('selectHabilidades');
    const habilidadeId = select.value;
    
    if (!habilidadeId) {
        alert('Selecione uma habilidade');
        return;
    }
    
    try {
        const response = await fetch('/myapp/api/vagas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=adicionar-habilidade&habilidade_id=${habilidadeId}`
        });
        
        if (response.ok) {
            alert('Habilidade adicionada com sucesso!');
            await carregarMinhasHabilidades();
            calcularCompatibilidade();
            select.value = '';
        } else {
            alert('Erro ao adicionar habilidade');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar habilidade');
    }
}

function abrirGerenciarHabilidades() {
    document.getElementById('modalHabilidades').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalHabilidades').classList.add('hidden');
}

function sair() {
    // Limpar sessão e redirecionar para login
    fetch('/myapp/api/logout', { method: 'POST' })
        .finally(() => {
            window.location.href = 'index.html';
        });
}

// Fechar modal ao clicar fora
document.getElementById('modalHabilidades').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModal();
    }
});