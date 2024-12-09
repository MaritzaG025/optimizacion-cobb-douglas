import sympy as sp
from sympy import Matrix, symbols, diff, latex, det
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import io
import base64
plt.rcParams['text.usetex'] = True

def calcular_derivadas_parciales(A, n, exponentes, precios, presupuesto):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Definir lambda (multiplicador de Lagrange)
    lambd = sp.symbols('lambda')
    
    # Función Cobb-Douglas
    f = A * sp.prod([variables[i]**exponentes[i] for i in range(n)])

    # Función de costos
    c = sp.Add(*[precios[i]*variables[i] for i in range(n)]) 

    # Función lagrangiana
    g = f - lambd * (c - presupuesto)
    
    # Calcular derivadas parciales
    derivadas = [sp.diff(g, var) for var in variables]  # Derivadas respecto a las variables x primero
    derivada_lambda = sp.diff(g, lambd)                # Derivada respecto a lambda

    # Convertir a LaTeX con notación de derivada parcial
    derivadas_latex = []
    for i, derivada in enumerate(derivadas):
        derivada = sp.N(derivada, 2)  # Redondeo
        formula = sp.latex(derivada)
        variable = sp.latex(variables[i])
        derivada_latex = f'\\frac{{\\partial \\psi}}{{\\partial {variable}}} = {formula} \\ \\ '
        derivadas_latex.append(derivada_latex)
    
    # Convertir derivada de lambda a LaTeX
    formula_lambda = sp.latex(derivada_lambda)
    derivada_lambda_latex = f'\\frac{{\\partial \\psi}}{{\\partial \\lambda}} = {formula_lambda} \\ \\ '

    # Agregar la derivada con respecto a lambda al final de la lista
    derivadas_latex.append(derivada_lambda_latex)

    return derivadas_latex

def encontrar_puntos_criticos(tecno_var, n, exponentes, precios, presupuesto):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Definir lambda (multiplicador de Lagrange)
    lambd = sp.symbols('lambda')
    
    # Función Cobb-Douglas
    f = tecno_var * sp.prod([variables[i]**exponentes[i] for i in range(n)])

    # Función de costos
    c = sp.Add(*[precios[i]*variables[i] for i in range(n)]) 

    # Función lagrangiana
    g = f - lambd * (c - presupuesto)
    
    # Calcular la suma de exponentes
    suma_alpha = sum(exponentes)

    # Calcular X_i para cada i
    X = []
    for i in range(n):
        X_i = (exponentes[i] * presupuesto) / (precios[i] * suma_alpha)
        X.append(round(X_i, 2))  # Aproximar a 2 decimales

    # Formatear resultados en LaTeX
    puntos_criticos_latex = r'\begin{align*}'
    for i in range(n):
        puntos_criticos_latex += (
            f'\\hat{{x_{{{i+1}}}}} & \\approx {X[i]:.2f} \\\\'
        )
    puntos_criticos_latex += r'\end{align*}'

    return puntos_criticos_latex

def calcular_determinante_bordeado(A, n, exponentes, precios, presupuesto):
    # Definir las variables
    w = sp.symbols(f'w1:{n + 1}')
    x = sp.symbols(f'x1:{n + 1}')
    
    # Crear la función Cobb-Douglas
    f = A * sp.prod([x[i]**exponentes[i] for i in range(n)])
    
    # Calcular el factor del determinante
    factor = (-1)**n * (f)**(n - 1) * sp.prod([exponentes[i] / x[i]**2 for i in range(n)])
    
    # Sumar términos para el determinante
    sumatoria = 0
    for i in range(n):
        inner_sum = 0
        for j in range(i + 1, n):
            inner_sum += (x[i]**2 * x[j]**2) / (exponentes[i] * exponentes[j]) * ((precios[i] * exponentes[j] / x[j]) - (precios[j] * exponentes[i] / x[i]))**2
        sumatoria += (precios[i]**2 * x[i]**2 / exponentes[i]) - inner_sum
    
    # Determinante final
    determinante = sumatoria
    
    # Reemplazar las variables x
    suma_exponentes = sum(exponentes)
    for i in range(n):
        determinante = determinante.subs(x[i], (exponentes[i] * presupuesto) / (precios[i] * suma_exponentes))
    
    # Formatear resultados en LaTeX
    determinante_latex = sp.latex(round(determinante, 2))
    factor_latex = sp.latex(factor)
    
    # Crear el resultado en LaTeX
    resultado_latex = r'\begin{align*}'
    resultado_latex += f"|\\Delta_{{{n}}}| & = {factor_latex} \\left[ {determinante_latex} \\right] \\\\"
    resultado_latex += r'\end{align*}'

    return resultado_latex

def calcular_determinante_bordeado_evaluado(tecno_var, n, exponentes, precios, presupuesto):
    # Definir las variables
    w = sp.symbols(f'w1:{n + 1}')
    x = sp.symbols(f'x1:{n + 1}')

    # Crear la función Cobb-Douglas
    f = tecno_var * sp.prod([x[i]**exponentes[i] for i in range(n)])

    # Calcular el factor del determinante
    factor = (-1)**n * (f)**(n - 1) * sp.prod([exponentes[i] / x[i]**2 for i in range(n)])

    # Sumar términos para el determinante
    sumatoria = 0
    for i in range(n):
        inner_sum = 0
        for j in range(i + 1, n):
            inner_sum += (x[i]**2 * x[j]**2) / (exponentes[i] * exponentes[j]) * ((precios[i] * exponentes[j] / x[j]) - (precios[j] * exponentes[i] / x[i]))**2
        sumatoria += (precios[i]**2 * x[i]**2 / exponentes[i]) - inner_sum

    # Determinante final
    determinante = sumatoria

    # Calcular X_i para cada i
    suma_exponentes = sum(exponentes)
    x_optimo = [(exponentes[i] * presupuesto) / (precios[i] * suma_exponentes) for i in range(n)]

    # Reemplazar las variables x en el determinante con x_optimo
    for i in range(n):
        determinante = determinante.subs(x[i], x_optimo[i])

    # Evaluar el determinante numéricamente
    determinante_evaluado = determinante.evalf()

    # Verificar si el determinante es complejo
    if sp.im(determinante_evaluado) != 0 or sp.re(determinante_evaluado) == 0:
        return "No se puede clasificar el punto óptimo."

    # Multiplicar por el factor
    resultado_final = factor.subs(tecno_var, 1).subs({x[i]: x_optimo[i] for i in range(n)}).evalf() * determinante_evaluado

    # Calcular (-1)^n
    signo = (-1) ** n
    resultado_det_final = signo * round(resultado_final, 2)
    # Clasificación
    clasificacion = ""
    if resultado_det_final.is_real:
        if resultado_det_final > 0:
            clasificacion = " > 0 "
        elif resultado_det_final < 0:
            clasificacion = " < 0 "
        else:
            clasificacion = " = 0 "
    else:
        clasificacion = " \\\\ \\text{  No se puede clasificar (resultado imaginario).} "

    det_evaluado = sp.latex(sp.N(resultado_det_final, 2))
    evaluar_x_latex = sp.latex(round(resultado_final, 2))

    # Crear el resultado en LaTeX
    resultado_latex = f"(-1)^{{{n}}} \\cdot |\\Delta_{{{n}}}| \\approx (-1)^{{{n}}} \\cdot \\left[ {evaluar_x_latex} \\right] \\approx {det_evaluado} {clasificacion} "

    return resultado_latex, clasificacion

def evaluar_puntos_criticos(tecno_var, n, exponentes, precios, presupuesto):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Definir lambda (multiplicador de Lagrange)
    lambd = sp.symbols('lambda')
    
    # Función Cobb-Douglas
    f = tecno_var * sp.prod([variables[i]**exponentes[i] for i in range(n)])

    # Función de costos
    c = sp.Add(*[precios[i]*variables[i] for i in range(n)]) 

    # Función lagrangiana
    g = f - lambd * (c - presupuesto)
    
    # Calcular la suma de exponentes
    suma_alpha = sum(exponentes)

    # Calcular X_i para cada i
    X = []
    for i in range(n):
        X_i = (exponentes[i] * presupuesto) / (precios[i] * suma_alpha)
        X.append(round(X_i, 2))  # Aproximar a 2 decimales
    print(f"Puntos críticos (X): {X}")  # Debug

    # Crear un diccionario de sustituciones
    subs_dict = {variables[i]: X[i] for i in range(n)}

    # Evaluar las funciones en los puntos críticos
    try:
        f_valor = f.subs(subs_dict).evalf()
        print(f"f_evaluado: {round(f_valor, 2)}")  # Debug
        g_valor = g.subs(subs_dict).evalf()
        c_valor = c.subs(subs_dict).evalf()
    except Exception as e:
        print(f"Error al evaluar las funciones: {e}")
        return None, None, None, None

    # Verificar si el determinante es complejo
    if sp.im(f_valor) != 0 or sp.re(f_valor) == 0:
        return "No se puede evaluar el punto óptimo."
    # Formatear resultados en LaTeX
    # resultados_latex = r'\\begin{align*}'
    resultados_latex = f'\\ {round(f_valor, 2)} \\'
    # resultados_latex += f'g(\\hat{{x}}) & = {g_valor:.2f} \\'
    # resultados_latex += f'c(\\hat{{x}}) & = {c_valor:.2f} \\'
    # resultados_latex += r'\\end{align*}'

    return resultados_latex

def def_evaluar_hessiana(tecno_var, n, exponentes, precios, presupuesto):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Definir lambda (multiplicador de Lagrange)
    lambd = sp.symbols('lambda')
    
    # Función Cobb-Douglas
    f = tecno_var * sp.prod([variables[i]**exponentes[i] for i in range(n)])

    # Función de costos
    c = sp.Add(*[precios[i]*variables[i] for i in range(n)]) 

    # Función lagrangiana
    g = f - lambd * (c - presupuesto)
    
    # Calcular la suma de exponentes
    suma_alpha = sum(exponentes)

    # Calcular X_i para cada i (puntos críticos)
    X = []
    for i in range(n):
        X_i = (exponentes[i] * presupuesto) / (precios[i] * suma_alpha)
        X.append(X_i)
    
    # Calcular la matriz Hessiana
    hessiana = sp.hessian(g, variables)
    
    try:
        # Evaluar la Hessiana en los puntos críticos
        valores_criticos = {variables[i]: X[i] for i in range(n)}
        hessiana_evaluada = hessiana.subs(valores_criticos)
        
        # Determinar la naturaleza de la Hessiana
        n_variables = len(variables)
        menores_principales = []
        for k in range(1, n_variables + 1):
            menor = hessiana_evaluada[:k, :k]
            menor_det = menor.det()
            menores_principales.append(menor_det)

        # Clasificar la matriz Hessiana
        es_definida_positiva = all(det > 0 for det in menores_principales)
        es_definida_negativa = all(det < 0 for det in menores_principales)
        es_semidefinida_positiva = all(det >= 0 for det in menores_principales)
        es_semidefinida_negativa = all(det <= 0 for det in menores_principales)
        
        if es_definida_positiva:
            tipo = "definida positiva"
        elif es_definida_negativa:
            tipo = "definida negativa"
        elif es_semidefinida_positiva:
            tipo = "semidefinida positiva"
        elif es_semidefinida_negativa:
            tipo = "semidefinida negativa"
        else:
            tipo = "indefinida"

    except Exception as e:
        # Si hay un error en la evaluación, se clasifica como indefinida
        tipo = "indefinida"
    
    return tipo


# Función Cobb-Douglas
def cobb_douglas(A, exponents, variables):
    """Calcula la función Cobb-Douglas para variables simbólicas o numéricas.
    Si A es 1, no se incluye en el cálculo."""
    if A == 1:
        A = 1  # No se incluye en el cálculo si A es 1
    
    if isinstance(variables[0], sp.Basic):  # Variables simbólicas
        if len(variables) != len(exponents):
            raise ValueError("El número de variables no coincide con el número de exponentes.")
        return A * sp.prod([variables[i]**exponents[i] for i in range(len(exponents))])
    else:  # Variables numéricas
        if len(variables) != len(exponents):
            raise ValueError("El número de variables no coincide con el número de exponentes.")
        return A * np.prod([variables[i]**exponents[i] for i in range(len(exponents))], axis=0)

# Función Cobb-Douglas
def cobb_douglas(A, exponents, variables):
    """Calcula la función Cobb-Douglas para una o más variables.
    Si A es 1, no se incluye en el cálculo."""
    if A == 1:
        A = 1  # No se incluye en el cálculo si A es 1
    
    # Calculamos la función para el número adecuado de variables y exponentes
    return A * np.prod([variables[i]**exponents[i] for i in range(len(variables))], axis=0)

def plot_1_variable(A, n, exponents, precios, presupuesto):
    # Verificar que los exponentes y precios son lo suficientemente largos para las variables
    if len(exponents) != n:
        raise ValueError(f"El número de exponentes debe ser igual a n. Se esperaba {n} exponentes, pero se recibieron {len(exponents)}.")
    if len(precios) != n:
        raise ValueError(f"El número de precios debe ser igual a n. Se esperaba {n} precios, pero se recibieron {len(precios)}.")

    # Definir los valores para x y la restricción presupuestaria
    x = np.linspace(0.1, 2, 100)  # Valores de x (para una sola variable)
    
    # Función Cobb-Douglas
    y = cobb_douglas(A, exponents, [x])
    
    # Gráfico 1: Función Cobb-Douglas con restricción presupuestaria de igualdad
    plt.figure()  
    plt.plot(x, y)
    # Título condicional: si A es 1, no mostrar A
    if A == 1:
        title = f'Figura 1: Gráfico de la función Cobb-Douglas con restricción presupuestaria $f(x_1) = x_1^{{{exponents[0]}}}$'
    else:
        title = f'Figura 1: Gráfico de la función Cobb-Douglas con restricción presupuestaria $f(x_1) = {A} x_1^{{{exponents[0]}}}$'
    
    # Ajustar el título para que pueda ocupar más de una línea si es largo
    plt.title(title, fontsize=10, wrap=True)  # Puedes cambiar el tamaño de la fuente si es necesario
    plt.xlabel('$x$')
    plt.ylabel('$f(x)$')

    # Agregar la restricción presupuestaria de igualdad
    x_restriccion = presupuesto / precios[0]
    
    # Convertir x_restriccion a una cadena con formato adecuado para LaTeX
    x_restriccion_latex = sp.latex(sp.Rational(presupuesto, precios[0]))
    
    # Etiqueta en LaTeX con el valor de x_restriccion formateado
    plt.axvline(x=x_restriccion, color='red', linestyle='--', label=f'Restricción: $x_1 = {x_restriccion_latex}$')
    plt.legend()
    
    # Guardar gráfico 1 en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph1 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 2: Función Cobb-Douglas sin restricción presupuestaria
    plt.figure()
    plt.plot(x, y)
    if A == 1:
        title2 = f'Figura 2: Gráfico de la función Cobb-Douglas $f(x_1) = x_1^{{{exponents[0]}}}$'
    else:
        title2 = f'Figura 2: Gráfico de la función Cobb-Douglas $f(x_1) = {A} x_1^{{{exponents[0]}}}$'
    plt.title(title2, fontsize=10, wrap=True)
    plt.xlabel('$x$')
    plt.ylabel('$f(x)$')

    # Guardar gráfico 2 en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph2 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 3: Función lineal de restricción presupuestaria
    plt.figure()
    
    if len(precios) > 1:  # Asegurarse de que hay más de un precio para x_2
        x2_vals = (presupuesto - precios[0] * x) / precios[1]
        plt.plot(x, x2_vals, label="Restricción presupuestaria", linestyle='--')
        plt.title(f'Figura 3: Función lineal de restricción presupuestaria', fontsize=10)
        plt.xlabel('$x_1$')
        plt.ylabel('$x_2$')
        plt.legend()

    else:  # Si solo hay un precio, ajustamos la restricción según una sola variable
        x2_vals = presupuesto / precios[0] - x
        plt.plot(x, x2_vals, label="Restricción presupuestaria", linestyle='--')
        plt.title(f'Figura 3: Restricción presupuestaria con un precio', fontsize=10)
        plt.xlabel('$x_1$')
        plt.ylabel('$x_2$')
        plt.legend()

    # Guardar gráfico 3 en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph3 = base64.b64encode(buffer.read()).decode('utf-8')

    return graph1, graph2, graph3  # Devolver los tres gráficos

def cobb_douglas_2d(A, exponents, x_vals, y_vals):
    """ Función Cobb-Douglas para dos variables """
    return A * (x_vals**exponents[0]) * (y_vals**exponents[1])

def plot_2_variables(A, n, exponents, precios, presupuesto):
    # Verificar que los exponentes y precios son lo suficientemente largos para las variables
    if len(exponents) != n:
        raise ValueError(f"El número de exponentes debe ser igual a n. Se esperaba {n} exponentes, pero se recibieron {len(exponents)}.")
    if len(precios) != n:
        raise ValueError(f"El número de precios debe ser igual a n. Se esperaba {n} precios, pero se recibieron {len(precios)}.")

    # Definir los valores para x y y (de 0.1 a 2 para ambas)
    x_vals = np.linspace(0.1, 2, 100)
    y_vals = np.linspace(0.1, 2, 100)
    X, Y = np.meshgrid(x_vals, y_vals)
    
    # Calcular Z para la función Cobb-Douglas
    Z = cobb_douglas_2d(A, exponents, X, Y)
    
    # Figura 1: Gráfico 3D con la restricción
    fig = plt.figure(figsize=(10, 7))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X, Y, Z, cmap='cool', alpha=0.7)

    # Ajustar el ángulo de la vista para mejor visualización
    ax.view_init(elev=30, azim=45)  # Ajuste de ángulo
    
    # Agregar la restricción presupuestaria
    x_restriccion = presupuesto / precios[0]
    y_restriccion = presupuesto / precios[1]
    
    ax.plot_surface(x_restriccion, y_restriccion, Z, color='r', alpha=0.7, label=f'Restricción: $x_1 = {x_restriccion}, x_2 = {y_restriccion}$')

    # No mostrar A si A es igual a 1
    A_str = f"{A}" if A != 1 else ""

    ax.set_title(f'Figura 1: Gráficos de la función Cobb-Douglas\n$f(x_1, x_2) = {A_str} x_1^{{{exponents[0]}}} x_2^{{{exponents[1]}}}$\ncon restricción  $c(x_1, x_2) = {precios[0]}x_1 + {precios[1]}x_2 = {presupuesto}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_2$')
    ax.set_zlabel('$f(x_1, x_2)$')
    
    # Guardar Figura 1 en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph1 = base64.b64encode(buffer.read()).decode('utf-8')

    # Figura 2: Gráfico 3D solo de la función Cobb-Douglas
    fig = plt.figure(figsize=(10, 7))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X, Y, Z, cmap='cool', alpha=0.7)

    # Ajustar el ángulo de la vista para mejor visualización
    ax.view_init(elev=30, azim=45)  # Ajuste de ángulo

    ax.set_title(f'Figura 2: Gráficos de la función Cobb-Douglas $f(x_1, x_2) = {A_str} x_1^{{{exponents[0]}}} x_2^{{{exponents[1]}}}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_2$')
    ax.set_zlabel('$f(x_1, x_2)$')

    # Guardar Figura 2 en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph2 = base64.b64encode(buffer.read()).decode('utf-8')

    # Figura 3: Gráfico de la restricción presupuestaria
    fig = plt.figure(figsize=(10, 7))
    ax = fig.add_subplot(111, projection='3d')
    # Para simplificar, utilizamos la restricción de la forma lineal
    x_vals = np.linspace(0.1, 2, 100)
    y_vals = (presupuesto - precios[0] * x_vals) / precios[1]
    
    X, Y = np.meshgrid(x_vals, y_vals)
    ax.plot_surface(X, Y, Z, cmap='cool', alpha=0.7, label="Restricción presupuestaria")
    
    # Ajustar el ángulo de la vista para mejor visualización
    ax.view_init(elev=30, azim=45)  # Ajuste de ángulo
    
    # Usar los valores de los precios directamente en el título
    ax.set_title(f'Figura 3: Gráfico de la restricción presupuestaria $x_2 = \\frac{{{presupuesto} - {precios[0]} x_1}}{{{precios[1]}}}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_2$')
    ax.set_zlabel('$f(x_1, x_2)$')

    # Guardar Figura 3 en base64
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph3 = base64.b64encode(buffer.read()).decode('utf-8')

    return graph1, graph2, graph3  # Devolver los tres gráficos

def cobb_douglas_3d(A, exponents, X, Y, presupuesto, precios):
    # Calcular x_3 usando la restricción presupuestaria
    x_3 = (presupuesto - precios[0] * X - precios[1] * Y) / precios[2]
    
    # Evitar valores negativos o nulos para x_3
    x_3 = np.maximum(x_3, 0)
    
    # Calcular la función Cobb-Douglas con 3 variables
    Z = A * (X**exponents[0]) * (Y**exponents[1]) * (x_3**exponents[2])
    return Z

def plot_3_variables(A, n, exponents, precios, presupuesto):
    # Verificar que los exponentes y precios sean lo suficientemente largos para las variables
    if len(exponents) != n:
        raise ValueError(f"El número de exponentes debe ser igual a n. Se esperaba {n} exponentes, pero se recibieron {len(exponents)}.")
    if len(precios) != n:
        raise ValueError(f"El número de precios debe ser igual a n. Se esperaban {n} precios, pero se recibieron {len(precios)}.")

    # Definir los valores para x1 y x2 (de 0.1 a 2 para ambas)
    x_vals = np.linspace(0.1, 2, 100)
    y_vals = np.linspace(0.1, 2, 100)
    X, Y = np.meshgrid(x_vals, y_vals)

    # 1. Calcular Z para la función Cobb-Douglas con la restricción presupuestaria en función de las tres variables
    Z_con_restriccion = cobb_douglas_3d(A, exponents, X, Y, presupuesto, precios)

    # 2. Calcular Z para la función Cobb-Douglas sin la restricción presupuestaria
    Z_sin_restriccion = A * (X**exponents[0]) * (Y**exponents[1]) * (X**exponents[2])

    # 3. Calcular la restricción presupuestaria
    x_restriccion = np.linspace(0, presupuesto / precios[0], 100)
    y_restriccion = np.linspace(0, presupuesto / precios[1], 100)
    X_restriccion, Y_restriccion = np.meshgrid(x_restriccion, y_restriccion)
    Z_restriccion = (presupuesto - precios[0] * X_restriccion - precios[1] * Y_restriccion) / precios[2]

    # Función para generar y devolver gráficos individuales en formato base64
    def create_graph(X, Y, Z, title, xlabel, ylabel, zlabel):
        fig = plt.figure(figsize=(7, 5))
        ax = fig.add_subplot(111, projection='3d')
        ax.plot_surface(X, Y, Z, cmap='cool', alpha=0.7)
        ax.set_title(title, fontsize=10, wrap=True)  # Ajustar título con salto de línea
        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)
        ax.set_zlabel(zlabel)
        ax.view_init(elev=25, azim=45)  # Ajustar ángulo de vista para mejorar la visualización
        
        buffer = io.BytesIO()
        plt.tight_layout()
        plt.savefig(buffer, format='png')
        plt.close()
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')
    
    # No mostrar A si A es igual a 1
    A_str = f"{A}" if A != 1 else ""

    # Títulos con la expresión de la función mejorados y valores ajustados
    title1 = f"Figura 1: Función Cobb-Douglas con Restricción Presupuestaria: \n $f(x_1, x_2, x_3) = {A_str} \cdot x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}}$"
    title2 = f"Figura 2: Función Cobb-Douglas\nsin Restricción: $f(x_1, x_2, x_3) = {A_str} \cdot x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}}$"
    title3 = f"Figura 3: Restricción Presupuestaria\n$x_3 = \\frac{{{presupuesto} - {precios[0]} \cdot x_1 - {precios[1]} \cdot x_2}}{{{precios[2]}}}$"

    # Generar los gráficos por separado
    graph1 = create_graph(X, Y, Z_con_restriccion, title1, '$x_1$', '$x_2$', '$f(x_1, x_2, x_3)$')
    graph2 = create_graph(X, Y, Z_sin_restriccion, title2, '$x_1$', '$x_2$', '$f(x_1, x_2, x_3)$')
    graph3 = create_graph(X_restriccion, Y_restriccion, Z_restriccion, title3, '$x_1$', '$x_2$', '$x_3$')

    return graph1, graph2, graph3

def cobb_douglas_4d(A, exponents, X, Y, presupuesto, precios):
    # Calcular x_3 con valor 1 y x_4 en términos de x_1, x_2 y x_3 (con x_3 = 1)
    x_3 = np.ones_like(X)  # x_3 es 1 en todos los puntos
    x_4 = (presupuesto - precios[0] * X - precios[1] * Y - precios[2] * x_3) / precios[3]
    
    # Evitar valores negativos o nulos para x_4
    x_4 = np.maximum(x_4, 0)
    
    # Calcular la función Cobb-Douglas con 4 variables
    Z = A * (X**exponents[0]) * (Y**exponents[1]) * (x_3**exponents[2]) * (x_4**exponents[3])
    return Z

def plot_4_variables(A, n, exponents, precios, presupuesto):
    # Verificar que los exponentes y precios sean lo suficientemente largos para las variables
    if len(exponents) != n:
        raise ValueError(f"El número de exponentes debe ser igual a n. Se esperaba {n} exponentes, pero se recibieron {len(exponents)}.")
    if len(precios) != n:
        raise ValueError(f"El número de precios debe ser igual a n. Se esperaban {n} precios, pero se recibieron {len(precios)}.")

    # Definir los valores para x1 y x2 (de 0.1 a 2 para ambas)
    x_vals = np.linspace(0.1, 2, 100)
    y_vals = np.linspace(0.1, 2, 100)
    X, Y = np.meshgrid(x_vals, y_vals)

    # 1. Calcular Z para la función Cobb-Douglas con la restricción presupuestaria en función de las cuatro variables
    Z_con_restriccion = cobb_douglas_4d(A, exponents, X, Y, presupuesto, precios)

    # 2. Calcular Z para la función Cobb-Douglas sin la restricción presupuestaria
    Z_sin_restriccion = A * (X**exponents[0]) * (Y**exponents[1]) * (X**exponents[2]) * (X**exponents[3])

    # 3. Calcular la restricción presupuestaria
    x_restriccion = np.linspace(0, presupuesto / precios[0], 100)
    y_restriccion = np.linspace(0, presupuesto / precios[1], 100)
    X_restriccion, Y_restriccion = np.meshgrid(x_restriccion, y_restriccion)
    Z_restriccion = (presupuesto - precios[0] * X_restriccion - precios[1] * Y_restriccion) / precios[2]

    # Función para generar y devolver gráficos individuales en formato base64
    def create_graph(X, Y, Z, title, xlabel, ylabel, zlabel):
        fig = plt.figure(figsize=(7, 5))
        ax = fig.add_subplot(111, projection='3d')
        ax.plot_surface(X, Y, Z, cmap='cool', alpha=0.7)
        ax.set_title(title, fontsize=10, wrap=True)  # Ajustar título con salto de línea
        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)
        ax.set_zlabel(zlabel)
        ax.view_init(elev=25, azim=45)  # Ajustar ángulo de vista para mejorar la visualización
        
        buffer = io.BytesIO()
        plt.tight_layout()
        plt.savefig(buffer, format='png')
        plt.close()
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')
    
    # No mostrar A si A es igual a 1
    A_str = f"{A}" if A != 1 else ""

    # Títulos con la expresión de la función mejorados y valores ajustados
    title1 = f"Figura 1: Función Cobb-Douglas con Restricción Presupuestaria: \n $f(x_1, x_2, x_3=1, x_4) = {A_str} \cdot x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$ \n Con $x_3 = 1, x_4 = \\frac{{{presupuesto} - {precios[0]} \cdot x_1 - {precios[1]} \cdot x_2 - {precios[2]} \cdot x_3}}{{{precios[3]}}}$"
    title2 = f"Figura 2: Función Cobb-Douglas sin Restricción: \n $f(x_1, x_2, x_3=1, x_4) = {A_str} \cdot x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$"
    title3 = f"Figura 3: Restricción Presupuestaria \n $x_3 = 1, x_4 = \\frac{{{presupuesto} - {precios[0]} \cdot x_1 - {precios[1]} \cdot x_2 - {precios[2]} \cdot x_3}}{{{precios[3]}}}$"

    # Generar los gráficos por separado
    graph1 = create_graph(X, Y, Z_con_restriccion, title1, '$x_1$', '$x_2$', '$f(x_1, x_2, x_3, x_4)$')
    graph2 = create_graph(X, Y, Z_sin_restriccion, title2, '$x_1$', '$x_2$', '$f(x_1, x_2, x_3, x_4)$')
    graph3 = create_graph(X_restriccion, Y_restriccion, Z_restriccion, title3, '$x_1$', '$x_2$', '$x_4$')

    return graph1, graph2, graph3

def cobb_douglas_5d(A, exponents, X, Y, presupuesto, precios):
    # x_1 = 1, x_2 = 1, x_3 = X, x_4 = Y
    x_1 = np.ones_like(X)
    x_2 = np.ones_like(Y)
    x_3 = X  # x_3 será variable en función de X
    x_4 = Y  # x_4 será variable en función de Y
    
    # Calcular x_5 en términos de x_1, x_2, x_3, x_4
    x_5 = (presupuesto - precios[0] * x_1 - precios[1] * x_2 - precios[2] * x_3 - precios[3] * x_4) / precios[4]
    
    # Calcular la función Cobb-Douglas con 5 variables
    Z = A * (x_1**exponents[0]) * (x_2**exponents[1]) * (x_3**exponents[2]) * (x_4**exponents[3]) * (x_5**exponents[4])
    return Z

def plot_5_variables(A, n, exponents, precios, presupuesto):
    # Verificar que los exponentes y precios sean lo suficientemente largos para las variables
    if len(exponents) != n:
        raise ValueError(f"El número de exponentes debe ser igual a n. Se esperaba {n} exponentes, pero se recibieron {len(exponents)}.")
    if len(precios) != n:
        raise ValueError(f"El número de precios debe ser igual a n. Se esperaban {n} precios, pero se recibieron {len(precios)}.")

    # Definir los valores para x1 y x2 (de 0.1 a 2 para ambas)
    x_vals = np.linspace(0.1, 2, 100)
    y_vals = np.linspace(0.1, 2, 100)
    X, Y = np.meshgrid(x_vals, y_vals)

    # 1. Calcular Z para la función Cobb-Douglas con la restricción presupuestaria en función de las cinco variables
    Z_con_restriccion = cobb_douglas_5d(A, exponents, X, Y, presupuesto, precios)

    # 2. Calcular Z para la función Cobb-Douglas sin la restricción presupuestaria
    Z_sin_restriccion = A * (X**exponents[0]) * (Y**exponents[1]) * (X**exponents[2]) * (Y**exponents[3]) * (X**exponents[4])

    # 3. Calcular la restricción presupuestaria para x_5 en términos de x_1, x_2, x_3, x_4
    x_restriccion = np.linspace(0, presupuesto / precios[0], 100)
    y_restriccion = np.linspace(0, presupuesto / precios[1], 100)
    X_restriccion, Y_restriccion = np.meshgrid(x_restriccion, y_restriccion)
    Z_restriccion = (presupuesto - precios[0] * X_restriccion - precios[1] * Y_restriccion) / precios[2]

    # Función para generar y devolver gráficos individuales en formato base64
    def create_graph(X, Y, Z, title, xlabel, ylabel, zlabel):
        fig = plt.figure(figsize=(7, 5))
        ax = fig.add_subplot(111, projection='3d')
        ax.plot_surface(X, Y, Z, cmap='cool', alpha=0.7)
        ax.set_title(title, fontsize=10, wrap=True)  # Ajustar título con salto de línea
        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)
        ax.set_zlabel(zlabel)
        ax.view_init(elev=25, azim=45)  # Ajustar ángulo de vista para mejorar la visualización
        
        buffer = io.BytesIO()
        plt.tight_layout()
        plt.savefig(buffer, format='png')
        plt.close()
        buffer.seek(0)
        return base64.b64encode(buffer.read()).decode('utf-8')
    
    # No mostrar A si A es igual a 1
    A_str = f"{A}" if A != 1 else ""

    # Títulos con la expresión de la función mejorados y valores ajustados
    title1 = f"Figura 1: Función Cobb-Douglas con Restricción Presupuestaria: \n $f(x_1, x_2, x_3, x_4, x_5) = {A_str} \cdot x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}} \cdot x_5^{{{exponents[4]}}}$ \n Con $x_1 = 1, x_2 = 1, x_5 = \\frac{{{presupuesto} - {precios[0]} \cdot x_1 - {precios[1]} \cdot x_2 - {precios[2]} \cdot x_3 - {precios[3]} \cdot x_4}}{{{precios[4]}}}$"
    title2 = f"Figura 2: Función Cobb-Douglas sin Restricción: \n $f(x_1, x_2, x_3, x_4, x_5) = {A_str} \cdot x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}} \cdot x_5^{{{exponents[4]}}}$"
    title3 = f"Figura 3: Restricción Presupuestaria: \n $x_1 = 1, x_2 = 1, x_5 = \\frac{{{presupuesto} - {precios[0]} \cdot x_1 - {precios[1]} \cdot x_2 - {precios[2]} \cdot x_3 - {precios[3]} \cdot x_4}}{{{precios[4]}}}$"

    # Generar los gráficos por separado
    graph1 = create_graph(X, Y, Z_con_restriccion, title1, '$x_1$', '$x_2$', '$f(x_1, x_2, x_3, x_4, x_5)$')
    graph2 = create_graph(X, Y, Z_sin_restriccion, title2, '$x_1$', '$x_2$', '$f(x_1, x_2, x_3, x_4, x_5)$')
    graph3 = create_graph(X_restriccion, Y_restriccion, Z_restriccion, title3, '$x_1$', '$x_2$', '$x_5$')

    return graph1, graph2, graph3

def plot_n_variables(A, n, exponentes, precios, presupuesto):
    """
    Genera gráficos para 1, 2, 3, 4 y 5 variables.
    :param A: Parámetro A de la función Cobb-Douglas
    :param n: Número de variables (1, 2, 3, 4, 5)
    :param exponentes: Lista de exponentes
    :param precios: Lista de precios
    :param presupuesto: Parámetro c de la restricción presupuestaria
    :return: Lista de gráficos en formato base64
    """

    if isinstance(n, int) and 1 <= n <= 5:
        if n == 1:
            return plot_1_variable(A, n, exponentes, precios, presupuesto)
        elif n == 2:
            return plot_2_variables(A, n, exponentes, precios, presupuesto)
        elif n == 3:
            return plot_3_variables(A, n, exponentes, precios, presupuesto)
        elif n == 4:
            return plot_4_variables(A, n, exponentes, precios, presupuesto)
        elif n == 5:
            return plot_5_variables(A, n, exponentes, precios, presupuesto)
    else:
        raise ValueError("El valor de 'n' debe ser un entero entre 1 y 5.")

def calcular_cobb_douglas_restriccion(A, n, exponentes, precios, presupuesto):
    derivadas = calcular_derivadas_parciales(A, n, exponentes, precios, presupuesto)
    puntos_criticos = encontrar_puntos_criticos(A, n, exponentes, precios, presupuesto)
    det_bordeado = calcular_determinante_bordeado(A, n, exponentes, precios, presupuesto)   
    det_bordeado_evaluado = calcular_determinante_bordeado_evaluado(A, n, exponentes, precios, presupuesto)   
    valor_puntos_criticos = evaluar_puntos_criticos(A, n, exponentes, precios, presupuesto)
    def_hessiana_evaluada = def_evaluar_hessiana(A, n, exponentes, precios, presupuesto)
    generate_plots = plot_n_variables(A, n, exponentes, precios, presupuesto)
    
    return {
        "derivadas": derivadas,
        "puntos_criticos": puntos_criticos,
        "det_bordeado": det_bordeado,
        "det_bordeado_evaluado": det_bordeado_evaluado,
        "valor_puntos_criticos": valor_puntos_criticos,
        "hessiana_evaluada": def_hessiana_evaluada,
        "graficos": generate_plots
    }
