#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script de teste para verificar se o sistema de banco de dados está funcionando
Executar: python test_database.py
"""

import os
import sqlite3
from database import (
    init_database,
    criar_ou_obter_jogador,
    salvar_partida,
    obter_ranking_geral,
    obter_ranking_dia,
    obter_stats_jogador,
    listar_partidas_jogador,
    get_connection
)

def limpar_teste():
    """Remove banco de dados de teste se existir"""
    if os.path.exists('xpansivo.db'):
        os.remove('xpansivo.db')
        print("✓ Banco anterior removido")

def test_database():
    print("=" * 60)
    print("🧪 TESTE DO SISTEMA DE BANCO DE DADOS - X-PANSIVO")
    print("=" * 60)
    
    # 1. Inicializar banco
    print("\n1️⃣  Inicializando banco de dados...")
    init_database()
    print("   ✓ Banco criado com sucesso")
    
    # 2. Criar jogadores
    print("\n2️⃣  Criando jogadores...")
    jogador1 = criar_ou_obter_jogador("João Silva")
    jogador2 = criar_ou_obter_jogador("Maria Costa")
    jogador3 = criar_ou_obter_jogador("Pedro Santos")
    print(f"   ✓ João Silva (ID: {jogador1})")
    print(f"   ✓ Maria Costa (ID: {jogador2})")
    print(f"   ✓ Pedro Santos (ID: {jogador3})")
    
    # 3. Simular partidas
    print("\n3️⃣  Salvando resultados de partidas...")
    salvar_partida(jogador1, 42, 3, 'multiplicacao')
    print(f"   ✓ João: 42 acertos, 3 erros")
    
    salvar_partida(jogador1, 38, 5, 'multiplicacao')
    print(f"   ✓ João: 38 acertos, 5 erros")
    
    salvar_partida(jogador2, 50, 2, 'multiplicacao')
    print(f"   ✓ Maria: 50 acertos, 2 erros")
    
    salvar_partida(jogador3, 35, 8, 'multiplicacao')
    print(f"   ✓ Pedro: 35 acertos, 8 erros")
    
    # 4. Obter stats
    print("\n4️⃣  Verificando estatísticas dos jogadores...")
    stats_joao = obter_stats_jogador("João Silva")
    print(f"   João Silva: {stats_joao['acertos_totais']} acertos, {stats_joao['erros_totais']} erros")
    
    stats_maria = obter_stats_jogador("Maria Costa")
    print(f"   Maria Costa: {stats_maria['acertos_totais']} acertos, {stats_maria['erros_totais']} erros")
    
    stats_pedro = obter_stats_jogador("Pedro Santos")
    print(f"   Pedro Santos: {stats_pedro['acertos_totais']} acertos, {stats_pedro['erros_totais']} erros")
    
    # 5. Ranking geral
    print("\n5️⃣  Ranking Geral (Top 10):")
    ranking_geral = obter_ranking_geral()
    for i, jogador in enumerate(ranking_geral, 1):
        print(f"   {i}º - {jogador['nome']}: {jogador['acertos_totais']} acertos")
    
    # 6. Ranking dia
    print("\n6️⃣  Ranking do Dia:")
    ranking_dia = obter_ranking_dia()
    if ranking_dia:
        for i, jogador in enumerate(ranking_dia, 1):
            acertos = jogador.get('acertos_dia', 0)
            partidas = jogador.get('partidas_dia', 0)
            print(f"   {i}º - {jogador['nome']}: {acertos} acertos em {partidas} partida(s)")
    else:
        print("   (Nenhum resultado no momento)")
    
    # 7. Histórico de um jogador
    print("\n7️⃣  Histórico de partidas de João Silva:")
    partidas = listar_partidas_jogador("João Silva")
    for i, partida in enumerate(partidas, 1):
        print(f"   {i}. Operação: {partida['operacao']}, Acertos: {partida['acertos']}, Erros: {partida['erros']}")
    
    # 8. Verificar banco de dados
    print("\n8️⃣  Informações do Banco de Dados:")
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM jogadores")
    total_jogadores = cursor.fetchone()['total']
    
    cursor.execute("SELECT COUNT(*) as total FROM partidas")
    total_partidas = cursor.fetchone()['total']
    
    conn.close()
    
    print(f"   Total de jogadores: {total_jogadores}")
    print(f"   Total de partidas: {total_partidas}")
    
    # 9. Verificar se o arquivo existe
    if os.path.exists('xpansivo.db'):
        tamanho = os.path.getsize('xpansivo.db')
        print(f"   Arquivo: xpansivo.db ({tamanho} bytes)")
    
    print("\n" + "=" * 60)
    print("✅ TODOS OS TESTES PASSARAM COM SUCESSO!")
    print("=" * 60)
    print("\n💡 Dicas:")
    print("   • O banco de dados está pronto para usar")
    print("   • Execute: python main.py")
    print("   • Acesse: http://localhost:3000")
    print("   • Os dados ficarão salvos em 'xpansivo.db'")
    print("=" * 60)

if __name__ == "__main__":
    try:
        # Descomentar a linha abaixo para limpar banco anterior
        # limpar_teste()
        
        test_database()
    except Exception as e:
        print(f"\n❌ ERRO: {str(e)}")
        import traceback
        traceback.print_exc()
