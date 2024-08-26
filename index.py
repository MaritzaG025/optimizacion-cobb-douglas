import numpy as np
import sympy as sp
from flask import Flask, render_template, request, jsonify
from sympy import Matrix, symbols, det, latex
from matplotlib import pyplot as plt 
from static.python.hessiana_cobb_douglas import generar_hessiana
from static.python.menores_principales_cobb_douglas import calcular_hessiana
from static.python.menores_principales_cobb_douglas import menores_principales
from static.python.cobb_douglas_sin import calcular_cobb_douglas


app = Flask(__name__)

@app.route('/')
def principal():
    return render_template('index.html')

@app.route('/informacion')
def informacion():
    listaExponentes=(1,2,3,4,5)
    return render_template('informacion.html', exponentes=listaExponentes)

@app.route('/formulario')
def formulario():
    return render_template('formulario.html')

# Calcular la Hessiana en formato latex
@app.route('/calcular_hessiana', methods=['GET'])
def calcular_hessiana_endpoint():
    n = int(request.args.get('n', 2))  # Obtener el número de variables desde el parámetro de la URL
    hessiana_latex = generar_hessiana(n)  # Llamar a la función generar_hessiana
    return jsonify({'hessiana': hessiana_latex})  # Devolver la Hessiana en formato LaTeX como JSON

# Calcular los menores principales en formato latex
@app.route('/calcular_menores_principales', methods=['GET'])
def calcular_menores_principales():
    n = int(request.args.get('n', 2))
    hessiana = calcular_hessiana(n)
    menores = menores_principales(hessiana)
    
    return jsonify({'menores_principales': menores})

@app.route('/calcular_cobb_douglas', methods=['POST'])
def calcular_cobb_douglas_endpoint():
    try:
        data = request.json
        A = data['A']
        n = data['n']
        exponentes = data['exponentes']
        
        resultados = calcular_cobb_douglas(A, n, exponentes)
        
        return jsonify(resultados)
    except Exception as e:
        print(f"Error al calcular Cobb-Douglas: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500


#Iniciar app

if __name__ == '__main__': #Condicional de que si la aplicación ejecutada se coincide al nombre de la aplicación
    app.run('127.0.0.1', 5000, debug=True) #Método que inicia la app con la dirección, puertos y modo de argumentos
