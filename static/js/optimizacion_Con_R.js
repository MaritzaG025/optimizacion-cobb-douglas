function mostrarHessiana_Con(hessianaLatex) {
  const hessianaDiv = document.getElementById("hessiana_con");
  hessianaDiv.innerHTML = `\\[ H_{\\psi} (x) = ${hessianaLatex.hessiana_con}\\]`;

  MathJax.typeset();
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function obtenerHessiana_Con(n) {
  fetch(`/calcular_hessiana?n=${n}`)
    .then(response => response.json())
    .then(data => {
      mostrarHessiana_Con(data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function mostrarBordeado_Con(hessianaLatex) {
  const hessianaBordeadaDiv = document.getElementById("hessiana_bordeada");
  hessianaBordeadaDiv.innerHTML = hessianaLatex.hessiana_bordeada;

  const detBordeadoDiv = document.getElementById("determinante_bordeado");
  detBordeadoDiv.innerHTML = hessianaLatex.determinante_bordeado;

  MathJax.typeset();
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function obtenerBordeado_Con(n) {
  fetch(`/calcular_det_bordeado?n=${n}`)
    .then(response => response.json())
    .then(data => {
      mostrarBordeado_Con(data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function mostrarMenoresPrincipales_Con(menoresPrincipalesLatex) {
  const menoresPrincipalesDiv = document.getElementById("menoresPrincipales");
  const menoresPrincipalesDiv_phone = document.getElementById(
    "menoresPrincipales_phone"
  );
  let contenido = "";
  let contenido_phone = "";
  menoresPrincipalesLatex.forEach((conjunto, idx) => {
    if (conjunto.length > 0) {
      let menores_principales_phone = ``;
      contenido += `<u>Menores Principales de Orden ${idx + 1}</u>: <br>`;
      contenido_phone += `<u>Menores Principales de Orden ${idx +
        1}</u>: <br><br>`;
      // Añadir \biggl y \biggr a los menores principales
      contenido += `\\[ M_{${idx + 1}} = \\left\\{ ${conjunto.join(
        ", "
      )} \\right\\} \\] <br><br>`;
      conjunto.forEach(element => {
        menores_principales_phone += `<p>\\( ${element}, \\)</p>`;
      });
      contenido_phone += `\\(M_{${idx + 1}}\\) = {
                                    <div class="w-full d-flex align-items-center flex-column">
                                        ${menores_principales_phone}
                                    </div> 
                                } <br><br>`;
    }
  });

  menoresPrincipalesDiv.innerHTML = contenido;
  menoresPrincipalesDiv_phone.innerHTML = contenido_phone;
  MathJax.typeset();
}

function obtenerMenoresPrincipales_Con(n) {
  fetch(`/calcular_menores_principales?n=${n}`)
    .then(response => response.json())
    .then(data => {
      mostrarMenoresPrincipales_Con(data.menores_principales);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function optimizacion_exp_con(exponente) {
  let variable_cant = " variables</span>";
  if (exponente == 1) {
    variable_cant = " variable</span>";
  }
  const titulo_modal = document.getElementById("modalOptimizarLabel");
  titulo_modal.innerHTML =
    "<span>Optimización con restricción presupuestal de la función de tipo Cobb-Douglas para " +
    exponente +
    variable_cant;

  const titulo_opt_CD = document.getElementById("text_func_opt_CD");
  titulo_opt_CD.innerHTML = `<p>El problema de optimización consiste en maximizar o minimizar la función \\( f(x) \\) sujeta a la restricción 
    presupuestal \\( c(x) \\). Esto se puede formular como:</p>`;

  let lista_var_CD = ``;
  let lista_exp_CD = ``;
  let var_expo_func = ``;
  let var_expo_costo = ``;
  let inicio_deri_parc = `<div class="d-flex align-items-center flex-column">`;
  let inicio_deri_parc_phone = ``;
  let exponentes_list_0 = ``;
  let exponentes_list_0_1 = ``;
  let exponentes_suma = ``;

  for (let i = 1; i <= exponente; i++) {
    lista_var_CD += `x_{${i}}`;
    lista_exp_CD += `${i}`;
    var_expo_func += `x_{${i}}^{\\alpha_{${i}}}`;
    var_expo_costo += `w_{${i}}x_{${i}}`;
    inicio_deri_parc += `
            <p>
                \\( \\frac{\\partial f}{\\partial x_{${i}}} = \\alpha_{${i}} \\frac{f(x)}{x_{${i}}} \\ - \\ \\lambda w_{${i}} = 0 \\)
            </p>
        `;
    inicio_deri_parc_phone += `
            <p>
                \\( \\frac{\\partial f}{\\partial x_{${i}}} = \\alpha_{${i}} \\frac{f(x)}{x_{${i}}} \\ - \\ \\lambda w_{${i}} = 0 \\)
            </p>
        `;
    exponentes_list_0 += `\\( \\alpha_{${i}}  < 0 \\)`;
    exponentes_list_0_1 += `\\( 0 < \\alpha_{${i}}  < 1 \\)`;
    exponentes_suma += `\\alpha_{${i}}`;

    if (i < exponente) {
      lista_var_CD += ", \\ ";
      lista_exp_CD += ", \\ ";
      var_expo_costo += " + ";
      inicio_deri_parc += ", ";
      exponentes_list_0 += " , ";
      exponentes_list_0_1 += " , ";
      exponentes_suma += " + ";
    }
  }

  const funcion_optimizar_CD_con = document.getElementById(
    "funcion_optimizar_CD"
  );
  funcion_optimizar_CD_con.innerHTML = `
        <p class="hidden_phone">
            \\[
                \\begin{align*}
                    \\text{Maximizar o Minimizar:} && f(x) = f(${lista_var_CD}) = A ${var_expo_func} \\\\
                    \\text{Sujeto a:} && c(x) = c(${lista_var_CD}) = ${var_expo_costo} \\\\
                \\end{align*}
            \\]
        </p>
        <p class="hidden_pc">
            \\[
                \\begin{align*}
                    \\text{Max o Min:} && f(x) = A \\prod_{i=1}^{${exponente}} x_{i}^{\\alpha_{i}} \\\\
                    \\text{Sujeto a:} && c(x) = \\sum_{i=1}^{${exponente}} w_{i}x_{i} \\\\
                \\end{align*}
            \\]
        </p>
    `;

  const text_ini_deri_parc_CD_con = document.getElementById(
    "text_ini_deri_parc_CD"
  );
  const funcion_derivada_parcial_CD_con = document.getElementById(
    "funcion_deri_parc_CD"
  );
  const funcion_derivada_parcial_CD_con_phone = document.getElementById(
    "funcion_deri_parc_CD_phone"
  );
  const funcion_derivada_parcial_CD_con_lambda = document.getElementById(
    "funcion_deri_parc_CD_lambda"
  );
  const funcion_hessiana_CD_sin = document.getElementById(
    "funcion_hessiana_CD"
  );

  const maximizar_CD_sin = document.getElementById("maximizar_CD");
  let inicio_maximizador = "<strong>Maximización</strong> <br><br>";

  const minimizar_CD_sin = document.getElementById("minimizar_CD");
  let inicio_minimizador = "<strong>Minimización</strong> <br><br>";

  const conclusion_CD_sin = document.getElementById("conclusion_CD");
  let inicio_conclusion = "<strong>Conclusión</strong> <br><br>";

  let inicio_hessiana = `<strong>Determinante Bordeado: Uso de la Matriz Hessiana y Análisis de Puntos Críticos</strong> <br> <br>
    <p>Para determinar si los puntos críticos son máximos, mínimos o puntos de silla, se calcula el determinante bordeado. 
    Para la construcción de este determinante, utilizamos la matriz Hessiana. En el contexto de funciones de tipo Cobb-Douglas, la matriz Hessiana se define como:</p>`;

  switch (exponente) {
    case "n":
      text_ini_deri_parc_CD_con.innerHTML = ``;
      funcion_optimizar_CD_con.innerHTML = `
            <p>
                <span class="hidden_phone">
                    \\[
                        \\begin{align*}
                            \\text{Maximizar o Minimizar:} && f(x) = f(x_{1}, ..., x_{n}) = A\\prod_{i=1}^{n} x_{i}^{\\alpha_{i}} \\\\
                            \\text{Sujeto a:} && c(x) = c(c_{1}, ..., c_{n}) = \\sum_{i=1}^{n} w_{i}x_{i}  = c\\\\
                        \\end{align*}
                    \\]
                    Por el método del multiplicador de Lagrange, primero definimos la función lagrangiana por:
                    \\[ \\psi(X) \\ = \\ \\psi(X_{1}, ..., X_{n}) \\ = \\ A \\prod_{i=1}^{n} X_{i}^{\\alpha_{i}} \\ - \\ \\lambda \\ \\biggl( \\sum_{i=1}^{n} w_{i}X_{i} \\ - \\ c \\biggl) \\]
                </span>
                <span class="hidden_pc">
                    \\[
                        \\begin{align*}
                            \\text{Max o Min:} && f(x) = A\\prod_{i=1}^{n} x_{i}^{\\alpha_{i}} \\\\
                            \\text{Sujeto a:} && c(x) = \\sum_{i=1}^{n} w_{i}x_{i}  = c\\\\
                        \\end{align*}
                    \\]
                    Por el método del multiplicador de Lagrange, primero definimos la función lagrangiana por:
                    \\[ \\psi(X) \\ = \\ A \\prod_{i=1}^{n} X_{i}^{\\alpha_{i}} \\ - \\ \\lambda \\ \\biggl( \\sum_{i=1}^{n} w_{i}X_{i} \\ - \\ c \\biggl) \\]
                </span>
                
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
      funcion_derivada_parcial_CD_con_phone.innerHTML = `
      \\[
          \\frac{\\partial \\psi }{\\partial X_{i}} \\
              = \\ A \\frac{\\alpha_{i}} {X_{i}}\\prod_{k=1}^{n} X_{k}^{\\alpha_{k}} \\ - \\ \\lambda w_{i} \\ 
              = \\ 0, \\ \\ \\ \\ \\forall \\ i = 1, .., n 
      \\]
    `;
      funcion_derivada_parcial_CD_con_lambda.innerHTML = `<p> \\[\\frac{\\partial{f}}{\\partial{\\lambda}} = \\sum_{i=1}^{${exponente}} w_{i}x_{i} \\ - \\ c = 0\\] </p>`;

      inicio_hessiana += `
                Primero, las derivadas parciales de segundo orden de la función Lagrangiana son:

                \\[
                    \\frac{\\partial^2 \\psi}{\\partial X_{i}^2} = A \\frac{\\alpha_{i} (\\alpha_{i} - 1)}{X_{i}^2} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}}
                \\]

                Para las derivadas cruzadas con \\(i \\neq j\\):

                \\[ \\frac{\\partial^2 \\psi}{\\partial X_{i} \\partial X_{j}} = A \\frac{\\alpha_{i} \\alpha_{j}}{X_{i} X_{j}} \\prod_{k=1}^{n} X_{k}^{\\alpha_{k}} \\]

                Así, la matriz Hessiana \\(H_{\\psi}(X) \\) es:

                <p class="hidden_pc">
                            \\[
                                H_{f}(x) = A 
                                \\begin{pmatrix}
                                    \\frac{\\alpha_1 (\\alpha_1 - 1) }{x_1^{2}}
                                    & \\cdots & \\frac{\\alpha_1 \\alpha_n}{x_1 x_n} \\\\
                                    \\frac{\\alpha_2 \\alpha_1}{x_2 x_1}
                                    & \\cdots & \\frac{\\alpha_2 \\alpha_n}{x_2 x_n} \\\\
                                    \\vdots & \\ddots & \\vdots \\\\
                                    \\frac{\\alpha_n \\alpha_1}{x_n x_1}
                                    & \\cdots & \\frac{\\alpha_n (\\alpha_n - 1)}{x_n^{2}}
                                \\end{pmatrix}
                                f(x)
                            \\]
                        </p>
                        <p class="hidden_phone">
                            \\[
                                H_{f}(x) = \\begin{pmatrix}
                                \\alpha_1 (\\alpha_1 - 1) 
                                & \\alpha_1 \\alpha_2 A \\cdot x_1^{\\alpha_1 - 1} \\cdot x_2^{\\alpha_2 - 1} \\cdots x_n^{\\alpha_n} 
                                & \\cdots & \\alpha_1 \\alpha_n A \\cdot x_1^{\\alpha_1 - 1} \\cdot x_2^{\\alpha_2} \\cdots x_n^{\\alpha_n - 1} \\\\
                                \\alpha_2 \\alpha_1 A \\cdot x_1^{\\alpha_1 - 1} \\cdot x_2^{\\alpha_2 - 1} \\cdots x_n^{\\alpha_n} 
                                & \\alpha_2 (\\alpha_2 - 1) A \\cdot x_1^{\\alpha_1} \\cdot x_2^{\\alpha_2 - 2} \\cdots x_n^{\\alpha_n} 
                                & \\cdots & \\alpha_2 \\alpha_n A \\cdot x_1^{\\alpha_1} \\cdot x_2^{\\alpha_2 - 1} \\cdots x_n^{\\alpha_n - 1} \\\\
                                \\vdots & \\vdots & \\ddots & \\vdots \\\\
                                \\alpha_n \\alpha_1 A \\cdot x_1^{\\alpha_1 - 1} \\cdot x_2^{\\alpha_2} \\cdots 
                                x_n^{\\alpha_n - 1} & \\alpha_n \\alpha_2 A \\cdot x_1^{\\alpha_1} \\cdot x_2^{\\alpha_2 - 1} 
                                \\cdots x_n^{\\alpha_n - 1} & \\cdots & \\alpha_n (\\alpha_n - 1) A \\cdot x_1^{\\alpha_1} 
                                \\cdot x_2^{\\alpha_2} \\cdots x_n^{\\alpha_n - 2}
                                \\end{pmatrix}
                            \\]
                        </p>
                        <p>
                            La cual es:
                            <ul>
                                <li>
                                    Definida positiva sí, para todo \\(i = 1, ..., n\\) tenemos que \\(\\alpha_{i} < 0\\) o, \\(\\alpha_{i} < 0\\) 
                                    y a lo más existe un \\(\\alpha_{j} > 1\\) con \\(j\\neq i\\), tal que \\(\\sum \\alpha_{i} > 1\\).
                                </li>
                                <li>
                                    Semidefinida positiva sí, para todo \\(i = 1, ..., n\\) tenemos que \\(\\alpha_{i} < 0\\) o, \\(\\alpha_{i} < 0\\)
                                    y a lo más existe un \\(\\alpha_{j} > 1\\) con \\(j\\neq i\\), tal que \\(\\sum \\alpha_{i} \\geq 1\\).
                                </li>
                                <li>
                                    Definida negativa sí \\(0 < \\alpha_{i} < 1\\) para todo \\(i = 1, ..., n\\) y \\(\\sum \\alpha_{i} < 1\\).
                                </li>
                                <li>
                                    Semidefinida negativa sí \\(0 < \\alpha_{i} < 1\\) para todo \\(i = 1, ..., n\\) y \\(\\sum \\alpha_{i} \\leq 1\\).
                                </li>
                            </ul>
                        </p>

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

                <p>Para verificar si el punto crítico maximiza o minimiza la función, calculamos el determinante de \\(\\Delta_${exponente}\\) como:</p>
                \\[
                    |\\Delta_n| = (-1)^{n} (f(X))^{n-1} 
                    \\prod_{i=1}^{n} \\frac{\\alpha_i}{X_{i}^{2}} 
                    \\left( 
                    \\sum_{i=1}^{n} 
                    \\left[ 
                    \\frac{w_{i}^{2} X_{i}^{2}}{\\alpha_i}
                    - \\sum_{\\substack{j = 2 \\\\ j > i}}^{n} 
                    \\frac{X_{i}^{2} X_{j}^{2}}{\\alpha_i \\alpha_j} 
                    \\left( 
                    \\frac{w_i \\alpha_j}{X_j}
                    - \\frac{w_j \\alpha_i}{X_i}
                    \\right)^{2}
                    \\right] 
                    \\right) 
                    \\]
                <p>
                    Entonces, al evaluar en el punto crítico, obtenemos que:
                </p>
                <ul>
                    <li>Sí, \\((-1)^{${exponente}} |\\Delta_${exponente}| > 0\\) y la matriz Hessiana es definida negativa, el punto crítico es un máximo local.</li>
                    <li>Sí, \\((-1)^{${exponente}} |\\Delta_${exponente}| > 0\\) y la matriz Hessiana es definida positiva, el punto crítico es un mínimo local.</li>
                    <li>Sí, \\((-1)^{${exponente}} |\\Delta_${exponente}| < 0\\) el punto crítico no es ni un máximo ni un mínimo local.</li>
                </ul>
            `;

      inicio_maximizador += `
        Para maximizar la utilidad de una empresa que modela una función (CD) de \\(q\\) unidades 
        utilizando insumos \\(X_{1}, \\ldots, X_{n}\\) a precios \\(w_{1}, \\ldots, w_{n}\\) por unidad 
        respectivamente, y sujeto a una restricción presupuestaria, se debe solucionar el siguiente 
        problema de optimización:

        \\[
            \\text{Maximizar } Q(X) = A \\prod_{i=1}^{n} X_{i}^{\\alpha_{i}}
        \\]
        \\[
            \\text{Sujeto a } C(X) = \\sum_{i=1}^{n} w_{i} X_{i} = c
        \\]

        Por el método del multiplicador de Lagrange, definimos la función Lagrangiana como:

        \\[
            \\psi(X) = A \\prod_{i=1}^{n} X_{i}^{\\alpha_{i}} - \\lambda \\left( 
            \\sum_{i=1}^{n} w_{i} X_{i} - c \\right)
        \\]

        Concluyendo así que,

        \\[ \\hat{X_{i}} \\ = \\ \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}}, \\ \\ \\ \\ \\ 
        \\forall \\ i \\ = \\ 1, ..., n \\]

        Por lo tanto, por el teorema de lagrange, este es el valor óptimo de cada variable \\(X_{i}\\) 
        para maximizar la función CD bajo la restricción presupuestaria. Sí comprobamos que \\((-1)^{n} |\\Delta_n| > 0\\) y la matriz Hessiana es definida negativa,
        esto garantiza que la función Cobb-Douglas tiene un máximo local bajo la restricción 
        presupuestaria. Por lo tanto, este es el valor óptimo de cada variable \\(X_{i}\\) que maximiza 
        la función CD bajo la restricción presupuestaria, es decir, el valor de \\(X\\) para el cual se 
        alcanza el máximo es \\((\\hat{X_{1}}, ..., \\hat{X_{n}})\\). Así, las cantidades que se deben 
        producir para maximizar la utilidad son:

        <p>
            \\[\\hat{Q} = \\hat{Q}(X_{1}, \\cdots, X_{n}) = Q(\\hat{X_{1}}, \\cdots, \\hat{X_{n}}) \\]

            Por lo cual, <strong>la función de oferta</strong> es: 

            \\[\\hat{Q}(X) \\ = \\ A \\prod_{i=1}^{n} \\biggl( \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} \\biggr)^{\\alpha_{i}} \\]

            Y <strong>la función de beneficio</strong> está dada por:

            \\[ \\hat{\\Pi}(x_{1}, ..., x_{n}) = P\\hat{Q}(X) - \\sum_{i=1}^{n} w_{i}\\hat{X_{i}} 
            = PA \\prod_{i=1}^{n} \\biggl( \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} 
            \\biggr)^{\\alpha_{i}} \\ - \\ \\sum_{i=1}^{n} w_{i} \\ \\biggl( 
            \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} \\biggr) \\]

            Por lo tanto,
            \\[ \\hat{\\Pi}(x_{1}, ..., x_{n}) =  PA \\biggl( \\frac{c}{\\sum_{i=1}^{n} \\alpha_{i}} 
            \\biggr)^{\\sum_{i=1}^{n} \\alpha_{i}} \\prod_{i=1}^{n} \\biggl( \\frac{\\alpha_{i}}{w_{i}}
            \\biggr)^{\\alpha_{i}} \\ - \\ c \\]
            Esto nos permite determinar cuánto beneficio genera la empresa bajo condiciones de 
            maximización, y como resultado final muestra que el beneficio está directamente relacionado 
            con los coeficientes \\(\\alpha_{i}\\) y los precios de los insumos, lo que subraya la 
            importancia de la estructura de costos y la eficiencia de la producción en la maximización 
            del beneficio.
        </p>
      `;

      inicio_minimizador += `
        Para minimizar los costos de producción de una empresa que modela una función de costos Cobb-Douglas, \\(C(X)\\), utilizando insumos \\(X_{1}, \\ldots, X_{n}\\) a precios \\(w_{1}, \\ldots, w_{n}\\) por unidad respectivamente, y sujeto a una restricción presupuestaria, se debe solucionar el siguiente problema de optimización:

        \\[
            \\text{Minimizar } C(X) = A \\prod_{i=1}^{n} X_{i}^{\\beta_{i}}
        \\]
        \\[
            \\text{Sujeto a } \\sum_{i=1}^{n} w_{i} X_{i} = c
        \\]

        Por el método del multiplicador de Lagrange, definimos la función Lagrangiana como:

        \\[
            \\mathcal{L}(X, \\lambda) = A \\prod_{i=1}^{n} X_{i}^{\\beta_{i}} + \\lambda \\left( c - \\sum_{i=1}^{n} w_{i} X_{i} \\right)
        \\]

        Esto nos permite encontrar las cantidades óptimas de insumos \\(\\hat{X_{i}}\\):

        \\[
        \\hat{X_{i}} = \\frac{\\beta_{i} c}{w_{i} \\sum_{j=1}^{n} \\beta_{j}}, \\quad \\forall i = 1, ..., n
        \\]

        Por lo tanto, el valor óptimo de cada variable \\(X_{i}\\) para minimizar la función de costos Cobb-Douglas bajo la restricción presupuestaria es:

        \\[
        \\hat{X_{i}} = \\frac{\\beta_{i} c}{w_{i} \\sum_{j=1}^{n} \\beta_{j}}, \\quad \\forall i = 1, ..., n
        \\]

        Si comprobamos que \\((-1)^{n} |\\Delta_n| > 0\\) y la matriz Hessiana es definida positiva, esto garantiza que la función de costos tiene un mínimo local bajo la restricción presupuestaria.

        Así, las cantidades que se deben producir para minimizar los costos son:

        <p>
            \\[\\hat{Q} = \\hat{Q}(X_{1}, \\cdots, X_{n}) = A \\prod_{i=1}^{n} \\hat{X_{i}}^{\\beta_{i}}\\]

            Por lo cual, <strong>la función de costos</strong> es:

            \\[C(X) = A \\prod_{i=1}^{n} \\hat{X_{i}}^{\\beta_{i}}\\]

            Esto nos permite determinar cuánto costo incurre la empresa bajo condiciones de minimización, mostrando que los costos están directamente relacionados con los precios de los insumos y la estructura de producción, lo que subraya la importancia de la eficiencia en la gestión de costos.
        </p>
      `;

      inicio_conclusion += `
        En este análisis hemos demostrado que la maximización de la utilidad y la minimización de los 
        costos en una función Cobb-Douglas son procesos fundamentales para la toma de decisiones en la 
        economía empresarial. A través del método del multiplicador de Lagrange, hemos encontrado las 
        condiciones óptimas para las variables de producción y costos, asegurando que las decisiones 
        tomadas estén alineadas con las restricciones presupuestarias.
        La utilización de la matriz Hessiana y el determinante bordeado nos permite clasificar los 
        puntos críticos obtenidos y garantizar que los resultados sean efectivamente máximos o mínimos 
        locales. En particular, hemos verificado que bajo las condiciones adecuadas, la función 
        Cobb-Douglas exhibe un máximo local en la maximización de utilidad y un mínimo local en la 
        minimización de costos, destacando la importancia de las relaciones entre los coeficientes de 
        producción, los precios de los insumos y la eficiencia en la gestión de recursos.
      `;

      break;

    default:
      text_ini_deri_parc_CD_con.innerHTML = `<p>
                La optimización de la función CD con restricciones implica encontrar los valores de \\(x_{i} \\ \\forall \\ i = ${lista_exp_CD} \\) que maximizan o
                minimizan la función \\(f(x)\\) sujeta a una restrincción presupuestaria. Por el método del multiplicador de Lagrange, 
                primero definimos la función lagrangiana por:

                <span class="hidden_phone">
                    \\[ \\psi(X) \\ = \\ \\psi(${lista_var_CD}) \\ = \\ A ${var_expo_func} \\ - \\ \\lambda \\ \\biggl( ${var_expo_costo} \\ - \\ c \\biggl) \\]
                </span>
                <span class="hidden_pc">
                    \\[ \\psi(X) \\ = \\ A \\prod_{i=1}^{${exponente}} x_{i}^{\\alpha_{i}} \\ - \\ \\lambda \\ \\biggl( \\sum_{i=1}^{${exponente}} w_{i}x_{i} \\ - \\ c \\biggl) \\]
                </span>
        
                Donde \\(\\lambda\\) es el multiplicador de Lagrange asociado a la restricción presupuestaria. Así, calculando las derivadas parciales de \\(\\psi\\) con respecto 
                a cada \\(X_{i} \\ \\ \\forall \\ \\ i = ${lista_exp_CD}\\), e igualando a cero, obtenemos que:
            </p>`;

      funcion_derivada_parcial_CD_con.innerHTML = `${inicio_deri_parc} </div>`;
      funcion_derivada_parcial_CD_con_phone.innerHTML = `${inicio_deri_parc_phone} `;
      funcion_derivada_parcial_CD_con_lambda.innerHTML = `<p> \\[\\frac{\\partial{f}}{\\partial{\\lambda}} = \\sum_{i=1}^{${exponente}} w_{i}x_{i} \\ - \\ c = 0\\] </p>`;

      inicio_hessiana += `
                <br><div id="hessiana_con"></div><br>
                <p>
                    Ahora bien, los menores principales son claves para analizar la definitud de la matriz Hessiana.
                    Para una matriz \\(${exponente} x ${exponente}\\), los menores principales son: 
                </p>
                <div id="menoresPrincipales" class="hidden_phone"></div>
                <div id="menoresPrincipales_phone" class="hidden_pc"></div>
                <p>Teniendo en cuenta que \\( H_{f} \\) es:</p>
                <ul>
                    <li>
                        definida positiva si \\( M_{i} > 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                    <li>
                        definida negativa si \\( (-1)^{i} M_{i} > 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                    <li>
                        semidefinida positiva si \\( M_{i} \\geq 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                    <li>
                        semidefinida negativa si \\( (-1)^{i} M_{i} \\geq 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                </ul>
                <p>
                    Luego de realizar un analísis a los valores que puede tener cada \\( \\alpha_{i} \\) y simplificando, obtenemos que \\( H_{f} \\) es:
                </p>
                <ul>
                    <li>
                        definida positiva si se da alguno de los siguientes casos: 
                        <br><br>
                        <ul>
                            <li>
                                ${exponentes_list_0}
                            </li>
                            <li>
                                \\( ${exponentes_suma} \\) > 1, \\( \\alpha_{i} < 0 \\) para cada \\( i \\) (\\( 1 \\leq i \\leq ${exponente} \\)) excepto para un único valor de \\( i \\), 
                                es decir, existe \\( j \\) tal que \\( j \\neq i \\) y \\( \\alpha_{j} > 1 \\)
                            </li>
                        </ul>
                        <br>
                    </li>
                    <li>
                        definida negativa si ${exponentes_list_0_1} y \\( ${exponentes_suma} \\) < 1
                    </li>
                    <br>
                    <li>
                        semidefinida positiva si se da alguno de los siguientes casos:
                        <br><br>
                        <ul>
                            <li>
                                ${exponentes_list_0}
                            </li>
                            <li>
                                \\( ${exponentes_suma} \\) \\( \\geq \\) 1, \\( \\alpha_{i} < 0 \\) para cada \\( i \\) (\\( 1 \\leq i \\leq ${exponente} \\))
                                excepto para un único valor de \\( i \\), es decir, existe \\( j \\) tal que \\( j \\neq i \\) y \\( \\alpha_{j} > 1 \\)
                            </li>
                        </ul>
                        <br>
                    </li>
                    <li>
                        semidefinida negativa si ${exponentes_list_0_1} y \\( ${exponentes_suma} \\) \\( \\leq \\) 1
                    </li>
                    <br>
                </ul>
                <p>
                    Una vez que se tiene la matriz Hessiana, se evalúa el determinante bordeado, lo cual nos permite clasificar los puntos críticos:
                </p> 
                <ul> 
                    <li>
                        <strong>Máximos Locales:</strong> Si el determinante bordeado es positivo y la matriz Hessiana es definida negativa.
                    </li> 
                    <li>
                        <strong>Mínimos Locales:</strong> Si el determinante bordeado es positivo y la matriz Hessiana es definida positiva.
                    </li> 
                    <li>
                        <strong>Puntos de Silla:</strong> Si el determinante bordeado es negativo, indicando que el punto crítico no es ni un máximo ni un mínimo local.
                    </li> 
                </ul> 
                <p>
                    Para el criterio del determinante bordeado, definimos la matriz \\(\\Delta_${exponente}\\) como una matriz simétrica \\(${parseInt(
        exponente
      ) + 1} \\times ${parseInt(exponente) + 1}\\):
                </p>
                <br><div id="hessiana_bordeada"></div><br>
                <p>Para verificar si el punto crítico maximiza o minimiza la función, calculamos el determinante de \\(\\Delta_${exponente}\\) como:</p>
                <br><div id="determinante_bordeado"></div><br>
                <p>
                    Entonces, al evaluar en el punto crítico, obtenemos que:
                </p>
                <ul>
                    <li>Sí, \\((-1)^{${exponente}} |\\Delta_${exponente}| > 0\\) y la matriz Hessiana es definida negativa, el punto crítico es un máximo local.</li>
                    <li>Sí, \\((-1)^{${exponente}} |\\Delta_${exponente}| > 0\\) y la matriz Hessiana es definida positiva, el punto crítico es un mínimo local.</li>
                    <li>Sí, \\((-1)^{${exponente}} |\\Delta_${exponente}| < 0\\) el punto crítico no es ni un máximo ni un mínimo local.</li>
                </ul>
                
            `;
      obtenerHessiana_Con(exponente);
      obtenerBordeado_Con(exponente);
      obtenerMenoresPrincipales_Con(exponente);

      break;
  }

  funcion_hessiana_CD_sin.innerHTML = inicio_hessiana;
  maximizar_CD_sin.innerHTML = inicio_maximizador;
  minimizar_CD_sin.innerHTML = inicio_minimizador;
  conclusion_CD_sin.innerHTML = inicio_conclusion;

  MathJax.typeset();
  const params = new URLSearchParams();
  params.append("n", exponente);
}
