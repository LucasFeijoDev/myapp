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
    try {
        const response = await fetch('/myapp/api/vagas?action=habilidades');
        if (response.ok) {
            todasHabilidades = await response.json();
            popularSelectHabilidades();
        } else {
            console.error('Erro ao carregar habilidades:', response.status);
        }
    } catch (error) {
        console.error('Erro ao carregar habilidades:', error);
    }
}

async function carregarMinhasHabilidades() {
    try {
        const response = await fetch('/myapp/api/vagas?action=minhas-habilidades');
        if (response.ok) {
            minhasHabilidades = await response.json();
            exibirMinhasHabilidades();
        } else {
            console.error('Erro ao carregar minhas habilidades:', response.status);
        }
    } catch (error) {
        console.error('Erro ao carregar minhas habilidades:', error);
    }
}

async function carregarVagas() {
    try {
        const response = await fetch('/myapp/api/vagas');
        if (response.ok) {
            todasVagas = await response.json();
            exibirVagas();
        } else {
            console.error('Erro ao carregar vagas:', response.status);
        }
    } catch (error) {
        console.error('Erro ao carregar vagas:', error);
    }
}

function popularSelectHabilidades() {
    const select = document.getElementById('selectHabilidades');
    select.innerHTML = '<option value="">Selecione uma habilidade</option>';
    
    // Filtrar apenas habilidades que o usuário ainda não possui
    const habilidadesDisponiveis = todasHabilidades.filter(habilidade => 
        !minhasHabilidades.some(minhaHabilidade => minhaHabilidade.id === habilidade.id)
    );
    
    habilidadesDisponiveis.forEach(habilidade => {
        const option = document.createElement('option');
        option.value = habilidade.id;
        option.textContent = habilidade.nome;
        if (habilidade.descricao) {
            option.textContent += ` - ${habilidade.descricao}`;
        }
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
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        li.style.marginBottom = '8px';
        li.style.padding = '8px';
        li.style.backgroundColor = '#f9f9f9';
        li.style.borderRadius = '4px';
        li.style.border = '1px solid #e0e0e0';
        
        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `
            <strong>${habilidade.nome}</strong>
            ${habilidade.descricao ? `<br><span class="muted" style="font-size: 0.9em;">${habilidade.descricao}</span>` : ''}
        `;
        
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.className = 'btn small ghost';
        btnRemover.style.marginLeft = '10px';
        btnRemover.style.flexShrink = '0';
        btnRemover.onclick = () => removerHabilidade(habilidade.id);
        
        li.appendChild(infoDiv);
        li.appendChild(btnRemover);
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
            // Recarregar tudo para garantir sincronização
            await carregarMinhasHabilidades();
            await carregarHabilidades();
            calcularCompatibilidade();
            select.value = '';
        } else {
            const errorText = await response.text();
            alert('Erro ao adicionar habilidade: ' + errorText);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar habilidade: ' + error.message);
    }
}

async function removerHabilidade(habilidadeId) {
    if (!confirm('Tem certeza que deseja remover esta habilidade?')) {
        return;
    }
    
    try {
        const response = await fetch('/myapp/api/vagas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=remover-habilidade&habilidade_id=${habilidadeId}`
        });
        
        if (response.ok) {
            alert('Habilidade removida com sucesso!');
            // Recarregar tudo para garantir sincronização
            await carregarMinhasHabilidades();
            await carregarHabilidades();
            calcularCompatibilidade();
        } else {
            const errorText = await response.text();
            alert('Erro ao remover habilidade: ' + errorText);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao remover habilidade: ' + error.message);
    }
}

function abrirGerenciarHabilidades() {
    document.getElementById('modalHabilidades').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalHabilidades').classList.add('hidden');
}

function sair() {
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