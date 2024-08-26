import sympy as sp
from sympy import Matrix, symbols, diff, latex, det

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
            menor_latex = latex(menor)
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

def calcular_cobb_douglas(A, n, exponentes):
    derivadas = calcular_derivadas_parciales(A, n, exponentes)
    puntos_criticos = encontrar_puntos_criticos(A, n, exponentes)
    hessiana = calcular_hessiana(A, n, exponentes)
    menores_principales = calcular_menores_principales(A, n, exponentes)
    hessiana_evaluada, menores_evaluados = evaluar_en_puntos_criticos(A, n, exponentes)
    # hessiana_evaluada = evaluar_hessiana_en_puntos_criticos(A, n, exponentes)
    # menores_evaluados = calcular_menores_principales(A, n, exponentes)
    
    return {
        "derivadas": derivadas,
        "puntos_criticos": puntos_criticos,
        "hessiana": hessiana,
        "menores_principales": menores_principales,
        "hessiana_evaluada": hessiana_evaluada,
        "menores_evaluados": menores_evaluados
    }
