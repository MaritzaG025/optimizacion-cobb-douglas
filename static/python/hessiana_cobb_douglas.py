import sympy as sp

def generar_hessiana(exponentes):
    # Crear las variables y los alphas hasta el número de exponentes especificado
    variables = sp.symbols('x1:{}'.format(exponentes+1))
    alphas = sp.symbols('alpha1:{}'.format(exponentes+1))
    
    # Crear la función Cobb-Douglas
    A = sp.symbols('A')  # Constante A
    f = A * sp.prod([variables[i]**alphas[i] for i in range(exponentes)])
    
    # Calcular la matriz Hessiana
    hessiana = sp.hessian(f, variables)

    # Extraer la diagonal de la matriz Hessiana
    diagonal = [hessiana[i, i] for i in range(exponentes)]
    
    # Factorizar términos comunes en la diagonal
    terms = []
    for term in diagonal:
        factors = sp.factor(term)
        terms.append(factors)
    
    # Crear una copia de la Hessiana y reemplazar los términos de la diagonal
    hessiana_fact = hessiana.copy()
    for i in range(exponentes):
        hessiana_fact[i, i] = terms[i]
    
    # Factorizar la matriz Hessiana
    hessiana_simplificada = hessiana_fact / f
    
    # Convertir la matriz Hessiana simplificada a una cadena en formato LaTeX
    hessiana_latex = sp.latex(hessiana_simplificada)

    # Incluir el factor común en la expresión final
    f_latex = sp.latex(f)
    hessiana_latex =  hessiana_latex + f_latex
    
    return  hessiana_latex;


def generar_hessiana_con(exponentes):
    # Crear las variables y los alphas hasta el número de exponentes especificado
    variables = sp.symbols('x1:{}'.format(exponentes + 1))
    alphas = sp.symbols('alpha1:{}'.format(exponentes + 1))
    w = sp.symbols('w1:{}'.format(exponentes + 1))
    c = sp.symbols('c')  # Constante c
    lambda_ = sp.symbols('lambda')  # Constante lambda

    # Crear la función Cobb-Douglas
    A = sp.symbols('A')  # Constante A
    f = A * sp.prod([variables[i]**alphas[i] for i in range(exponentes)])
    
    # Crear la función de restricción
    g = sp.Add(*[w[i] * variables[i] for i in range(exponentes)]) - c
    
    # Crear la función objetivo
    psi = f - lambda_ * g

    # Calcular la matriz Hessiana
    hessiana = sp.hessian(psi, variables)

    # Extraer la diagonal de la matriz Hessiana
    diagonal = [hessiana[i, i] for i in range(exponentes)]
    
    # Factorizar términos comunes en la diagonal
    terms = []
    for term in diagonal:
        factors = sp.factor(term)
        terms.append(factors)
    
    # Crear una copia de la Hessiana y reemplazar los términos de la diagonal
    hessiana_fact = hessiana.copy()
    for i in range(exponentes):
        hessiana_fact[i, i] = terms[i]
    
    # Factorizar la matriz Hessiana
    hessiana_simplificada = hessiana_fact / f
    
    # Convertir la matriz Hessiana simplificada a una cadena en formato LaTeX
    hessiana_latex = sp.latex(hessiana_simplificada)
    
    # Incluir el factor común en la expresión final
    f_latex = sp.latex(f)
    hessiana_latex =  hessiana_latex + f_latex
    
    return  hessiana_latex;