from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def principal():
    return render_template('index.html')

@app.route('/informacion')
def informacion():
    listaExponentes=('alpha1', 'alpha2', 'alpha3', 'alpha4', 'alpha5', 'alpha6', 'alpha7', 'alpha8', 
    'alpha9', 'alpha10', 'alpha11', 'alpha12', 'alpha13', 'alpha14', 'alpha15')
    return render_template('informacion.html', exponentes=listaExponentes)


@app.route('/formulario')
def formulario():
    return render_template('formulario.html')

#Iniciar app

if __name__ == '__main__': #Condicional de que si la aplicación ejecutada se coincide al nombre de la aplicación
    app.run('127.0.0.1', 5000, debug=True) #Método que inicia la app con la dirección, puertos y modo de argumentos