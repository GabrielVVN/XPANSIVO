from flask import Flask, render_template, request, jsonify, session
import os
from database import (
    init_database, criar_ou_obter_jogador, salvar_partida, 
    obter_ranking_geral, obter_ranking_dia, obter_stats_jogador,
    listar_partidas_jogador
)

app = Flask(__name__)
app.secret_key = 'xpansivo_secret_key_2025'  # Mudar em produção

# Inicializa o banco de dados ao iniciar a app
init_database()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/multiplicacao')
def multiplicacao():
    return render_template('multiplicacao.html')


@app.route('/divisao')
def divisao():
    return render_template('divisao.html')


@app.route('/adicao')
def adicao():
    return render_template('adicao.html')


@app.route('/subtracao')
def subtracao():
    return render_template('subtracao.html')


# ==================== ROTAS DA API ====================

@app.route('/api/jogador/login', methods=['POST'])
def login_jogador():
    """Registra ou faz login de um jogador"""
    data = request.get_json()
    nome = data.get('nome', '').strip()
    
    if not nome or len(nome) < 2:
        return jsonify({'erro': 'Nome deve ter pelo menos 2 caracteres'}), 400
    
    if len(nome) > 50:
        return jsonify({'erro': 'Nome muito longo (máximo 50 caracteres)'}), 400
    
    try:
        jogador_id = criar_ou_obter_jogador(nome)
        session['jogador_id'] = jogador_id
        session['jogador_nome'] = nome
        
        stats = obter_stats_jogador(nome)
        
        return jsonify({
            'sucesso': True,
            'jogador_id': jogador_id,
            'nome': nome,
            'acertos_totais': stats['acertos_totais'],
            'erros_totais': stats['erros_totais']
        })
    except Exception as e:
        return jsonify({'erro': f'Erro ao registrar jogador: {str(e)}'}), 500


@app.route('/api/jogador/logout', methods=['POST'])
def logout_jogador():
    """Faz logout do jogador"""
    session.clear()
    return jsonify({'sucesso': True})


@app.route('/api/partida/salvar', methods=['POST'])
def salvar_resultado():
    """Salva o resultado de uma partida"""
    data = request.get_json()
    jogador_id = session.get('jogador_id')
    
    if not jogador_id:
        return jsonify({'erro': 'Jogador não autenticado'}), 401
    
    acertos = data.get('acertos', 0)
    erros = data.get('erros', 0)
    operacao = data.get('operacao', 'multiplicacao')
    
    try:
        salvar_partida(jogador_id, acertos, erros, operacao)
        return jsonify({'sucesso': True, 'mensagem': 'Partida salva com sucesso'})
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/api/ranking/geral')
def get_ranking_geral():
    """Retorna o ranking geral"""
    try:
        ranking = obter_ranking_geral()
        return jsonify(ranking)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/api/ranking/dia')
def get_ranking_dia():
    """Retorna o ranking do dia"""
    try:
        ranking = obter_ranking_dia()
        return jsonify(ranking)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/api/jogador/<nome>/stats')
def get_stats_jogador(nome):
    """Retorna as estatísticas de um jogador"""
    try:
        stats = obter_stats_jogador(nome)
        if not stats:
            return jsonify({'erro': 'Jogador não encontrado'}), 404
        return jsonify(stats)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


@app.route('/api/jogador/<nome>/partidas')
def get_partidas_jogador(nome):
    """Retorna o histórico de partidas de um jogador"""
    try:
        partidas = listar_partidas_jogador(nome)
        return jsonify(partidas)
    except Exception as e:
        return jsonify({'erro': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)
