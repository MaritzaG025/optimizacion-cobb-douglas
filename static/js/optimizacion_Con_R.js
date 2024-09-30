function mostrarHessiana_Con(hessianaLatex) {
  const hessianaDiv = document.getElementById("hessiana_con");
  hessianaDiv.innerHTML = `\\[ H_{\\psi} (x) = ${hessianaLatex.hessiana_con}\\]`;

  MathJax.typeset();
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

function mostrarCobbDouglasConPresupuesto(
  cant_variables,
  tecnologia_A,
  valor_exponentes,
  precios,
  presupuesto,
  calculos_CD_con,
  operacion_CD
) {
  // Extraer datos del cálculo
  let derivadas_CD_con = calculos_CD_con.derivadas;
  let arr_derivadas_CD_con_phone = String(derivadas_CD_con).split(",");
  let derivadas_CD_con_phone = ``;
  arr_derivadas_CD_con_phone.forEach(element => {
    derivadas_CD_con_phone += `<p>\\( ${element} \\)</p>`;
  });
  let punto_critico_CD_con = calculos_CD_con.puntos_criticos;
  let det_bordeado_CD_con = calculos_CD_con.det_bordeado;
  let det_bordeado_evaluado_CD_con = calculos_CD_con.det_bordeado_evaluado[0];
  let clasificacion_CD_con = (calculos_CD_con.det_bordeado_evaluado)[1];
  let valor_puntos_criticos = calculos_CD_con.valor_puntos_criticos;

  if (tecnologia_A == "1" || tecnologia_A == 1) {
    tecnologia_A = "";
  }

  let lista_var_CD_con = ``;
  let lista_var_CD_con_opt = ``;
  let inicio_func = `${tecnologia_A} `;
  let inicio_func_costo = ``;
  let inicio_func_opt = `${tecnologia_A} `;

  for (let i = 1; i <= cant_variables; i++) {
    lista_var_CD_con += `x_{${i}}`;
    lista_var_CD_con_opt += `\\hat{x}_{${i}}`;
    if (i < cant_variables) {
      lista_var_CD_con += ", \\ ";
      lista_var_CD_con_opt += ", \\ ";
    }

    if (valor_exponentes[i - 1] == "1" || valor_exponentes[i - 1] == 1) {
      inicio_func += `x_{${i}}`;
      inicio_func_opt += `\\hat{x}_{${i}}`;
    } else {
      inicio_func += `x_{${i}}^{${valor_exponentes[i - 1]}}`;
      inicio_func_opt += `\\hat{x}_{${i}}^{${valor_exponentes[i - 1]}}`;
    }

    if (precios[i - 1] == "1" || precios[i - 1] == 1) {
      inicio_func_costo += `x_{${i}}`;
    } else {
      inicio_func_costo += `${precios[i - 1]}x_{${i}}`;
    }

    if (i < cant_variables) {
      inicio_func_costo += " \\ + \\ ";
    }
  }

  let texto_resultante_max_min = "";

  switch (clasificacion_CD_con) {
    case " > 0 ":
      let parametro_optimizar = "mínimo";
      let operacion_optimizar = "minimizan";
      let funcion_optimizar_concava_convexa = "convexa";
      
      if (operacion_CD === "maximizar") {
        parametro_optimizar = "máximo"
        operacion_optimizar = "maximizan"
        funcion_optimizar_concava_convexa = "cóncava"
      }

      texto_resultante_max_min += `
        <p>
          Concluyendo, hemos encontrado un punto ${parametro_optimizar} local para la función Cobb-Douglas bajo la 
          restricción presupuestaria. Además, dado que la función Cobb-Douglas es ${funcion_optimizar_concava_convexa}, 
          este punto ${parametro_optimizar} es un ${parametro_optimizar} absoluto. Por lo tanto, los valores óptimos de 
          cada variable \\(${lista_var_CD_con}\\) que ${operacion_optimizar} la función son los que alcanzan el 
          ${parametro_optimizar}. Así, el valor de la función objetivo evaluada en las soluciones óptimas es:

          <span class="hidden_phone">
            \\[
              \\hat{f}(x) = f(\\hat{x}) = f(${lista_var_CD_con_opt}) = ${inicio_func_opt} = ${valor_puntos_criticos}
            \\]
          </span>
          <span class="hidden_pc">
            \\[
              \\hat{f}(x) = f(\\hat{x}) = ${inicio_func_opt} = ${valor_puntos_criticos}
            \\]
          </span>

          Concluyendo así que, la función en este punto opera de manera óptima, y no es posible mejorar 
          su valor sin ajustar el presupuesto o los precios de los insumos.
        </p>`;

        break;
  
    default:
      texto_resultante_max_min += `Concluyendo así que, el punto crítico no es ni un máximo ni un mínimo local. 
      Este resultado sugiere que la función no alcanza un óptimo en el punto crítico evaluado, lo que podría indicar 
      la presencia de un punto de silla o una falta de condiciones necesarias para la optimización con la restricción dada.`;
      break;
  }

  if (operacion_CD === "maximizar") {
    funcionDiv = document.getElementById("funcion_max_CD_con");
    lagrangianoDiv = document.getElementById("func_lagrangiana_max_con");
    derivadaDiv = document.getElementById("derivada_max_CD_con");
    puntosCriticosDiv = document.getElementById("puntos_criticos_max_CD_con");
    detBordeadoDiv = document.getElementById("det_bordeado_max_CD_con");
    detBordeadoEvaluadoDiv = document.getElementById("det_bordeado_max_CD_con_evaluado");
    conclusionResultanteDiv = document.getElementById("conclusion_max_CD_con_evaluado");
  } else if (operacion_CD === "minimizar") {
    funcionDiv = document.getElementById("funcion_min_CD_con");
    lagrangianoDiv = document.getElementById("func_lagrangiana_min_con");
    derivadaDiv = document.getElementById("derivada_min_CD_con");
    puntosCriticosDiv = document.getElementById("puntos_criticos_min_CD_con");
    detBordeadoDiv = document.getElementById("det_bordeado_min_CD_con");
    detBordeadoEvaluadoDiv = document.getElementById("det_bordeado_min_CD_con_evaluado");
    conclusionResultanteDiv = document.getElementById("conclusion_min_CD_con_evaluado");
  }

  funcionDiv.innerHTML = `
    <p class="hidden_phone">
        \\[
            \\begin{align*}
                \\text{${operacion_CD}:} && f(x) = f(${lista_var_CD_con}) =  ${inicio_func} \\\\
                \\text{Sujeto a:} && c(x) = c(${lista_var_CD_con}) = ${inicio_func_costo} = ${presupuesto} \\\\
            \\end{align*}
        \\]
    </p>
    <p class="hidden_pc">
        \\[
            \\begin{align*}
                \\text{${operacion_CD.substring(
                  0,
                  3
                )}:} && f(x) = ${inicio_func} \\\\
                \\text{Sujeto a:} && c(x) = ${inicio_func_costo} = ${presupuesto} \\\\
            \\end{align*}
        \\]
    </p>
  `;

  lagrangianoDiv.innerHTML = ` 
    <p class="hidden_phone">
      \\[
          \\psi(x) = \\psi(${lista_var_CD_con}) = ${inicio_func} - \\lambda \\left( ${inicio_func_costo} - ${presupuesto} \\right)  
      \\]
    </p>
    <p class="hidden_pc">
      \\[
        \\psi(x) = ${inicio_func} 
      \\] 
      \\[
        - \\lambda \\left( ${inicio_func_costo} - ${presupuesto} \\right)  
      \\]
    </p>
  `;

  derivadaDiv.innerHTML = `<div class="d-flex align-items-center flex-column">
                              ${derivadas_CD_con_phone}
                          </div>`;
  puntosCriticosDiv.innerHTML = `\\[ ${punto_critico_CD_con} \\]`;
  detBordeadoDiv.innerHTML = `\\[ ${det_bordeado_CD_con} \\]`;
  detBordeadoEvaluadoDiv.innerHTML = `\\[ ${det_bordeado_evaluado_CD_con} \\]`;
  conclusionResultanteDiv.innerHTML = texto_resultante_max_min;
  // detBordeadoresultanteDiv.innerHTML = `\\[ ${texto_resultante} \\]`;
  
  MathJax.typeset();
}

function obtenerCobbDouglasConPresupuesto(cant_var, operacion_CD) {
  let tecno_A = generarParametroA();
  let presupuesto = generarParametroPrecioTotal();
  let valor_exp = generarNumerosAleatorios(cant_var, operacion_CD);
  let precios = generarPrecios(cant_var);

  const data = {
    A: tecno_A,
    n: parseInt(cant_var),
    exponentes: valor_exp,
    precios: precios,
    presupuesto: presupuesto
  };

  // const data = {
  //   A: 10,
  //   n: 3,
  //   exponentes: [0.5, 0.3, 0.2],
  //   precios: [4,2,1],
  //   presupuesto: 100
  // };

  fetch("/calcular_cobb_douglas_con_presupuesto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      mostrarCobbDouglasConPresupuesto(
        cant_var,
        tecno_A,
        valor_exp,
        precios,
        presupuesto,
        data,
        operacion_CD
      );
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function generarNumerosAleatorios(cantidad, operacion_CD) {
  let numeros = [];
  let sumaTotal = 0;

  if (operacion_CD === "maximizar") {
    for (let i = 0; i < cantidad; i++) {
      let numero;

      do {
        numero = Math.random() * (1 - sumaTotal);
        numero = parseFloat(numero.toFixed(2));
      } while (numero === 0);

      // let numero = Math.random() * (1 - sumaTotal);
      // numero = parseFloat(numero.toFixed(2));
      numeros.push(numero);
      sumaTotal += numero;

      // Si es el último número, ajustamos para que la suma sea exactamente 1
      if (i === cantidad - 1 && sumaTotal > 1) {
        numeros[i] += parseFloat((1 - sumaTotal).toFixed(2));
      }
    }
  } else if (operacion_CD === "minimizar") {
    let cumpleCondicion = false;

    while (!cumpleCondicion) {
      numeros = [];
      let mayorUno = false;

      // Generar números
      for (let i = 0; i < cantidad; i++) {
        let numero;

        // Generar números aleatorios en el intervalo [-10, 10]
        numero = Math.random() * (10 - -10) + -10;
        numero = parseFloat(numero.toFixed(2));

        // Asegurar que la condición de números sea cumplida
        if (numero > 1) {
          if (mayorUno) {
            numero = -Math.abs(numero); // Si ya hay un número mayor a 1, hacer este menor a 0
          } else {
            mayorUno = true; // Permitir solo un número mayor a 1
          }
        } else {
          numero = -Math.abs(numero); // Hacer todos los números no mayores a 1 menores a 0
        }

        numeros.push(numero);
      }

      // Comprobar que la condición se cumple
      cumpleCondicion = numeros.filter(num => num > 1).length <= 1; // A lo sumo 1 número mayor a 1
    }
  }

  return numeros;
}

function generarParametroA(min = 1, max = 50) {
  let A_var = Math.random() * (max - min) + min;
  A_var = parseFloat(A_var.toFixed(2));
  return A_var;
}

function generarPrecios(cantidad, minPrecio = 10, maxPrecio = 100) {
  let precios = [];
  for (let i = 0; i < cantidad; i++) {
    let precio = Math.random() * (maxPrecio - minPrecio) + minPrecio;
    precios.push(parseInt(precio));
  }
  return precios;
}

function generarParametroPrecioTotal(min = 110, max = 1000) {
  let C_var = Math.random() * (max - min) + min;
  C_var = parseInt(C_var);
  return C_var;
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
                    \\text{Sujeto a:} && c(x) = c(${lista_var_CD}) = ${var_expo_costo} = c \\\\
                \\end{align*}
            \\]
        </p>
        <p class="hidden_pc">
            \\[
                \\begin{align*}
                    \\text{Max o Min:} && f(x) = A \\prod_{i=1}^{${exponente}} x_{i}^{\\alpha_{i}} \\\\
                    \\text{Sujeto a:} && c(x) = \\sum_{i=1}^{${exponente}} w_{i}x_{i} = c \\\\
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
                <span class="hidden_phone">
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
                </span>
                <span class="hidden_pc">
                  \\[
                    |\\Delta_n| = (-1)^{n} (f(X))^{n-1} 
                    \\prod_{i=1}^{n} \\frac{\\alpha_i}{X_{i}^{2}} 
                  \\]
                  \\[
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
                </span>
                
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

        Entonces, de acuerdo con el teorema de Lagrange, los valores óptimos de cada variable \\(X_{i}\\) 
        para maximizar la función CD bajo la restricción presupuestaria. Sí verificamos que \\((-1)^{n} |\\Delta_n| > 0\\) 
        y la matriz Hessiana es definida negativa, esto garantiza que la función CD tiene un máximo 
        local bajo la restricción presupuestaria. Además, si la función es cóncava, este máximo se convierte 
        en un máximo absoluto. Por lo tanto, los valores óptimos de cada variable \\(X_{i}\\) que maximizan 
        la función son los que alcanzan el máximo, representados como \\((\\hat{X_{1}}, ..., \\hat{X_{n}})\\). 
        Así, las cantidades que se deben producir para maximizar la utilidad son:

        <p>
            \\[\\hat{Q}(X) = \\hat{Q}(X_{1}, \\cdots, X_{n}) = Q(\\hat{X_{1}}, \\cdots, \\hat{X_{n}}) \\]

            Por lo cual, <strong>la función de oferta</strong> es: 

            \\[\\hat{Q}(X) \\ = \\ A \\prod_{i=1}^{n} \\biggl( \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} \\biggr)^{\\alpha_{i}} \\]

            Y <strong>la función de beneficio</strong> está dada por:

            <span class="hidden_phone">
              \\[ \\hat{\\Pi}(X) = \\hat{\\Pi}(X_{1}, ..., X_{n}) = P\\hat{Q}(X) - \\sum_{i=1}^{n} w_{i}\\hat{X_{i}} 
              = PA \\prod_{i=1}^{n} \\biggl( \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} 
              \\biggr)^{\\alpha_{i}} \\ - \\ \\sum_{i=1}^{n} w_{i} \\ \\biggl( 
              \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} \\biggr) \\]
            </span>
            <span class="hidden_pc">
              \\[ 
                \\hat{\\Pi}(X) = \\hat{\\Pi}(X_{1}, ..., X_{n}) = P\\hat{Q}(X) - \\sum_{i=1}^{n} w_{i}\\hat{X_{i}} 
              \\]

              \\[ 
                \\hat{\\Pi}(X) = PA \\prod_{i=1}^{n} \\biggl( \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} 
                \\biggr)^{\\alpha_{i}} \\ - \\ \\sum_{i=1}^{n} w_{i} \\ \\biggl( 
                \\frac{\\alpha_{i} \\ c}{w_{i} \\sum_{j=1}^{n} \\alpha_{j}} \\biggr) 
              \\]
            </span>

            Por lo tanto,
            \\[ \\hat{\\Pi}(X) =  PA \\biggl( \\frac{c}{\\sum_{i=1}^{n} \\alpha_{i}} 
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

        Por lo tanto, el valor óptimo de cada variable \\(X_{i}\\) para minimizar la función de costos CD bajo la restricción presupuestaria es:

        \\[
          \\hat{X_{i}} = \\frac{\\beta_{i} c}{w_{i} \\sum_{j=1}^{n} \\beta_{j}}, \\quad \\forall i = 1, ..., n
        \\]

        Sí verificamos que \\((-1)^{n} |\\Delta_n| > 0\\) y la matriz Hessiana es definida positiva, esto garantiza que la función CD tiene un mínimo 
        local bajo la restricción presupuestaria. Además, si la función es convexa, este mínimo se convierte 
        en un mínimo absoluto. Por lo tanto, los valores óptimos de cada variable \\(X_{i}\\) que minimizan 
        la función son los que alcanzan el mínimo, representados como \\((\\hat{X_{1}}, ..., \\hat{X_{n}})\\). 
        Así, las cantidades que se deben producir para minimizar los costos son:

        <p>
            \\[
              \\hat{C}(X) =  \\hat{C}(X_{1}, \\cdots, X_{n}) = C(\\hat{X_{1}}, \\cdots, \\hat{X_{n}})
            \\]

            Por lo cual, <strong>la función de costos</strong> es:

            \\[
              C(X) = A \\prod_{i=1}^{n} \\hat{X_{i}}^{\\beta_{i}}
              = A \\prod_{i=1}^{n} \\left( \\frac{\\beta_{i} c}{w_{i} \\sum_{j=1}^{n} \\beta_{j}} \\right)^{\\beta_{i}}
            \\]

            Esto nos permite determinar cuánto costo incurre la empresa bajo condiciones de minimización, 
            mostrando que los costos están directamente relacionados con los precios de los insumos y 
            la estructura de producción, lo que resalta la importancia de la eficiencia en la gestión de costos.
        </p>
      `;

      inicio_conclusion += `
        En este análisis, hemos demostrado que la maximización de la utilidad y la minimización de los 
        costos en una función Cobb-Douglas son procesos esenciales para la toma de decisiones en la 
        economía empresarial. A través del método del multiplicador de Lagrange, encontramos las 
        condiciones óptimas para las variables de producción y costos, asegurando que las decisiones 
        estén en concordancia con las restricciones presupuestarias impuestas.
        La utilización de la matriz Hessiana, junto con el cálculo del determinante bordeado, nos permite 
        clasificar los puntos críticos y determinar si estos corresponden a máximos o mínimos locales. 
        Adicionalmente, la caracterización de la convexidad y la concavidad de la función es crucial para 
        verificar la naturaleza de los extremos absolutos. Hemos comprobado que, bajo las condiciones 
        adecuadas, la función Cobb-Douglas exhibe un máximo absoluto en la maximización de la utilidad y un 
        mínimo absoluto en la minimización de los costos, lo que refuerza la importancia de las relaciones 
        entre los coeficientes de producción, los precios de los insumos y la eficiencia en la asignación de 
        recursos. Estos hallazgos señalan la relevancia de la optimización para una gestión eficiente y 
        efectiva de los recursos empresariales.
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

      inicio_maximizador += `
            <p>
                Una función CD se maximiza cuando el determinante bordeado es positivo y la matriz Hessiana es definida negativa. Sabemos que la matriz hessiana 
                \\( H_{${exponente}} f(x) \\) es definida negativa si ${exponentes_list_0_1} y \\( ${exponentes_suma} \\leq \\) 1
            </p>
            <p>
                <u> Ejemplo </u>: Supongamos que queremos maximizar la función Cobb-Douglas \\( f(x) \\) sujeta a la restricción presupuestal \\( c(x) \\), de la siguiente forma:
            </p>
            <br><div id="funcion_max_CD_con"></div><br>
            Por el método del multiplicador de Lagrange, definimos la función Lagrangiana como:
            <br><div id="func_lagrangiana_max_con"></div><br>
            <p>
              Calculando la derivada de \\( \\psi(x) \\) con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\), obtenemos que:
            </p>
            <br><div id="derivada_max_CD_con"></div><br>
            <p>
              Entonces, igualando la derivada a cero y resolviendo la ecuación, por el teorema de Lagrange, obtenemos que el valor óptimo para cada variable, 
              respectivamente, para maximizar la función CD bajo la restricción presupuestaria, es:
            </p>
            <div id="puntos_criticos_max_CD_con"></div>
            Por el valor de los exponentes de la función de producción CD, podemos afirmar que la matriz Hessiana \\(H_{\\psi}(X)\\) de la función Lagrangiana es definida negativa.

            Ahora bien, el determinante bordeado es:
            <br><div id="det_bordeado_max_CD_con"></div><br>

            Evaluando en el punto crítico, obtenemos que: 
            <br><div id="det_bordeado_max_CD_con_evaluado"></div><br>

            <div id="conclusion_max_CD_con_evaluado"></div>
      `;

      inicio_minimizador += `
        <p>
            Una función CD se minimiza cuando el determinante bordeado es positivo y la matriz Hessiana es definida positiva. 
            Sabemos que la matriz hessiana \\( H_{${exponente}} f(x) \\) es definida positiva si se cumple alguno de los siguientes casos:
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
        </p>
        <p>
            <u> Ejemplo </u>: Supongamos que queremos minimizar la función Cobb-Douglas \\( f(x) \\) sujeta a la restricción presupuestal \\( c(x) \\), de la siguiente forma:
        </p>
        <br><div id="funcion_min_CD_con"></div><br>
        Por el método del multiplicador de Lagrange, definimos la función Lagrangiana como:
        <br><div id="func_lagrangiana_min_con"></div><br>
        <p>
          Calculando la derivada de \\( \\psi(x) \\) con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\), obtenemos que:
        </p>
        <br><div id="derivada_min_CD_con"></div><br>
        <p>
          Entonces, igualando la derivada a cero y resolviendo la ecuación, por el teorema de Lagrange, obtenemos que el valor óptimo para cada variable, 
          respectivamente, para minimizar la función CD bajo la restricción presupuestaria, es:
        </p>
        <div id="puntos_criticos_min_CD_con"></div>
        Por el valor de los exponentes de la función de producción CD, podemos afirmar que la matriz Hessiana \\(H_{\\psi}(X)\\) de la función Lagrangiana es definida positiva.

        Ahora bien, el determinante bordeado es:
        <br><div id="det_bordeado_min_CD_con"></div><br>

        Evaluando en el punto crítico, obtenemos que: 
        <br><div id="det_bordeado_min_CD_con_evaluado"></div><br>

        <div id="conclusion_min_CD_con_evaluado"></div>
      `;

      inicio_conclusion += `
        En conclusión, este análisis nos ha permitido determinar los puntos críticos y asegurar que el máximo o mínimo absoluto se ha logrado 
        bajo las condiciones dadas. Estos resultados proporcionan una guía para optimizar la asignación de recursos en un escenario económico 
        real, maximizando la utilidad o minimizando los costos, de manera eficiente. Además, estos procedimientos resaltan la importancia de realizar un análisis exhaustivo de los puntos críticos, así como de explorar posibles 
        restricciones adicionales que puedan ser relevantes. Así, si un punto crítico no proporciona una solución óptima, entonces podemos considerar 
        sobre la eficiencia en la utilización de recursos y la necesidad de ajustar las estrategias de optimización en el contexto económico. 
        En futuras investigaciones, podría ser beneficioso considerar otros enfoques o técnicas que permitan identificar y alcanzar soluciones 
        óptimas dentro de los límites impuestos por la restricción presupuestaria.
      `;

      obtenerHessiana_Con(exponente);
      obtenerBordeado_Con(exponente);
      obtenerMenoresPrincipales_Con(exponente);
      obtenerCobbDouglasConPresupuesto(exponente, "maximizar");
      obtenerCobbDouglasConPresupuesto(exponente, "minimizar");
      MathJax.typeset();

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
