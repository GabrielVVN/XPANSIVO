// Variáveis globais de sessão
let jogadorAtual = null;
let errosConsecutivosGame = 0;

// Ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    verificarJogadorLogado();
    
    // Permitir Enter no input de nome
    const playerNameInput = document.getElementById('playerName');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginJogador();
            }
        });
        playerNameInput.focus();
    }
});

// Função de login
async function loginJogador() {
    const nome = document.getElementById('playerName').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const loginBtn = document.getElementById('loginBtn');
    
    // Limpar mensagem de erro
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
    
    // Validações
    if (!nome) {
        mostrarErro('Por favor, digite seu nome');
        return;
    }
    
    if (nome.length < 2) {
        mostrarErro('Nome deve ter pelo menos 2 caracteres');
        return;
    }
    
    // Desabilitar botão durante o envio
    loginBtn.disabled = true;
    loginBtn.textContent = 'Conectando...';
    
    try {
        const response = await fetch('/api/jogador/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: nome })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            mostrarErro(data.erro || 'Erro ao conectar');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar';
            return;
        }
        
        // Login bem-sucedido
        jogadorAtual = data;
        localStorage.setItem('jogadorAtual', JSON.stringify(data));
        
        // Mostrar informações do jogador
        exibirInfoJogador();
        
        // Esconder modal
        document.getElementById('loginModal').classList.remove('active');
        
        // Atualizar interface
        atualizarDisplayJogador();
        
    } catch (error) {
        console.error('Erro:', error);
        mostrarErro('Erro de conexão com o servidor');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Iniciar';
    }
}

// Função de logout
async function logoutJogador() {
    if (!confirm('Tem certeza que deseja sair?')) return;
    
    try {
        await fetch('/api/jogador/logout', {
            method: 'POST'
        });
        
        jogadorAtual = null;
        localStorage.removeItem('jogadorAtual');
        
        // Limpar campos
        document.getElementById('playerName').value = '';
        document.getElementById('errorMsg').textContent = '';
        document.getElementById('playerInfo').classList.remove('active');
        
        // Mostrar modal novamente
        document.getElementById('loginModal').classList.add('active');
        document.getElementById('playerName').focus();
        
        // Reset do jogo
        reiniciarJogo();
        
    } catch (error) {
        console.error('Erro no logout:', error);
        alert('Erro ao sair');
    }
}

// Verificar se jogador já está logado
async function verificarJogadorLogado() {
    const salvo = localStorage.getItem('jogadorAtual');
    if (salvo) {
        jogadorAtual = JSON.parse(salvo);
        document.getElementById('loginModal').classList.remove('active');
        atualizarDisplayJogador();
    }
}

// Exibir informações do jogador
function exibirInfoJogador() {
    const playerInfo = document.getElementById('playerInfo');
    document.getElementById('playerNameDisplay').textContent = jogadorAtual.nome;
    document.getElementById('playerScoreDisplay').textContent = jogadorAtual.acertos_totais;
    playerInfo.classList.add('active');
}

// Atualizar display do jogador
function atualizarDisplayJogador() {
    if (jogadorAtual) {
        document.getElementById('playerInfo').classList.add('active');
        document.getElementById('playerNameDisplay').textContent = jogadorAtual.nome;
        document.getElementById('playerScoreDisplay').textContent = jogadorAtual.acertos_totais;
    }
}

// Mostrar erro
function mostrarErro(mensagem) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = mensagem;
    errorMsg.classList.add('show');
}

// Salvar resultado da partida
async function salvarResultadoPartida(acertos, erros) {
    if (!jogadorAtual) {
        console.error('Jogador não autenticado');
        return;
    }
    
    try {
        const response = await fetch('/api/partida/salvar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                acertos: acertos,
                erros: erros,
                operacao: 'multiplicacao'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Atualizar stats do jogador localmente
            jogadorAtual.acertos_totais += acertos;
            jogadorAtual.erros_totais += erros;
            localStorage.setItem('jogadorAtual', JSON.stringify(jogadorAtual));
            atualizarDisplayJogador();
            console.log('Resultado salvo com sucesso!');
        } else {
            console.error('Erro ao salvar resultado:', data.erro);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Voltar para menu
function voltarParaMenu() {
    window.location.href = '/';
}
