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
    
    return hessiana

def menores_principales(hessiana):
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
