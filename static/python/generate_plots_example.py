import matplotlib.pyplot as plt
import numpy as np
import io
import base64

def generate_plots_example():
    # Crear gráficos de ejemplo
    fig = plt.figure(figsize=(10, 5))

    # Primer gráfico
    ax1 = fig.add_subplot(121, projection='3d')
    x = np.linspace(0, 1, 100)
    y = np.linspace(0, 1, 100)
    X, Y = np.meshgrid(x, y)
    Z1 = X**0.3 * Y**0.4 * (1 - X - Y)**0.3
    ax1.plot_surface(X, Y, Z1, cmap='cool')
    ax1.set_xlabel('$x_1$')
    ax1.set_ylabel('$x_2$')
    ax1.set_zlabel('$f(x_1, x_2, x_3)$')

    # Segundo gráfico
    ax2 = fig.add_subplot(122, projection='3d')
    Z2 = X**0.3 * Y**0.4 * 2**0.3
    ax2.plot_surface(X, Y, Z2, cmap='cool')
    ax2.set_xlabel('$x_1$')
    ax2.set_ylabel('$x_2$')
    ax2.set_zlabel('$f(x_1, x_2, x_3)$')

    # Guardar gráfico en un buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    plt.close(fig)
    buffer.seek(0)
    img_str = base64.b64encode(buffer.read()).decode('utf-8')

    return img_str

def generate_plots_example_derivadas():
    # Create a figure for both plots
    fig, axs = plt.subplots(1, 2, figsize=(14, 6))
    
    # Datos para el gráfico 1
    x = np.linspace(0, 1, 100)
    y = np.linspace(0, 1, 100)
    X, Y = np.meshgrid(x, y)
    Z = X**0.3 * Y**0.4 * (1 - X - Y)**0.3

    # Primer gráfico: Curvas de nivel
    cont1 = axs[0].contour(X, Y, Z, levels=10, cmap='cool')
    axs[0].set_xlabel('$x_1$')
    axs[0].set_ylabel('$x_2$')
    axs[0].set_title('Curvas de nivel de la función Cobb-Douglas')
    fig.colorbar(cont1, ax=axs[0], label='Valor de $f(x_1, x_2, x_3)$')
    
    # Datos para el gráfico 2
    Z_dx1 = 0.3 * X**(-0.7) * Y**0.4 * 2**0.3
    Z_dx2 = X**0.3 * 0.4 * Y**(-0.6) * 2**0.3

    # Segundo gráfico: Curvas de nivel de derivadas parciales
    cont2 = axs[1].contour(X, Y, Z_dx1, levels=5, colors='purple', linestyles='solid')
    cont2 = axs[1].contour(X, Y, Z_dx2, levels=5, colors='purple', linestyles='dashed')
    axs[1].set_xlabel('$x_1$')
    axs[1].set_ylabel('$x_2$')
    axs[1].set_title('Curvas de nivel de las derivadas parciales')
    axs[1].legend(['$\partial f / \partial x_1$', '$\partial f / \partial x_2$'])
    
    # Guardar gráficos en un buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    plt.close(fig)
    buffer.seek(0)
    img_str = base64.b64encode(buffer.read()).decode('utf-8')

    return img_str