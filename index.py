from flask import Flask, render_template, request, jsonify
from static.python.hessiana_cobb_douglas import generar_hessiana
from static.python.hessiana_cobb_douglas import generar_hessiana_con
from static.python.bordeado_cobb_douglas import generar_matriz_bordeada
from static.python.bordeado_cobb_douglas import calcular_determinante_bordeado
from static.python.menores_principales_cobb_douglas import calcular_hessiana
from static.python.menores_principales_cobb_douglas import menores_principales
from static.python.cobb_douglas_sin import calcular_cobb_douglas
from static.python.cobb_douglas_con import calcular_cobb_douglas_restriccion
from static.python.generate_plots_example import generate_plots_example
from static.python.generate_plots_example import generate_plots_example_derivadas

app = Flask(__name__)

@app.route('/')
def principal():
    return render_template('index.html')

@app.route('/teoria')
def teoria():
    listaExponentes = (1, 2, 3, 4, 5)
    # Generar el gráfico
    img_str = generate_plots_example()
    img_str_derv = generate_plots_example_derivadas()
    return render_template('informacion.html', exponentes=listaExponentes, plot_image=img_str, plot_image_derv=img_str_derv)

@app.route('/formulario')
def formulario():
    return render_template('formulario.html')

@app.route('/referencias')
def referencias():
    return render_template('referencias.html')

# Calcular la Hessiana en formato latex
@app.route('/calcular_hessiana', methods=['GET'])
def calcular_hessiana_endpoint():
    n = int(request.args.get('n', 2))  # Obtener el número de variables desde el parámetro de la URL
    hessiana_latex = generar_hessiana(n)  # Llamar a la función generar_hessiana
    hessiana_latex_con = generar_hessiana_con(n)
    return jsonify({'hessiana': hessiana_latex, 'hessiana_con': hessiana_latex_con}) 

# Calcular el determinante bordeado en formato latex
@app.route('/calcular_det_bordeado', methods=['GET'])
def calcular_bordeado_endpoint():
    n = int(request.args.get('n', 2))  # Obtener el número de variables desde el parámetro de la URL
    hessiana_matriz_bordeada = generar_matriz_bordeada(n)
    determinante_bordeado = calcular_determinante_bordeado(n)
    return jsonify({'hessiana_bordeada': hessiana_matriz_bordeada, 'determinante_bordeado': determinante_bordeado}) 

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

@app.route('/calcular_cobb_douglas_con_presupuesto', methods=['POST'])
def calcular_cobb_douglas_restriccion_endpoint():
    try:
        data = request.json
        A = data['A']
        n = data['n']
        exponentes = data['exponentes']
        precios = data['precios']
        presupuesto = data['presupuesto']
        resultados = calcular_cobb_douglas_restriccion(A, n, exponentes, precios, presupuesto)
        
        return jsonify(resultados)
    

    except Exception as e:
        print(f"Error al calcular Cobb-Douglas: {e}")
        return jsonify({"error": "Error interno del servidor"}), 500

#Iniciar app

if __name__ == '__main__': #Condicional de que si la aplicación ejecutada se coincide al nombre de la aplicación
    app.run('127.0.0.1', 5000, debug=True) #Método que inicia la app con la dirección, puertos y modo de argumentos
