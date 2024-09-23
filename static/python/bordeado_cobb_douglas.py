import sympy as sp

def generar_matriz_bordeada(exponentes):
    # Crear las variables y los alphas
    variables = sp.symbols('x1:{}'.format(exponentes + 1))
    alphas = sp.symbols('alpha1:{}'.format(exponentes + 1))
    w = sp.symbols('w1:{}'.format(exponentes + 1))
    A = sp.symbols('A')

    # Inicializar la matriz
    matriz_bordeada = sp.zeros(exponentes + 1, exponentes + 1)
    
    # Rellenar la matriz bordeada
    matriz_bordeada[0, 0] = 0
    for i in range(1, exponentes + 1):
        matriz_bordeada[0, i] = -w[i - 1]  # Primera fila
        matriz_bordeada[i, 0] = -w[i - 1]  # Primera columna
        for j in range(1, exponentes + 1):
            if i == j:
                # Reemplazar la función Cobb-Douglas por f(x)
                hessian_element = (alphas[i - 1] * (alphas[i - 1] - 1) / variables[i - 1]**2)
                matriz_bordeada[i, j] = hessian_element * sp.symbols('f(x)')  # Usar f como símbolo
            else:
                matriz_bordeada[i, j] = (alphas[i - 1] * alphas[j - 1] / (variables[i - 1] * variables[j - 1])) * sp.symbols('f(x)')  # Usar f como símbolo

    # Convertir a LaTeX
    matriz_bordeada_latex = sp.latex(matriz_bordeada)

    return f"\\[ \\Delta_{{{exponentes}}} = {matriz_bordeada_latex} \\]"

def calcular_determinante_bordeado(exponentes):
    # Definir las variables
    w = sp.symbols('w1:{}'.format(exponentes + 1))
    alphas = sp.symbols('alpha1:{}'.format(exponentes + 1))
    x = sp.symbols('x1:{}'.format(exponentes + 1))
    
    # Crear la función Cobb-Douglas
    A = sp.symbols('A')  # Constante A
    f = A * sp.prod([x[i]**alphas[i] for i in range(exponentes)])
    
    # Factorizar el determinante
    factor = (-1)**exponentes * (f)**(exponentes - 1) * sp.prod(alphas[i] / x[i]**2 for i in range(exponentes))
    
    # Sumar términos
    sumatoria = 0
    for i in range(exponentes):
        inner_sum = 0
        for j in range(i + 1, exponentes):
            inner_sum += (x[i]**2 * x[j]**2) / (alphas[i] * alphas[j]) * ((w[i] * alphas[j] / x[j]) - (w[j] * alphas[i] / x[i]))**2
        sumatoria += (w[i]**2 * x[i]**2 / alphas[i]) - inner_sum
    
    # Determinante final
    determinante = sumatoria
    
    # Reemplazar f por f(x)
    f_x = sp.symbols('f(x)')
    determinante_reemplazado = determinante.subs(f, f_x)
    factor_reemplazado = factor.subs(f, f_x)
    
    # Convertir a LaTeX
    determinante_latex = sp.latex(determinante_reemplazado)
    factor_latex = sp.latex(factor_reemplazado)
    
    return f"\\[ |\\Delta_{{{exponentes}}}| = {factor_latex} \\left[ {determinante_latex} \\right] \\]"
