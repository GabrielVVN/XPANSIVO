# 🎮 X-PANSIVO - Sistema com Banco de Dados Implementado

## ✅ O Que Foi Implementado

### 1. **Banco de Dados SQLite**
- ✅ Armazenamento de jogadores (nome, acertos totais, erros totais)
- ✅ Histórico de partidas (acertos, erros, tipo de operação, data/hora)
- ✅ Arquivo de banco: `xpansivo.db` (criado automaticamente)

### 2. **Sistema de Login**
- ✅ Modal que pede o nome do jogador ao acessar o jogo
- ✅ Se o jogador é novo, cria automaticamente
- ✅ Se já existe, carrega dados anteriores
- ✅ Botão de logout na navbar

### 3. **API REST - Endpoints**
```
POST   /api/jogador/login           → Login/Registro de jogador
POST   /api/jogador/logout          → Logout
POST   /api/partida/salvar          → Salva resultado da partida
GET    /api/ranking/geral           → Top 10 ranking geral
GET    /api/ranking/dia             → Top 10 ranking do dia (24h)
GET    /api/jogador/<nome>/stats    → Stats de um jogador
GET    /api/jogador/<nome>/partidas → Histórico de partidas
```

### 4. **Rankings**
- ✅ **Ranking Geral**: Mostra os 10 jogadores com mais acertos totais
- ✅ **Ranking do Dia**: Mostra os 10 melhores jogadores nas últimas 24h
- ✅ Atualização automática a cada 30 segundos
- ✅ Botões para alternar entre os dois rankings

### 5. **Operações Disponíveis**
- ✅ Multiplicação (já existia)
- ✅ Divisão
- ✅ Adição
- ✅ Subtração

Todas com sistema de login e salvamento no banco!

### 6. **Interface**
- ✅ Modal elegante de login
- ✅ Informações do jogador na navbar
- ✅ Tabela de ranking responsiva
- ✅ Design consistente com a paleta original

---

## 🚀 Como Usar

### **Passo 1: Instalar Dependências**
```bash
pip install -r requirements.txt
```

### **Passo 2: Executar o Servidor**
```bash
python main.py
```

Ou execute o script:
```bash
start.bat  # Windows
```

### **Passo 3: Acessar a Aplicação**
Abra no navegador: `http://localhost:3000`

### **Passo 4: Usar o Sistema**
1. Você verá um modal pedindo seu nome
2. Digite seu nome (2-50 caracteres)
3. Clique em "Iniciar"
4. Jogue normalmente!
5. Ao final, o resultado é salvo no banco

---

## 📊 Como Funciona o Ranking

### **Ranking Geral**
- Mostra TODOS os acertos que cada jogador já fez
- Atualiza quando alguém termina uma partida
- Ordena por maior número de acertos

### **Ranking do Dia**
- Mostra apenas as partidas das últimas 24 horas
- Cada jogador que jogou hoje aparece
- Se ninguém jogou, mostra "Nenhum resultado ainda"

---

## 📁 Estrutura de Arquivos

```
XPANSIVO/
├── main.py                    ← Servidor Flask (com API integrada)
├── database.py                ← Gerenciador do banco de dados
├── requirements.txt           ← Dependências Python
├── xpansivo.db               ← Banco de dados SQLite (criado automaticamente)
├── templates/
│   ├── index.html            ← Página inicial com rankings
│   ├── multiplicacao.html    ← Jogo de multiplicação
│   ├── divisao.html          ← Jogo de divisão
│   ├── adicao.html           ← Jogo de adição
│   └── subtracao.html        ← Jogo de subtração
├── static/
│   ├── JavaScript/
│   │   ├── script.js         ← JavaScript geral
│   │   ├── multi.js          ← Lógica dos jogos
│   │   └── login.js          ← Sistema de login e BD (NOVO)
│   └── Styles/
│       ├── styles.css
│       ├── operacoes.css
│       └── testimonials.css  ← Contém estilos do ranking
└── BANCO_DE_DADOS.md         ← Documentação completa
```

---

## 🔐 Dados Salvos no Banco

Cada vez que um jogador termina uma partida:

### **Tabela `jogadores`**
```
ID | Nome        | Acertos Totais | Erros Totais | Data Criação
1  | João Silva  | 250            | 15           | 2025-01-10 10:30:00
2  | Maria Costa | 180            | 22           | 2025-01-11 14:15:00
```

### **Tabela `partidas`**
```
ID | Jogador_ID | Acertos | Erros | Operação      | Data Partida
1  | 1          | 42      | 3     | multiplicacao | 2025-01-12 10:00:00
2  | 1          | 38      | 5     | multiplicacao | 2025-01-12 14:30:00
3  | 2          | 35      | 7     | divisao       | 2025-01-12 15:00:00
```

---

## 🎮 Fluxo de Uso - Exemplo

1. **Acesso ao Jogo**
   - Entra em `http://localhost:3000/multiplicacao`
   - Modal aparece pedindo nome

2. **Login/Registro**
   - Digite "João" → Sistema cria novo jogador
   - Próxima vez que João acessar, dados dele carregam

3. **Jogar**
   - Joga normalmente por 60 segundos
   - Acerta 42 e erra 3

4. **Resultado Salvo**
   - Ao final, enviado para o banco: `salvarResultadoPartida(42, 3)`
   - Acertos totais de João aumentam para 42
   - Ranking geral atualiza

5. **Visualizar Ranking**
   - Entra em `http://localhost:3000/`
   - Clica em "Classificações"
   - Vê João em posição no ranking!

---

## 💾 Persistência de Dados

- **Dados são salvos** quando a partida termina
- **Próximo login** carrega dados anteriores automaticamente
- **Banco persiste** mesmo fechando o servidor
- **Arquivo**: `xpansivo.db` na raiz do projeto

---

## 🛠️ Personalizações Possíveis

### Alterar tempo do jogo:
Em `multi.js`, `divisao.html`, etc:
```javascript
let tempoRestante = 60; // Mude para outro valor (em segundos)
```

### Mudar intervalo de atualização do ranking:
Em `index.html`:
```javascript
setInterval(() => { ... }, 30000); // Mude 30000 (30 seg) para outro valor em ms
```

### Adicionar mais operações:
1. Crie novo template em `templates/`
2. Adicione rota em `main.py`:
```python
@app.route('/potenciacao')
def potenciacao():
    return render_template('potenciacao.html')
```

---

## ⚠️ Importante

- O banco de dados é **LOCAL** (SQLite)
- Se deletar `xpansivo.db`, todos os dados são perdidos
- Para **backup**, copie `xpansivo.db` para outro local
- Em produção, considere usar PostgreSQL/MySQL

---

## 🐛 Troubleshooting

### Erro: "Could not find a version that satisfies the requirement requirements.txt"
Use: `pip install -r requirements.txt` (com o `-r`)

### Ranking não atualiza
- Verifique se a partida foi salva com sucesso
- Abra DevTools (F12) → Console para ver erros JavaScript

### Jogador não aparece no ranking
- Verifique se o nome foi digitado corretamente
- Confirme que o jogo foi completado (60 segundos)

### Banco de dados não criado
- Verifique permissões de escrita na pasta
- Tente executar o servidor novamente

---

## 📞 Suporte

Para dúvidas sobre o sistema de banco de dados, consulte `BANCO_DE_DADOS.md`

**Desenvolvido com ❤️ para X-PANSIVO 2025**
