@echo off
REM Script para iniciar o servidor da aplicação

echo Iniciando X-PANSIVO...
echo.

cd /d %~dp0

REM Ativar ambiente virtual se existir
if exist .venv\Scripts\activate.bat (
    echo Ativando ambiente virtual...
    call .venv\Scripts\activate.bat
)

REM Instalar dependências
echo Instalando dependências...
pip install -r requirements.txt

REM Iniciar servidor
echo.
echo Iniciando servidor Flask...
python main.py

pause
