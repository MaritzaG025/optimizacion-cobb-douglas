function optimizacion_exp_con(exponente) {
    let variable_cant = ' variables</span>';
    if (exponente == 1) {
        variable_cant = ' variable</span>';
    }
    const titulo_modal = document.getElementById("modalOptimizarLabel");
    titulo_modal.innerHTML = '<span>Optimización con restricción presupuestal de la función de tipo Cobb-Douglas para '+ exponente + variable_cant;

    const titulo_opt_CD = document.getElementById("text_func_opt_CD");
    titulo_opt_CD.innerHTML = `<p>El problema de optimización consiste en maximizar o minimizar la función \\( f(x) \\) sujeta a la restricción 
    presupuestal \\( c(x) \\). Esto se puede formular como:</p>`;

    let lista_var_CD = ``;
    let var_expo_func = ``;
    let var_expo_costo = ``;
    for (let i = 1; i <= exponente; i++) {
        lista_var_CD += `x_{${i}}`;
        var_expo_func += `x_{${i}}^{\\alpha_{${i}}}`;
        var_expo_costo += `w_{${i}}x_{${i}}`;
        if (i < exponente) {
            lista_var_CD += ', \\ ';
            var_expo_costo += ' + ';
        }
    }

    const funcion_optimizar_CD_con = document.getElementById('funcion_optimizar_CD');
    funcion_optimizar_CD_con.innerHTML = `
        <p>
            \\[
                \\begin{align*}
                    \\text{Maximizar o Minimizar:} && f(x) = f(${lista_var_CD}) = A ${var_expo_func} \\\\
                    \\text{Sujeto a:} && c(x) = c(${lista_var_CD}) = ${var_expo_costo} \\\\
                \\end{align*}
            \\]
        </p>
    `;

    const text_ini_deri_parc_CD_con = document.getElementById("text_ini_deri_parc_CD");
    text_ini_deri_parc_CD_con.innerHTML = `<p>
        La optimización de la función CD con restricciones implica encontrar los valores de \(x_{i} \) que maximizan o
        minimizan la función \(f(x) \). Derivando con respecto a cada variable con respecto a cada variable \(x_{i} \)
        para obtener el gradiente, obtenemos que:
    </p>`;

    const funcion_derivada_parcial_CD_con = document.getElementById("funcion_deri_parc_CD");
    let inicio_deri_parc = ``;

    switch (exponente) {
        case 1:
        case "1":
            
            break;
        
        case "n":
            funcion_optimizar_CD_con.innerHTML = `
            <p>
                \\[
                    \\begin{align*}
                        \\text{Maximizar o Minimizar:} && f(x) = f(x_{1}, ..., x_{n}) = A\\prod_{i=1}^{n} x_{i}^{\\alpha_{i}} \\\\
                        \\text{Sujeto a:} && c(x) = c(c_{1}, ..., c_{n}) = \\sum_{i=1}^{n} w_{i}x_{i} \\\\
                    \\end{align*}
                \\]
            </p>
            `;
            break;
    
        default:
            break;
    }

    MathJax.typeset();
    const params = new URLSearchParams();
    params.append('n', exponente);
}
