from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template(
        'index.html'
    )  # Certifique-se de que o arquivo index.html está na pasta templates


@app.route('/multiplicacao')
def multiplicacao():
    return render_template(
        'multiplicacao.html'
    )  # Certifique-se de que o arquivo multiplicacao.html está na pasta templates


@app.route('/divisao')
def divisao():
    return render_template(
        'divisao.html'
    )  # Certifique-se de que o arquivo multiplicacao.html está na pasta templates


@app.route('/adicao')
def adicao():
    return render_template(
        'adicao.html'
    )  # Certifique-se de que o arquivo multiplicacao.html está na pasta templates


@app.route('/subtracao')
def subtracao():
    return render_template(
        'subtracao.html'
    )  # Certifique-se de que o arquivo multiplicacao.html está na pasta templates


if __name__ == '__main__':
    app.run(
        debug=True
    )  # Ativa o modo de debug para ajudar a detectar erros mais facilmente
