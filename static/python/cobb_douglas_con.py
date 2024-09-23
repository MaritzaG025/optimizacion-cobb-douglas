import sympy as sp
from sympy import Matrix, symbols, diff, latex, det

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
    determinante_latex = sp.latex(determinante)
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
    resultado_det_final = signo * resultado_final
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
    evaluar_x_latex = sp.latex(sp.N(resultado_final, 2))

    # Crear el resultado en LaTeX
    resultado_latex = f"(-1)^{{{n}}} \\cdot |\\Delta_{{{n}}}| \\approx (-1)^{{{n}}} \\cdot \\left[ {evaluar_x_latex} \\right] \\approx {det_evaluado} {clasificacion} "


    return resultado_latex, clasificacion


def calcular_cobb_douglas_restriccion(A, n, exponentes, precios, presupuesto):
    derivadas = calcular_derivadas_parciales(A, n, exponentes, precios, presupuesto)
    puntos_criticos = encontrar_puntos_criticos(A, n, exponentes, precios, presupuesto)
    det_bordeado = calcular_determinante_bordeado(A, n, exponentes, precios, presupuesto)   
    det_bordeado_evaluado = calcular_determinante_bordeado_evaluado(A, n, exponentes, precios, presupuesto)   
    return {
        "derivadas": derivadas,
        "puntos_criticos": puntos_criticos,
        "det_bordeado": det_bordeado,
        "det_bordeado_evaluado": det_bordeado_evaluado
    }
