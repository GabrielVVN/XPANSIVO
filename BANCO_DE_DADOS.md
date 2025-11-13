# X-PANSIVO - Sistema de Banco de Dados

## 📋 Visão Geral

O sistema agora possui um banco de dados SQLite integrado que:
- Registra jogadores por nome
- Armazena histórico de partidas (acertos, erros, operação)
- Calcula rankings diários e gerais
- Mantém estatísticas individuais por jogador

## 🗄️ Estrutura do Banco de Dados

### Tabela: `jogadores`
- `id` - ID único do jogador (PK)
- `nome` - Nome do jogador (UNIQUE)
- `acertos_totais` - Total de acertos em todas as partidas
- `erros_totais` - Total de erros em todas as partidas
- `data_criacao` - Data em que o jogador foi criado

### Tabela: `partidas`
- `id` - ID único da partida (PK)
- `jogador_id` - Referência ao jogador (FK)
- `acertos` - Número de acertos nesta partida
- `erros` - Número de erros nesta partida
- `operacao` - Tipo de operação (ex: multiplicacao, divisao)
- `data_partida` - Data e hora da partida

## 🔌 API REST

### Autenticação

#### POST `/api/jogador/login`
Registra ou faz login de um jogador

**Request:**
```json
{
    "nome": "João Silva"
}
```

**Response:**
```json
{
    "sucesso": true,
    "jogador_id": 1,
    "nome": "João Silva",
    "acertos_totais": 150,
    "erros_totais": 25
}
```

#### POST `/api/jogador/logout`
Faz logout do jogador atual

### Partidas

#### POST `/api/partida/salvar`
Salva o resultado de uma partida

**Request:**
```json
{
    "acertos": 42,
    "erros": 3,
    "operacao": "multiplicacao"
}
```

**Response:**
```json
{
    "sucesso": true,
    "mensagem": "Partida salva com sucesso"
}
```

### Rankings

#### GET `/api/ranking/geral`
Retorna o ranking geral (top 10)

**Response:**
```json
[
    {
        "nome": "João Silva",
        "acertos_totais": 250,
        "erros_totais": 15,
        "data_criacao": "2025-01-10 10:30:00"
    }
]
```

#### GET `/api/ranking/dia`
Retorna o ranking do dia (últimas 24 horas)

**Response:**
```json
[
    {
        "nome": "João Silva",
        "acertos_dia": 45,
        "erros_dia": 2,
        "partidas_dia": 5
    }
]
```

### Estatísticas

#### GET `/api/jogador/<nome>/stats`
Retorna estatísticas de um jogador específico

#### GET `/api/jogador/<nome>/partidas`
Retorna histórico de partidas de um jogador

## 🎮 Fluxo de Funcionamento

1. **Login**: Ao acessar o jogo, uma modal pede o nome do jogador
   - Se é novo, cria uma entrada no banco
   - Se já existe, carrega dados existentes

2. **Durante o Jogo**: O sistema rastreia acertos e erros em tempo real

3. **Fim do Jogo**: Ao final, salva os resultados no banco

4. **Rankings**: Exibe:
   - Ranking Geral: Top 10 com mais acertos no total
   - Ranking do Dia: Top 10 com mais acertos nas últimas 24 horas

## 📦 Dependências

- Flask - Framework web
- Flask-Session - Gerenciamento de sessão
- SQLite3 - Banco de dados (incluído no Python)

## 🚀 Como Executar

### Windows:
```bash
# Execute o script start.bat
start.bat

# Ou manualmente:
pip install -r requirements.txt
python main.py
```

### Linux/Mac:
```bash
# Criar ambiente virtual
python -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar
python main.py
```

A aplicação estará disponível em: `http://localhost:3000`

## 📝 Funcionalidades Implementadas

✅ Sistema de login com nome do jogador
✅ Armazenamento de dados em banco SQLite
✅ Cálculo de acertos e erros por partida
✅ Ranking geral (todos os jogadores)
✅ Ranking diário (últimas 24h)
✅ Histórico de partidas por jogador
✅ Interface responsiva
✅ Atualização automática do ranking a cada 30s

## 🔐 Segurança

- Validação de nome (2-50 caracteres)
- Proteção contra SQL injection (usando prepared statements)
- Sessões do lado do servidor
- Chave secreta para sessão (alterar em produção)

## 🗂️ Banco de Dados

O banco de dados é armazenado como `xpansivo.db` na raiz do projeto:
```
XPANSIVO/
├── main.py
├── database.py
├── requirements.txt
├── xpansivo.db          ← Banco de dados SQLite
├── static/
├── templates/
└── ...
```

## 💡 Próximas Melhorias Sugeridas

- [ ] Adicionar mais operações (divisão, adição, subtração)
- [ ] Filtrar ranking por operação específica
- [ ] Exportar dados para CSV
- [ ] Gráficos de desempenho
- [ ] Sistema de badges/conquistas
- [ ] Multiplayer competitivo
- [ ] Autenticação com email/senha
- [ ] Backup automático do banco

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se o Flask está instalado: `pip show Flask`
2. Se o banco foi criado: procure por `xpansivo.db`
3. Console do navegador (F12) para erros JavaScript
4. Console do servidor Python para erros backend
