import sympy as sp
from sympy import Matrix, symbols, diff, latex, det
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import io
import base64
from itertools import combinations
import itertools

def calcular_derivadas_parciales(A, n, exponentes):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Función Cobb-Douglas
    f = A * sp.prod([variables[i]**exponentes[i] for i in range(n)])
    
    # Calcular derivadas parciales
    derivadas = [sp.diff(f, var) for var in variables]
    
    # Convertir a LaTeX con notación de derivada parcial
    derivadas_latex = []
    for i, derivada in enumerate(derivadas):
        derivada = sp.N(derivada, 2)  # Redondeo
        formula = sp.latex(derivada)
        variable = sp.latex(variables[i])
        derivada_latex = f'\\frac{{\\partial f}}{{\\partial {variable}}} = {formula} \\ \\ '
        derivadas_latex.append(derivada_latex)
    
    return derivadas_latex

def encontrar_puntos_criticos(tecno_var, n, exponentes):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Función Cobb-Douglas
    f = tecno_var * sp.prod([variables[i]**exponentes[i] for i in range(n)])
    
    # Calcular derivadas parciales
    derivadas = [sp.diff(f, var) for var in variables]
    
    # Resolver el sistema de ecuaciones derivadas parciales = 0
    sistema_ecuaciones = [sp.Eq(derivada, 0) for derivada in derivadas]
    
    # Imprimir ecuaciones para verificación
    # print("Ecuaciones para puntos críticos:")
    # for eq in sistema_ecuaciones:
    #     print(sp.latex(eq))
    
    # Encontrar puntos críticos
    puntos_criticos = sp.solve(sistema_ecuaciones, variables, dict=True)
    
    # Verificar si se obtienen soluciones
    if not puntos_criticos:
        return ["\\text{No se encontraron puntos críticos.}"]
    
    # Convertir puntos críticos a LaTeX
    puntos_criticos_latex = []
    for punto in puntos_criticos:
        punto = {var: sp.N(valor, 2) for var, valor in punto.items()}  # Redondeo
        punto_latex = '\\ \\ o \\ \\ '.join([f'{sp.latex(var)} = {sp.latex(valor)}' for var, valor in punto.items()])
        puntos_criticos_latex.append(punto_latex)
    
    return puntos_criticos_latex

def calcular_hessiana(A, n, exponentes):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Función Cobb-Douglas
    f = A * sp.prod([variables[i]**exponentes[i] for i in range(n)])
    
    # Calcular la matriz Hessiana
    hessiana = sp.hessian(f, variables)
    hessiana = hessiana.applyfunc(lambda x: sp.N(x, 2)) 
    
    # Convertir a LaTeX
    hessiana_latex = sp.latex(hessiana)
    
    return hessiana_latex

def calcular_menores_principales(A, n, exponentes):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Función Cobb-Douglas
    f = A * sp.prod([variables[i]**exponentes[i] for i in range(n)])

    # Calcular derivadas parciales
    derivadas = [sp.diff(f, var) for var in variables]
    
    # Resolver el sistema de ecuaciones derivadas parciales = 0
    sistema_ecuaciones = [sp.Eq(derivada, 0) for derivada in derivadas]
    
    # Calcular la matriz Hessiana
    hessiana = sp.hessian(f, variables)
    hessiana = hessiana.applyfunc(lambda x: sp.N(x, 2)) 

    n = hessiana.shape[0]
    menores = []
    for k in range(1, n + 1):
        menores_k = []
        for i in range(n - k + 1):
            submatriz = hessiana[i:i+k, i:i+k]
            menor = submatriz.det()
            menor_factorizado = sp.factor(menor)
            menor_latex = latex(menor_factorizado)
            menores_k.append(menor_latex)
        menores.append(menores_k)
    return menores

def evaluar_en_puntos_criticos(A, n, exponentes):
    # Definir variables
    variables = sp.symbols(f'x1:{n+1}')
    
    # Función Cobb-Douglas
    f = A * sp.prod([variables[i]**exponentes[i] for i in range(n)])

    # Calcular derivadas parciales
    derivadas = [sp.diff(f, var) for var in variables]
    
    # Resolver el sistema de ecuaciones derivadas parciales = 0
    sistema_ecuaciones = [sp.Eq(derivada, 0) for derivada in derivadas]
    
    # Encontrar puntos críticos
    puntos_criticos = sp.solve(sistema_ecuaciones, variables, dict=True)
    
    # Verificar si se obtienen soluciones
    if not puntos_criticos:
        return ["\\text{N/A. No existen puntos críticos}"], []
    
    # Calcular la matriz Hessiana
    hessiana = sp.hessian(f, variables)
    hessiana = hessiana.applyfunc(lambda x: sp.N(x, 2)) 

    hessiana_evaluada = []
    menores_evaluados = []
    
    for punto in puntos_criticos:
        # Evaluar Hessiana en el punto crítico
        punto = {var: sp.N(valor, 2) for var, valor in punto.items()}  
        hessiana_punto = hessiana.subs(punto)
        
        # Asegurarse de que la Hessiana en el punto crítico esté bien definida
        hessiana_punto = hessiana_punto.applyfunc(lambda x: sp.N(x, 2))

        # Calcular menores principales
        n = hessiana_punto.shape[0]
        menores = []
        for k in range(1, n + 1):
            menores_k = []
            for i in range(n - k + 1):
                submatriz = hessiana_punto[i:i+k, i:i+k]
                try:
                    menor = submatriz.det()
                    # Convertir el determinante a texto adecuado
                    if menor == 0:
                        menor_latex = "\\text{0}"
                    else:
                        menor_latex = sp.latex(menor)
                except Exception as e:
                    print(f"Error al calcular el determinante de la submatriz {i}:{i+k}: {e}")
                    menor_latex = "\\text{Error}"
                menores_k.append(menor_latex)
            menores.append(menores_k)
        
        # Convertir la Hessiana a LaTeX
        hessiana_latex = sp.latex(hessiana_punto)
        hessiana_evaluada.append(hessiana_latex)

        # Convertir menores evaluados a LaTeX
        menores_evaluados_latex = []
        for k in range(len(menores)):
            menores_k_latex = [f'{menor}' for i, menor in enumerate(menores[k])]
            menores_evaluados_latex.append(menores_k_latex)
        
        menores_evaluados.append(menores_evaluados_latex)

        # menores_evaluados.append(menores)
    
    return hessiana_evaluada, menores_evaluados

# def generate_plots_example(A, n, exponentes):
#     # Limpiar las gráficas previas
#     plt.close('all')  # Cerrar todas las figuras abiertas

#     def generate_title(A, exponentes, fixed_vars, changing_vars, figure_number):
#         # Generar el título dinámico
#         var_expr = ' \\cdot '.join([f"x_{i+1}^{{{exp:.1f}}}" for i, exp in enumerate(exponentes)])
        
#         # Escapar cualquier símbolo '$' en LaTeX
#         var_expr = var_expr.replace('$', '\\$')  # Asegúrate de que '$' sea tratado correctamente

#         if fixed_vars:
#             fixed_expr = ', '.join([f"x_{var+1} = {val:.2f}" for var, val in fixed_vars.items()])
#             return f"Figura {figure_number}: Función de tipo Cobb-Douglas $f(x) = {var_expr}$ con {fixed_expr}, cambiando {', '.join([f'x_{var+1}' for var in changing_vars])}"
#         else:
#             return f"Figura {figure_number}: Función de tipo Cobb-Douglas $f(x) = {var_expr}$, cambiando {', '.join([f'x_{var+1}' for var in changing_vars])}"

#     graph_images = []
#     figure_number = 1  # Para numerar las figuras

#     # Reiniciar valores fijos para garantizar consistencia
#     fixed_values_dict = {}

#     # Generar gráficos para diferentes combinaciones de variables
#     combinations_vars = list(combinations(range(n), 2))  # Combos de dos variables

#     for combo in combinations_vars:
#         var1, var2 = combo

#         # Generar valores fijos para las variables no cambiantes
#         fixed_vars = {i: fixed_values_dict.get(i, random.uniform(0.1, 1)) for i in range(n) if i not in combo}
#         fixed_values_dict.update(fixed_vars)

#         # Crear el espacio de valores para las variables cambiantes
#         x = np.linspace(0.1, 1, 100)
#         y = np.linspace(0.1, 1, 100)
#         X, Y = np.meshgrid(x, y)

#         # Inicializar Z con el valor de A
#         Z = A
#         # Calcular Z según los exponentes y valores de las variables
#         for i in range(n):
#             if i == var1:
#                 Z *= X ** exponentes[i]
#             elif i == var2:
#                 Z *= Y ** exponentes[i]
#             else:
#                 Z *= fixed_vars[i] ** exponentes[i]

#         # Verificar si `Z` tiene valores válidos
#         if not np.any(np.isfinite(Z)):
#             print(f"Advertencia: Z no tiene valores válidos para la combinación {var1+1}, {var2+1}.")
#             continue

#         # Ajustar el ángulo del gráfico según los exponentes
#         elev_angle = 30 + sum(abs(exp) for exp in exponentes) * 0.2
#         azim_angle = 45

#         # Crear el gráfico
#         fig = plt.figure(figsize=(10, 7))
#         ax = fig.add_subplot(111, projection='3d')
#         ax.plot_surface(X, Y, Z, cmap='cool')
#         ax.set_xlabel(f'$x_{var1+1}$')
#         ax.set_ylabel(f'$x_{var2+1}$')
#         ax.set_zlabel('$f(x)$')
#         ax.view_init(elev=elev_angle, azim=azim_angle)

#         # Generar título
#         title = generate_title(A, exponentes, fixed_vars, [var1, var2], figure_number)
        
#         # Ajustar el título para que aparezca abajo del gráfico
#         plt.title(title, loc='center')

#         # Ajustar los márgenes para mover el título hacia abajo
#         plt.subplots_adjust(top=0.85, bottom=0.2)

#         # Asegurarse de que la figura se dibuje antes de guardarla
#         plt.draw()

#         # Guardar el gráfico como imagen base64
#         buffer = io.BytesIO()
#         plt.savefig(buffer, format='png')
#         plt.close(fig)  # Cerrar la figura después de guardarla
#         buffer.seek(0)
#         graph_images.append(base64.b64encode(buffer.read()).decode('utf-8'))

#         # Incrementar número de figura
#         figure_number += 1

#     return graph_images

def cobb_douglas(A, exponents, variables):
    """Calcula la función Cobb-Douglas para variables simbólicas o numéricas.
    Si A es 1, no se incluye en el cálculo."""
    if A == 1:
        A = 1  # No se incluye en el cálculo si A es 1
    if isinstance(variables[0], sp.Basic):  # Variables simbólicas
        return A * sp.prod([variables[i]**exponents[i] for i in range(len(exponents))])
    else:  # Variables numéricas
        return A * np.prod([variables[i]**exponents[i] for i in range(len(exponents))], axis=0)

def plot_1_variable(A, exponents):
    # Primer gráfico: la función Cobb-Douglas para una variable
    plt.figure()  # Inicia una nueva figura
    x = np.linspace(0.1, 2, 100)
    y = cobb_douglas(A, exponents, [x])  # Asegúrate de que cobb_douglas maneje este input
    plt.plot(x, y)
    # Título condicional: si A es 1, no mostrar A
    if A == 1:
        title = f'Figura 1: Gráfico de la función Cobb-Douglas $f(x_1) = x_1^{{{exponents[0]}}}$'
    else:
        title = f'Figura 1: Gráfico de la función Cobb-Douglas $f(x_1) = {A} x_1^{{{exponents[0]}}}$'
    plt.title(title)
    plt.xlabel('$x$')
    plt.ylabel('$f(x)$')
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph1 = base64.b64encode(buffer.read()).decode('utf-8')
    
    # Segundo gráfico: función Cobb-Douglas con un valor específico
    plt.figure()  # Inicia una nueva figura
    x_val = 1
    y_val = cobb_douglas(A, exponents, [x_val])
    plt.plot(x, y, label='Función Cobb-Douglas')
    plt.scatter(x_val, y_val, color='red', zorder=5)  # Marca el punto óptimo
    # Título con el valor específico de x
    plt.title(f'Figura 2: Valor en $x = {x_val}$, $f(x) = {y_val:.2f}$')
    plt.xlabel('$x$')
    plt.ylabel('$f(x)$')
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph2 = base64.b64encode(buffer.read()).decode('utf-8')

    # Tercer gráfico: Función Cobb-Douglas en 3D con un ángulo diferente
    fig = plt.figure()  # Inicia una nueva figura
    ax = fig.add_subplot(111, projection='3d')
    x = np.linspace(0.1, 2, 100)
    y = cobb_douglas(A, exponents, [x])
    ax.plot(x, y, zs=0, zdir='z', label='Función Cobb-Douglas')
    ax.scatter(x_val, y_val, zs=0, color='red', label=f'Valor en $x = {x_val}$')  # Marca el punto en 3D
    ax.set_title(f'Figura 3: Función Cobb-Douglas con ángulo diferente')
    ax.set_xlabel('$x$')
    ax.set_ylabel('$f(x)$')
    ax.set_zlabel('$f(x)$')
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph3 = base64.b64encode(buffer.read()).decode('utf-8')

    return graph1, graph2, graph3

def plot_2_variables(A, exponents):
    # Primer gráfico: Función Cobb-Douglas para 2 variables
    x1 = np.linspace(0.1, 2, 50)
    x2 = np.linspace(0.1, 2, 50)
    X1, X2 = np.meshgrid(x1, x2)
    Z = cobb_douglas(A, exponents, [X1, X2])
    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X2, Z, cmap='cool')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_2$')
    ax.set_zlabel('$f(x_1, x_2)$')
    # Ajustar espacio y título en la parte superior
    fig.subplots_adjust(top=0.85)  # Dejar más espacio en la parte superior

    # Título condicional: si A es 1, no mostrar A
    if A == 1:
        title = f'Figura 1: Gráfico de la función Cobb-Douglas $f(x_1, x_2) = x_1^{{{exponents[0]}}} \\cdot x_2^{{{exponents[1]}}}$'
    else:
        title = f'Figura 1: Gráfico de la función Cobb-Douglas $f(x_1, x_2) = {A} x_1^{{{exponents[0]}}} \\cdot x_2^{{{exponents[1]}}}$'

    fig.text(0.5, 0.95, title, ha='center', va='center', fontsize=10)
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph1 = base64.b64encode(buffer.read()).decode('utf-8')

    # Segundo gráfico: Función Cobb-Douglas con x1 fijo
    x1_val = 1  # Fijamos x1 en un valor
    Z2 = cobb_douglas(A, exponents, [np.full_like(x2, x1_val), x2])
    fig2, ax2 = plt.subplots(figsize=(8, 6))
    ax2.plot(x2, Z2)
    ax2.set_xlabel('$x_2$')
    ax2.set_ylabel('$f(x_1, x_2)$')
    # Ajustar título en la parte superior
    fig2.subplots_adjust(top=0.85)  # Dejar más espacio en la parte superior

    # Título condicional: si A es 1, no mostrar A
    if A == 1:
        title2 = f'Figura 2: Gráfico de la función Cobb-Douglas $f(x_1, x_2) = x_1^{{{exponents[0]}}} \\cdot x_2^{{{exponents[1]}}}$ con $x_1 = {x1_val}$ fijo'
    else:
        title2 = f'Figura 2: Gráfico de la función Cobb-Douglas $f(x_1, x_2) = {A} x_1^{{{exponents[0]}}} \\cdot x_2^{{{exponents[1]}}}$ con $x_1 = {x1_val}$ fijo'

    fig2.text(0.5, 0.95, title2, ha='center', va='center', fontsize=10)
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph2 = base64.b64encode(buffer.read()).decode('utf-8')

    # Tercer gráfico: Función Cobb-Douglas con x2 fijo
    x2_val = 1  # Fijamos x2 en un valor
    Z3 = cobb_douglas(A, exponents, [x1, np.full_like(x1, x2_val)])
    fig3, ax3 = plt.subplots(figsize=(8, 6))
    ax3.plot(x1, Z3)
    ax3.set_xlabel('$x_1$')
    ax3.set_ylabel('$f(x_1, x_2)$')
    # Ajustar título en la parte superior
    fig3.subplots_adjust(top=0.85)  # Dejar más espacio en la parte superior

    # Título condicional: si A es 1, no mostrar A
    if A == 1:
        title3 = f'Figura 3: Gráfico de la función Cobb-Douglas $f(x_1, x_2) = x_1^{{{exponents[0]}}} \\cdot x_2^{{{exponents[1]}}}$ con $x_2 = {x2_val}$ fijo'
    else:
        title3 = f'Figura 3: Gráfico de la función Cobb-Douglas $f(x_1, x_2) = {A} x_1^{{{exponents[0]}}} \\cdot x_2^{{{exponents[1]}}}$ con $x_2 = {x2_val}$ fijo'

    fig3.text(0.5, 0.95, title3, ha='center', va='center', fontsize=10)
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph3 = base64.b64encode(buffer.read()).decode('utf-8')

    return graph1, graph2, graph3

def plot_3_variables(A, exponents):
    # Validación de A
    if A == 1:
        A_str = ""  # No mostrar A si es 1
    else:
        A_str = f"{A} \cdot"  # Mostrar A si es diferente de 1

    # Gráfico 1: x1 fija, x2 y x3 mapeadas
    x2 = np.linspace(0.1, 2, 50)
    x3 = np.linspace(0.1, 2, 50)
    X2, X3 = np.meshgrid(x2, x3)
    x1_val = 1
    Z1 = cobb_douglas(A, exponents, [np.full_like(X2, x1_val), X2, X3])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X2, X3, Z1, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 1: $f(x_1, x_2, x_3) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}}$\nCon $x_1 = {x1_val}$')
    ax.set_xlabel('$x_2$')
    ax.set_ylabel('$x_3$')
    ax.set_zlabel('$f(x_1, x_2, x_3)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph1 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 2: x2 fija, x1 y x3 mapeadas
    x1 = np.linspace(0.1, 2, 50)
    x3 = np.linspace(0.1, 2, 50)
    X1, X3 = np.meshgrid(x1, x3)
    x2_val = 1
    Z2 = cobb_douglas(A, exponents, [X1, np.full_like(X1, x2_val), X3])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X3, Z2, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 2: $f(x_1, x_2, x_3) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}}$\nCon $x_2 = {x2_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_3$')
    ax.set_zlabel('$f(x_1, x_2, x_3)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph2 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 3: x3 fija, x1 y x2 mapeadas
    x1 = np.linspace(0.1, 2, 50)
    x2 = np.linspace(0.1, 2, 50)
    X1, X2 = np.meshgrid(x1, x2)
    x3_val = 1
    Z3 = cobb_douglas(A, exponents, [X1, X2, np.full_like(X1, x3_val)])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X2, Z3, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 3: $f(x_1, x_2, x_3) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}}$\nCon $x_3 = {x3_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_2$')
    ax.set_zlabel('$f(x_1, x_2, x_3)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph3 = base64.b64encode(buffer.read()).decode('utf-8')

    return graph1, graph2, graph3

def plot_4_variables(A, exponents):
    # Validación de A
    if A == 1:
        A_str = ""  # No mostrar A si es 1
    else:
        A_str = f"{A} \cdot"  # Mostrar A si es diferente de 1

    # Gráfico 1: x1 y x2 fijas, x3 y x4 mapeadas
    x3 = np.linspace(0.1, 2, 50)
    x4 = np.linspace(0.1, 2, 50)
    X3, X4 = np.meshgrid(x3, x4)
    x1_val, x2_val = 1, 1
    Z1 = cobb_douglas(A, exponents, [np.full_like(X3, x1_val), np.full_like(X3, x2_val), X3, X4])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X3, X4, Z1, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 1: $f(x_1, x_2, x_3, x_4) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$\nCon $x_1 = {x1_val}$ y $x_2 = {x2_val}$')
    ax.set_xlabel('$x_3$')
    ax.set_ylabel('$x_4$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph1 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 2: x1 y x3 fijas, x2 y x4 mapeadas
    x2 = np.linspace(0.1, 2, 50)
    x4 = np.linspace(0.1, 2, 50)
    X2, X4 = np.meshgrid(x2, x4)
    x1_val, x3_val = 1, 1
    Z2 = cobb_douglas(A, exponents, [np.full_like(X2, x1_val), X2, np.full_like(X2, x3_val), X4])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X2, X4, Z2, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 2: $f(x_1, x_2, x_3, x_4) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$\nCon $x_1 = {x1_val}$ y $x_3 = {x3_val}$')
    ax.set_xlabel('$x_2$')
    ax.set_ylabel('$x_4$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph2 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 3: x1 y x4 fijas, x2 y x3 mapeadas
    x2 = np.linspace(0.1, 2, 50)
    x3 = np.linspace(0.1, 2, 50)
    X2, X3 = np.meshgrid(x2, x3)
    x1_val, x4_val = 1, 1
    Z3 = cobb_douglas(A, exponents, [np.full_like(X2, x1_val), X2, X3, np.full_like(X2, x4_val)])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X2, X3, Z3, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 3: $f(x_1, x_2, x_3, x_4) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$\nCon $x_1 = {x1_val}$ y $x_4 = {x4_val}$')
    ax.set_xlabel('$x_2$')
    ax.set_ylabel('$x_3$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph3 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 4: x2 y x3 fijas, x1 y x4 mapeadas
    x1 = np.linspace(0.1, 2, 50)
    x4 = np.linspace(0.1, 2, 50)
    X1, X4 = np.meshgrid(x1, x4)
    x2_val, x3_val = 1, 1
    Z4 = cobb_douglas(A, exponents, [X1, np.full_like(X1, x2_val), np.full_like(X1, x3_val), X4])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X4, Z4, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 4: $f(x_1, x_2, x_3, x_4) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$\nCon $x_2 = {x2_val}$ y $x_3 = {x3_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_4$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph4 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 5: x2 y x4 fijas, x1 y x3 mapeadas
    x1 = np.linspace(0.1, 2, 50)
    x3 = np.linspace(0.1, 2, 50)
    X1, X3 = np.meshgrid(x1, x3)
    x2_val, x4_val = 1, 1
    Z5 = cobb_douglas(A, exponents, [np.full_like(X1, x2_val), X1, X3, np.full_like(X3, x4_val)])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X3, Z5, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 5: $f(x_1, x_2, x_3, x_4) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$\nCon $x_2 = {x2_val}$ y $x_4 = {x4_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_3$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph5 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 6: x3 y x4 fijas, x1 y x2 mapeadas
    x1 = np.linspace(0.1, 2, 50)
    x2 = np.linspace(0.1, 2, 50)
    X1, X2 = np.meshgrid(x1, x2)
    x3_val, x4_val = 1, 1
    Z6 = cobb_douglas(A, exponents, [X1, X2, np.full_like(X1, x3_val), np.full_like(X1, x4_val)])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X2, Z6, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 6: $f(x_1, x_2, x_3, x_4) = {A_str} x_1^{{{exponents[0]}}} \cdot x_2^{{{exponents[1]}}} \cdot x_3^{{{exponents[2]}}} \cdot x_4^{{{exponents[3]}}}$\nCon $x_3 = {x3_val}$ y $x_4 = {x4_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_2$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph6 = base64.b64encode(buffer.read()).decode('utf-8')

    return graph1, graph2, graph3, graph4, graph5, graph6

def plot_5_variables(A, exponents):
    # Gráfico 1: x1, x2 y x3 fijas, x4 y x5 mapeadas
    x4 = np.linspace(0.1, 2, 20)
    x5 = np.linspace(0.1, 2, 20)
    X4, X5 = np.meshgrid(x4, x5)
    x1_val, x2_val, x3_val = 1, 1, 1
    Z1 = cobb_douglas(A, exponents, [np.full_like(X4, x1_val), np.full_like(X4, x2_val), np.full_like(X4, x3_val), X4, X5])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X4, X5, Z1, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 1: $f(x_1, x_2, x_3, x_4, x_5)$\nCon $x_1 = {x1_val}, x_2 = {x2_val}, x_3 = {x3_val}$')
    ax.set_xlabel('$x_4$')
    ax.set_ylabel('$x_5$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4, x_5)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph1 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 2: x1, x4 y x5 fijas, x2 y x3 mapeadas
    x2 = np.linspace(0.1, 2, 20)
    x3 = np.linspace(0.1, 2, 20)
    X2, X3 = np.meshgrid(x2, x3)
    x1_val, x4_val, x5_val = 1, 1, 1
    Z2 = cobb_douglas(A, exponents, [np.full_like(X2, x1_val), X2, X3, np.full_like(X2, x4_val), np.full_like(X2, x5_val)])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X2, X3, Z2, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 2: $f(x_1, x_2, x_3, x_4, x_5)$\nCon $x_1 = {x1_val}, x_4 = {x4_val}, x_5 = {x5_val}$')
    ax.set_xlabel('$x_2$')
    ax.set_ylabel('$x_3$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4, x_5)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph2 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 3: x2, x3 y x4 fijas, x1 y x5 mapeadas
    x1 = np.linspace(0.1, 2, 20)
    x5 = np.linspace(0.1, 2, 20)
    X1, X5 = np.meshgrid(x1, x5)
    x2_val, x3_val, x4_val = 1, 1, 1
    Z3 = cobb_douglas(A, exponents, [X1, np.full_like(X1, x2_val), np.full_like(X1, x3_val), np.full_like(X1, x4_val), X5])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X5, Z3, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 3: $f(x_1, x_2, x_3, x_4, x_5)$\nCon $x_2 = {x2_val}, x_3 = {x3_val}, x_4 = {x4_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_5$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4, x_5)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph3 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 4: x2, x4 y x5 fijas, x1 y x3 mapeadas
    x1 = np.linspace(0.1, 2, 20)
    x3 = np.linspace(0.1, 2, 20)
    X1, X3 = np.meshgrid(x1, x3)
    x2_val, x4_val, x5_val = 1, 1, 1
    Z4 = cobb_douglas(A, exponents, [X1, np.full_like(X1, x2_val), np.full_like(X1, x3_val), np.full_like(X1, x4_val), np.full_like(X1, x5_val)])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X3, Z4, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 4: $f(x_1, x_2, x_3, x_4, x_5)$\nCon $x_2 = {x2_val}, x_4 = {x4_val}, x_5 = {x5_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_3$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4, x_5)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph4 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 5: x3, x4 y x5 fijas, x1 y x2 mapeadas
    x1 = np.linspace(0.1, 2, 20)
    x2 = np.linspace(0.1, 2, 20)
    X1, X2 = np.meshgrid(x1, x2)
    x3_val, x4_val, x5_val = 1, 1, 1
    Z5 = cobb_douglas(A, exponents, [X1, X2, np.full_like(X1, x3_val), np.full_like(X1, x4_val), np.full_like(X1, x5_val)])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X1, X2, Z5, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 5: $f(x_1, x_2, x_3, x_4, x_5)$\nCon $x_3 = {x3_val}, x_4 = {x4_val}, x_5 = {x5_val}$')
    ax.set_xlabel('$x_1$')
    ax.set_ylabel('$x_2$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4, x_5)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph5 = base64.b64encode(buffer.read()).decode('utf-8')

    # Gráfico 6: x1, x3 y x4 fijas, x2 y x5 mapeadas
    x2 = np.linspace(0.1, 2, 20)
    x5 = np.linspace(0.1, 2, 20)
    X2, X5 = np.meshgrid(x2, x5)
    x1_val, x3_val, x4_val = 1, 1, 1
    Z6 = cobb_douglas(A, exponents, [np.full_like(X2, x1_val), X2, np.full_like(X2, x3_val), np.full_like(X2, x4_val), X5])

    fig = plt.figure(figsize=(8, 6))
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X2, X5, Z6, cmap='cool', edgecolor='none')
    ax.set_title(f'Figura 6: $f(x_1, x_2, x_3, x_4, x_5)$\nCon $x_1 = {x1_val}, x_3 = {x3_val}, x_4 = {x4_val}$')
    ax.set_xlabel('$x_2$')
    ax.set_ylabel('$x_5$')
    ax.set_zlabel('$f(x_1, x_2, x_3, x_4, x_5)$')

    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)
    graph6 = base64.b64encode(buffer.read()).decode('utf-8')

    return graph1, graph2, graph3, graph4, graph5, graph6

def plot_n_variables(A, n, exponents):
    """
    Genera gráficos para 1, 2, 3, 4 y 5 variables.
    :param A: Parámetro A de la función Cobb-Douglas
    :param exponents: Lista de exponentes
    :param n: Número de variables (1, 2, 3, 4, 5)
    :return: Lista de gráficos en formato base64
    """

    if isinstance(n, int) and 1 <= n <= 5:
        if n == 1:
            return plot_1_variable(A, exponents)
        elif n == 2:
            return plot_2_variables(A, exponents)
        elif n == 3:
            return plot_3_variables(A, exponents)
        elif n == 4:
            return plot_4_variables(A, exponents)
        elif n == 5:
            return plot_5_variables(A, exponents)
    else:
        raise ValueError("El valor de 'n' debe ser un entero entre 1 y 5.")


def calcular_cobb_douglas(A, n, exponentes):
    derivadas = calcular_derivadas_parciales(A, n, exponentes)
    puntos_criticos = encontrar_puntos_criticos(A, n, exponentes)
    hessiana = calcular_hessiana(A, n, exponentes)
    menores_principales = calcular_menores_principales(A, n, exponentes)
    hessiana_evaluada, menores_evaluados = evaluar_en_puntos_criticos(A, n, exponentes)
    generate_plots = plot_n_variables(A, n, exponentes)
    
    return {
        "derivadas": derivadas,
        "puntos_criticos": puntos_criticos,
        "hessiana": hessiana,
        "menores_principales": menores_principales,
        "hessiana_evaluada": hessiana_evaluada,
        "menores_evaluados": menores_evaluados,
        "graficos": generate_plots
    }
