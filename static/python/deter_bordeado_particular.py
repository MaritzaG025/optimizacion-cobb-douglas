from sympy import symbols, Matrix, prod

# Definir variables
n = 3
X = symbols('X1 X2 X3')
w = [4, 2, 1]
alpha = [0.5, 0.3, 0.2]
f_X = 10 * prod([X[i]**alpha[i] for i in range(n)])

# Definir el determinante bordado
determinant_sum = 0
for i in range(n):
    inner_sum = w[i]**2 * X[i]**2 / alpha[i]
    for j in range(n):
        if j > i:
            diff_term = (w[i]*alpha[j]/X[j] - w[j]*alpha[i]/X[i])**2
            inner_sum -= (X[i]**2 * X[j]**2) / (alpha[i] * alpha[j]) * diff_term
    determinant_sum += inner_sum

determinant = (-1)**n * (f_X)**(n-1) * prod([alpha[i]/X[i]**2 for i in range(n)]) * determinant_sum
determinant.simplify()
