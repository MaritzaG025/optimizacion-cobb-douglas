import sympy as sp
from sympy import Matrix, symbols, diff, latex, det

# Calcular la hessiana para hallar los menores principales
def calcular_hessiana(exponente):
    # Crear las variables y los alphas hasta el número de exponentes especificado
    variables = symbols('x1 x2 x3 x4 x5')[:exponente]
    alphas = symbols('alpha1 alpha2 alpha3 alpha4 alpha5')[:exponente]
    
    # Crear la función Cobb-Douglas
    f = sp.prod([variables[i]**alphas[i] for i in range(exponente)])
    
    # Calcular la matriz Hessiana
    hessiana = sp.hessian(f, variables)

    # Extraer la diagonal de la matriz Hessiana
    diagonal = [hessiana[i, i] for i in range(exponente)]
    
    # Factorizar términos comunes en la diagonal
    terms = []
    for term in diagonal:
        factors = sp.factor(term)
        terms.append(factors)
    
    # Crear una copia de la Hessiana y reemplazar los términos de la diagonal
    hessiana_fact = hessiana.copy()
    for i in range(exponente):
        hessiana_fact[i, i] = terms[i]
    
    # Factorizar la matriz Hessiana
    hessiana_simplificada = hessiana_fact / f
    
    return hessiana_simplificada

def menores_principales(hessiana):
    n = hessiana.shape[0]
    menores = []
    
    for k in range(1, n + 1):
        menores_k = []
        for i in range(n - k + 1):
            submatriz = hessiana[i:i+k, i:i+k]
            menor = submatriz.det()
            
            # Factorizar el determinante
            menor_factorizado = sp.factor(menor)
            menor_latex = latex(menor_factorizado)
            
            menores_k.append(menor_latex)
        menores.append(menores_k)

    return menores


