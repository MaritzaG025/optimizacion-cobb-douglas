import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64

def plot_cobb_douglas_1d(A, exponentes, x_vals):
    f_vals = A * x_vals**exponentes[0]
    
    fig, ax = plt.subplots()
    ax.plot(x_vals, f_vals, label='Función Cobb-Douglas')
    ax.set_title('Función Cobb-Douglas para 1 variable')
    ax.set_xlabel('x1')
    ax.set_ylabel('f(x1)')
    ax.legend()
    
    # Guardar la imagen en un buffer en memoria
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Convertir a base64
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    
    plt.close(fig)
    return img_str

def plot_cobb_douglas_2d(A, exponentes, x_vals, y_vals):
    X, Y = np.meshgrid(x_vals, y_vals)
    Z = A * X**exponentes[0] * Y**exponentes[1]
    
    fig, ax = plt.subplots()
    c = ax.contourf(X, Y, Z, levels=50, cmap='viridis')
    fig.colorbar(c, ax=ax, label='Valor de la función')
    ax.set_title('Función Cobb-Douglas para 2 variables')
    ax.set_xlabel('x1')
    ax.set_ylabel('x2')
    
    # Guardar la imagen en un buffer en memoria
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Convertir a base64
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    
    plt.close(fig)
    return img_str

def plot_cobb_douglas_3d(A, exponentes, x_vals, y_vals, z_vals):
    X, Y = np.meshgrid(x_vals, y_vals)
    Z = np.zeros((len(x_vals), len(y_vals)))

    for i in range(len(x_vals)):
        for j in range(len(y_vals)):
            Z[i, j] = A * x_vals[i]**exponentes[0] * y_vals[j]**exponentes[1] * z_vals[i]**exponentes[2]
    
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    ax.plot_surface(X, Y, Z, cmap='viridis')
    ax.set_title('Función Cobb-Douglas para 3 variables')
    ax.set_xlabel('x1')
    ax.set_ylabel('x2')
    ax.set_zlabel('f(x1, x2, x3)')
    
    # Guardar la imagen en un buffer en memoria
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Convertir a base64
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    
    plt.close(fig)
    return img_str

def plot_cobb_douglas_4d(A, exponentes, x_vals, y_vals, z_vals):
    X, Y = np.meshgrid(x_vals, y_vals)
    Z = np.zeros((len(x_vals), len(y_vals)))
    fixed_z = 1  # Valor fijo para z

    for i in range(len(x_vals)):
        for j in range(len(y_vals)):
            Z[i, j] = A * x_vals[i]**exponentes[0] * y_vals[j]**exponentes[1] * fixed_z**exponentes[2]

    fig, ax = plt.subplots()
    c = ax.contourf(X, Y, Z, levels=50, cmap='viridis')
    fig.colorbar(c, ax=ax, label='Valor de la función')
    ax.set_title('Función Cobb-Douglas para 4 variables (z=1)')
    ax.set_xlabel('x1')
    ax.set_ylabel('x2')
    
    # Guardar la imagen en un buffer en memoria
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Convertir a base64
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    
    plt.close(fig)
    return img_str

def plot_cobb_douglas_5d(A, exponentes, x_vals, y_vals, z_vals):
    X, Y = np.meshgrid(x_vals, y_vals)
    Z = np.zeros((len(x_vals), len(y_vals)))
    fixed_z = 1  # Valor fijo para z
    fixed_w = 1  # Valor fijo para w

    for i in range(len(x_vals)):
        for j in range(len(y_vals)):
            Z[i, j] = A * x_vals[i]**exponentes[0] * y_vals[j]**exponentes[1] * fixed_z**exponentes[2] * fixed_w**exponentes[3]

    fig, ax = plt.subplots()
    c = ax.contourf(X, Y, Z, levels=50, cmap='viridis')
    fig.colorbar(c, ax=ax, label='Valor de la función')
    ax.set_title('Función Cobb-Douglas para 5 variables (z=1, w=1)')
    ax.set_xlabel('x1')
    ax.set_ylabel('x2')
    
    # Guardar la imagen en un buffer en memoria
    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    
    # Convertir a base64
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    
    plt.close(fig)
    return img_str

def generate_plots(A, n, exponentes):
    x_vals = np.linspace(1, 10, 100)
    y_vals = np.linspace(1, 10, 100)
    z_vals = np.linspace(1, 10, 100)
    
    if n == 1:
        return {'image': plot_cobb_douglas_1d(A, exponentes, x_vals)}
    elif n == 2:
        return {'image': plot_cobb_douglas_2d(A, exponentes, x_vals, y_vals)}
    elif n == 3:
        return {'image': plot_cobb_douglas_3d(A, exponentes, x_vals, y_vals, z_vals)}
    elif n == 4:
        return {'image': plot_cobb_douglas_4d(A, exponentes, x_vals, y_vals, z_vals)}
    elif n == 5:
        return {'image': plot_cobb_douglas_5d(A, exponentes, x_vals, y_vals, z_vals)}
    else:
        return {'error': 'Número de variables no soportado'}


