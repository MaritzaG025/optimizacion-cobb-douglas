import sympy as sp
from sympy import symbols

def generar_hessiana(exponentes):
    # Crear las variables y los alphas hasta el número de exponentes especificado
    variables = symbols('x1 x2 x3 x4 x5')[:exponentes]
    alphas = symbols('alpha1 alpha2 alpha3 alpha4 alpha5')[:exponentes]
    
    # Crear la función Cobb-Douglas
    f = sp.prod([variables[i]**alphas[i] for i in range(exponentes)])
    
    # Calcular la matriz Hessiana
    hessiana = sp.hessian(f, variables)

    # hessiana = hessiana.applyfunc(lambda x: sp.factor(sp.simplify(x)))
    
    # Convertir la matriz Hessiana a una cadena en formato LaTeX
    hessiana_latex = sp.latex(hessiana)
    
    return hessiana_latex
