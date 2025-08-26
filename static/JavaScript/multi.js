let tempoRestante = 60; // Tempo de 60 segundos
let tempoInterval;
let acertos = 0; // Contador de acertos
let operacaoAtual; // Guarda a operação atual
let contadorDePreparo = 3; // Contador de 3 segundos para preparação
let penalizacaoAtiva = false; // Verifica se a penalização está ativa
let errosConsecutivos = 0; // Contador de erros consecutivos
let errosTotais = 0; // Contador de erros totais

// Função para iniciar o jogo
function iniciarJogo() {
    // Esconde o botão "Iniciar"
    document.getElementById('start').style.display = 'none';

    // Mostra a mensagem de preparação
    document.getElementById('mensagem-preparo').innerHTML = `${contadorDePreparo}`;

    // Torna o campo de resposta invisível durante a contagem de preparo
    document.getElementById('resposta').style.display = 'none';
    document.getElementById('resposta').disabled = true; // Desabilita o campo

    // Inicia o contador de 3 segundos
    let preparoInterval = setInterval(function() {
        contadorDePreparo--; // Decrementa o contador
        document.getElementById('mensagem-preparo').innerHTML = `${contadorDePreparo}`;

        if (contadorDePreparo <= 0) {
            // Quando o contador chegar a zero, inicia o jogo
            clearInterval(preparoInterval); // Para o contador
            document.getElementById('mensagem-preparo').innerHTML = ''; // Limpa a mensagem de preparação

            // Exibe a tela do jogo
            document.getElementById('preparo').style.display = 'none'; // Esconde a tela de preparo
            document.getElementById('jogo').style.display = 'block'; // Torna a tela do jogo visível
            document.getElementById('resposta').style.display = 'block'; // Torna o campo de resposta visível
            document.getElementById('resposta').disabled = false; // Habilita o campo de resposta
            document.getElementById('resposta').focus(); // Dá o foco ao campo de resposta
            iniciarJogoReal(); // Chama a função para iniciar o jogo de verdade
        }
    }, 1000); // Atualiza a cada 1 segundo
}

// Função real para iniciar o jogo
function iniciarJogoReal() {
    // Reinicia variáveis
    acertos = 0;
    tempoRestante = 60;
    errosConsecutivos = 0; // Reseta o contador de erros consecutivos

    // Atualiza a interface
    document.getElementById('resultado').innerHTML = `Acertos: ${acertos}`; // Exibe o número de acertos logo no início
    document.getElementById('tempo').innerHTML = 'Tempo: ' + tempoRestante + 's'; // Exibe o tempo inicial

    // Inicia o cronômetro
    tempoInterval = setInterval(atualizarTempo, 1000);

    // Gera a primeira operação
    gerarNovaOperacao();
}

// Função para atualizar o cronômetro
function atualizarTempo() {
    if (tempoRestante > 0) {
        tempoRestante--; // Decrementa o tempo
        document.getElementById('tempo').innerHTML = 'Tempo: ' + tempoRestante + 's'; // Atualiza o tempo na tela
    } else if (tempoRestante <= 0) {
        // Quando o tempo acabar
        clearInterval(tempoInterval); // Para o cronômetro
        finalizarJogo(); // Chama a função para finalizar o jogo
    }
}

// Função para gerar uma nova operação
function gerarNovaOperacao() {
    let num1 = Math.floor(Math.random() * 10) + 1; // Gera o primeiro número (1 a 10)
    let num2 = Math.floor(Math.random() * 10) + 1; // Gera o segundo número (1 a 10)
    operacaoAtual = num1 * num2; // Calcula a operação

    // Exibe a operação na tela
    document.getElementById('operacao').innerHTML = `${num1} x ${num2} = ?`;

    // Limpa o campo de resposta
    document.getElementById('resposta').value = ''; // Limpa o campo de resposta

    // Habilita a captura de evento no campo de resposta
    document.getElementById('resposta').onkeyup = function(event) {
        if (event.key === 'Enter') {
            verificarResposta(); // Verifica a resposta quando pressionar Enter
        }
    };
}

// Função para verificar a resposta
function verificarResposta() {
    let respostaUsuario = document.getElementById('resposta').value; // Pega a resposta digitada

    // Se a resposta estiver correta
    if (parseInt(respostaUsuario) === operacaoAtual) {
        acertos++; // Incrementa o contador de acertos
        document.getElementById('resultado').innerHTML = `Acertos: ${acertos}`; // Atualiza o número de acertos
        errosConsecutivos = 0; // Reseta o contador de erros consecutivos
        gerarNovaOperacao(); // Gera uma nova operação
        document.getElementById('mensagem-jogo').innerHTML = ''; // Limpa qualquer mensagem de erro anterior
    } else {
        // Se a resposta estiver errada
        errosTotais++; // Incrementa o contador de erros totais
        errosConsecutivos++; // Incrementa o contador de erros consecutivos
        document.getElementById('mensagem-jogo').innerHTML = 'Você errou! Tente novamente.'; // Exibe a mensagem de erro
        document.getElementById('resposta').value = ''; // Limpa o campo de resposta imediatamente após o erro
        if (errosConsecutivos >= 2) {
            penalizarJogador(); // Aplica a penalização após 2 erros consecutivos
        }
    }
}

// Função para aplicar penalização de 2 segundos
function penalizarJogador() {
    if (!penalizacaoAtiva) {
        penalizacaoAtiva = true; // Ativa a penalização
        document.getElementById('mensagem-jogo').innerHTML = 'Você errou duas vezes seguidas! Penalização ativada.';

        // Desabilita o campo de resposta durante a penalização
        document.getElementById('resposta').disabled = true;

        // Limpa o valor do campo de resposta assim que o erro for cometido
        document.getElementById('resposta').value = ''; // Apaga o valor da resposta

        // Após 2 segundos, reabilita o campo de resposta e desativa a penalização
        setTimeout(function() {
            penalizacaoAtiva = false; // Desativa a penalização
            document.getElementById('mensagem-jogo').innerHTML = ''; // Limpa a mensagem
            document.getElementById('resposta').disabled = false; // Habilita o campo novamente
            document.getElementById('resposta').focus(); // Dá o foco ao campo de resposta
        }, 2000); // Penalização dura 2 segundos

        errosConsecutivos = 0; // Reseta o contador de erros consecutivos após a penalização
    }
}

// Função para finalizar o jogo quando o tempo acabar
function finalizarJogo() {
    clearInterval(tempoInterval); // Para o cronômetro

    // Exibe o número total de erros no final do jogo (primeiro os erros)
    document.getElementById('resultado-final').innerHTML = `Você cometeu ${errosTotais} erros.`;

    // Exibe a mensagem com acertos (deve aparecer abaixo dos erros)
    document.getElementById('resultado').innerHTML = `Parabéns! Você completou o jogo com ${acertos} acertos.`;

    // Esconde o campo de resposta ao finalizar o jogo
    document.getElementById('resposta').style.display = 'none'; // O campo de resposta some
    document.getElementById('resposta').disabled = true; // Desabilita o campo

    // Exibe o painel de estatísticas
    document.getElementById('fim').style.display = 'block';

    // Esconde a operação atual
    document.getElementById('operacao').innerHTML = '';
    document.getElementById('tempo').innerHTML = 'Tempo: 0s'; // Atualiza o tempo na tela
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    // Esconde o painel de estatísticas
    document.getElementById('fim').style.display = 'none';
    document.getElementById('mensagem-jogo').innerHTML = '';

    // Reinicia o contador de tempo e variáveis
    acertos = 0;
    tempoRestante = 60;
    contadorDePreparo = 3;
    errosConsecutivos = 0; // Reseta o contador de erros consecutivos

    // Esconde a tela do jogo
    document.getElementById('jogo').style.display = 'none';

    // Exibe a tela de preparo (inicia o contador de 3 segundos)
    document.getElementById('preparo').style.display = 'block';
    document.getElementById('mensagem-preparo').innerHTML = `${contadorDePreparo}`;

    // Inicia o contador de 3 segundos para preparação
    let preparoInterval = setInterval(function() {
        contadorDePreparo--; // Decrementa o contador
        document.getElementById('mensagem-preparo').innerHTML = `${contadorDePreparo}`;

        if (contadorDePreparo <= 0) {
            // Quando o contador chegar a zero, inicia o jogo
            clearInterval(preparoInterval); // Para o contador
            document.getElementById('mensagem-preparo').innerHTML = ''; // Limpa a mensagem de preparação

            // Exibe a tela do jogo
            document.getElementById('preparo').style.display = 'none'; // Esconde a tela de preparo
            document.getElementById('jogo').style.display = 'block'; // Torna a tela do jogo visível
            document.getElementById('resposta').style.display = 'block'; // Torna o campo de resposta visível
            document.getElementById('resposta').disabled = false; // Habilita o campo de resposta
            document.getElementById('resposta').focus(); // Dá o foco ao campo de resposta
            iniciarJogoReal(); // Chama a função para iniciar o jogo de verdade
        }
    }, 1000); // Atualiza a cada 1 segundo
}
