function mostrarHessiana_Con(hessianaLatex) {
    const hessianaDiv = document.getElementById('hessiana_con');
    hessianaDiv.innerHTML = `\\[ H_{\\psi} (x) = ${hessianaLatex}\\]`; 
    MathJax.typeset();
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function obtenerHessiana_Con(n) {
    fetch(`/calcular_hessiana?n=${n}`)
        .then(response => response.json())
        .then(data => {
            mostrarHessiana_Con(data.hessiana_con);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

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
    let lista_exp_CD = ``;
    let var_expo_func = ``;
    let var_expo_costo = ``;
    let inicio_deri_parc = ``;
    for (let i = 1; i <= exponente; i++) {
        lista_var_CD += `x_{${i}}`;
        lista_exp_CD += `${i}`;
        var_expo_func += `x_{${i}}^{\\alpha_{${i}}}`;
        var_expo_costo += `w_{${i}}x_{${i}}`;
        inicio_deri_parc += `
            \\frac{\\partial f}{\\partial x_{${i}}} = \\alpha_{${i}} \\frac{f(x)}{x_{${i}}} \\ - \\ \\lambda w_{${i}} = 0
        `;
        if (i < exponente) {
            lista_var_CD += ', \\ ';
            lista_exp_CD += ', \\ ';
            var_expo_costo += ' + ';
            inicio_deri_parc += ', \\ \\ \\ \\ \\';
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
    const funcion_derivada_parcial_CD_con = document.getElementById("funcion_deri_parc_CD");  
    const funcion_hessiana_CD_sin = document.getElementById("funcion_hessiana_CD");
    let inicio_hessiana = `<strong>Matriz Hessiana - Analísis de convexidad y concavidad</strong> <br> <br><p>Para determinar 
    si los puntos críticos son máximos, mínimos o puntos de silla, se calcula la matriz Hessiana:</p>`;

    switch (exponente) {
        case "n":
            funcion_optimizar_CD_con.innerHTML = `
            <p>
                \\[
                    \\begin{align*}
                        \\text{Maximizar o Minimizar:} && f(x) = f(x_{1}, ..., x_{n}) = A\\prod_{i=1}^{n} x_{i}^{\\alpha_{i}} \\\\
                        \\text{Sujeto a:} && c(x) = c(c_{1}, ..., c_{n}) = \\sum_{i=1}^{n} w_{i}x_{i}  = c\\\\
                    \\end{align*}
                \\]

                Por el método del multiplicador de Lagrange, primero definimos la función lagrangiana por:

                \\[ \\psi(X) \\ = \\ \\psi(X_{1}, ..., X_{n}) \\ = \\ A \\prod_{i=1}^{n} X_{i}^{\\alpha_{i}} \\ - \\ \\lambda \\ \\biggl( \\sum_{i=1}^{n} w_{i}X_{i} \\ - \\ c \\biggl) \\]

                Donde \\(\\lambda\\) es el multiplicador de Lagrange asociado a la restricción presupuestaria. Así, calculando las derivadas parciales de \\(\\psi\\) con respecto 
                a cada \\(X_{i} \\ \\ \\forall \\ i = 1, ..., n\\), e igualando a cero, obtenemos que: 
            </p>
            `;

            funcion_derivada_parcial_CD_con.innerHTML = `
                \\[
                    \\frac{\\partial \\psi }{\\partial X_{i}} \\
                    = \\ A \\frac{\\alpha_{i}} {X_{i}}\\prod_{k=1}^{n} X_{k}^{\\alpha_{k}} \\ - \\ \\lambda w_{i} \\ 
                    = \\ 0, \\ \\ \\ \\ \\forall \\ i = 1, .., n 
                \\]
            `;

            inicio_hessiana += `
                Primero, las derivadas parciales de segundo orden de la función Lagrangiana son:

                \\[
                    \\frac{\\partial^2 \\psi}{\\partial X_{i}^2} = A \\frac{\\alpha_{i} (\\alpha_{i} - 1)}{X_{i}^2} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}}
                \\]

                Para las derivadas cruzadas con \\(i \\neq j\\):

                \\[ \\frac{\\partial^2 \\psi}{\\partial X_{i} \\partial X_{j}} = A \\frac{\\alpha_{i} \\alpha_{j}}{X_{i} X_{j}} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}} \\]

                Así, la matriz Hessiana \\(H_{\\psi}(X) \\) es:

                \\[
                    H_{\\psi}(X) = A \\begin{pmatrix}
                    \\frac{\\alpha_{1} (\\alpha_{1} - 1)}{X_{1}^2}
                    & \\cdots & \\frac{\\alpha_{1} \\alpha_{n}}{X_{1} X_{n}} \\\\
                    \\vdots & \\ddots & \\vdots \\\\
                    \\frac{\\alpha_{n} \\alpha_{1}}{X_{n} X_{1}}  
                    & \\cdots & \\frac{\\alpha_{n} (\\alpha_{n} - 1)}{X_{n}^2} 
                    \\end{pmatrix}
                    \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}}
                \\]

                Para el criterio del determinante bordeado, definimos la matriz \\(\\Delta_n\\) como una matriz simétrica \\((n+1) \\times (n+1)\\):

                \\[
                    \\Delta_n = \\begin{pmatrix}
                    0 & -w_1 & \\cdots & -w_n \\\\
                    -w_1 & A \\frac{\\alpha_{1} (\\alpha_{1} - 1)}{X_{1}^2} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}}
                    & \\cdots & A \\frac{\\alpha_{1} \\alpha_{n}}{X_{1} X_{n}} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}} \\\\
                    \\vdots & \\vdots & \\ddots & \\vdots \\\\
                    -w_n & A \\frac{\\alpha_{n} \\alpha_{1}}{X_{n} X_{1}} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}}  
                    & \\cdots & A \\frac{\\alpha_{n} (\\alpha_{n} - 1)}{X_{n}^2} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}} 
                    \\end{pmatrix}
                \\]

                Para verificar si el punto crítico maximiza la función, calculamos el determinante de \\(\\Delta_n\\) como:
                \\[ |\\Delta_n| = (-1)^{n} A^n \\prod_{i=1}^{n} \\alpha_i \\left( \\sum_{j=1}^{n} \\alpha_j \\right) |H_{\\psi}(X)| \\]
            `;
            break;
    
        default:
            text_ini_deri_parc_CD_con.innerHTML = `<p>
                La optimización de la función CD con restricciones implica encontrar los valores de \\(x_{i} \\ \\forall \\ i = ${lista_exp_CD} \\) que maximizan o
                minimizan la función \\(f(x)\\) sujeta a una restrincción presupuestaria. Por el método del multiplicador de Lagrange, 
                primero definimos la función lagrangiana por:
                \\[ \\psi(X) \\ = \\ \\psi(${lista_var_CD}) \\ = \\ A ${var_expo_func} \\ - \\ \\lambda \\ \\biggl( ${var_expo_costo} \\ - \\ c \\biggl) \\]
        
                Donde \\(\\lambda\\) es el multiplicador de Lagrange asociado a la restricción presupuestaria. Así, calculando las derivadas parciales de \\(\\psi\\) con respecto 
                a cada \\(X_{i} \\ \\ \\forall \\ \\ i = ${lista_exp_CD}\\), e igualando a cero, obtenemos que:
            </p>`;
            funcion_derivada_parcial_CD_con.innerHTML = `\\(${inicio_deri_parc}\\)`;
            inicio_hessiana += `
                <br><div id="hessiana_con"></div><br>
            `;
            obtenerHessiana_Con(exponente);
            break;
    }

    funcion_hessiana_CD_sin.innerHTML = inicio_hessiana;

    MathJax.typeset();
    const params = new URLSearchParams();
    params.append('n', exponente);
}
