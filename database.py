import sqlite3
from datetime import datetime
import os

DB_PATH = 'xpansivo.db'

def get_connection():
    """Retorna uma conexão com o banco de dados"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Inicializa o banco de dados com as tabelas necessárias"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Tabela de jogadores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS jogadores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE NOT NULL,
            acertos_totais INTEGER DEFAULT 0,
            erros_totais INTEGER DEFAULT 0,
            data_criacao TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de partidas (histórico de jogos)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS partidas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jogador_id INTEGER NOT NULL,
            acertos INTEGER NOT NULL,
            erros INTEGER NOT NULL,
            operacao TEXT NOT NULL,
            data_partida TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (jogador_id) REFERENCES jogadores (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def criar_ou_obter_jogador(nome):
    """Cria um novo jogador ou retorna um existente"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verifica se jogador existe
    cursor.execute('SELECT id FROM jogadores WHERE nome = ?', (nome,))
    jogador = cursor.fetchone()
    
    if jogador:
        conn.close()
        return jogador['id']
    
    # Cria novo jogador
    cursor.execute('''
        INSERT INTO jogadores (nome, acertos_totais, erros_totais)
        VALUES (?, 0, 0)
    ''', (nome,))
    conn.commit()
    jogador_id = cursor.lastrowid
    conn.close()
    
    return jogador_id

def salvar_partida(jogador_id, acertos, erros, operacao='multiplicacao'):
    """Salva uma partida no banco de dados e atualiza totais do jogador"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Insere a partida
    cursor.execute('''
        INSERT INTO partidas (jogador_id, acertos, erros, operacao)
        VALUES (?, ?, ?, ?)
    ''', (jogador_id, acertos, erros, operacao))
    
    # Atualiza totais do jogador
    cursor.execute('''
        UPDATE jogadores 
        SET acertos_totais = acertos_totais + ?,
            erros_totais = erros_totais + ?
        WHERE id = ?
    ''', (acertos, erros, jogador_id))
    
    conn.commit()
    conn.close()

def obter_ranking_geral():
    """Retorna o ranking geral de todos os jogadores"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT nome, acertos_totais, erros_totais, data_criacao
        FROM jogadores
        ORDER BY acertos_totais DESC
        LIMIT 10
    ''')
    
    ranking = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in ranking]

def obter_ranking_dia():
    """Retorna o ranking do dia (últimas 24 horas)"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT 
            j.nome,
            SUM(p.acertos) as acertos_dia,
            SUM(p.erros) as erros_dia,
            COUNT(p.id) as partidas_dia
        FROM jogadores j
        LEFT JOIN partidas p ON j.id = p.jogador_id 
            AND datetime(p.data_partida) >= datetime('now', '-1 day')
        GROUP BY j.id, j.nome
        HAVING acertos_dia > 0
        ORDER BY acertos_dia DESC
        LIMIT 10
    ''')
    
    ranking = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in ranking]

def obter_stats_jogador(nome):
    """Retorna as estatísticas de um jogador específico"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, nome, acertos_totais, erros_totais, data_criacao
        FROM jogadores
        WHERE nome = ?
    ''', (nome,))
    
    jogador = cursor.fetchone()
    conn.close()
    
    return dict(jogador) if jogador else None

def listar_partidas_jogador(nome, limite=10):
    """Lista as últimas partidas de um jogador"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT p.acertos, p.erros, p.operacao, p.data_partida
        FROM partidas p
        JOIN jogadores j ON p.jogador_id = j.id
        WHERE j.nome = ?
        ORDER BY p.data_partida DESC
        LIMIT ?
    ''', (nome, limite))
    
    partidas = cursor.fetchall()
    conn.close()
    
    return [dict(row) for row in partidas]
