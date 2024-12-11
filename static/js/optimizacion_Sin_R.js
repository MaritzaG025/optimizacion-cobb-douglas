function mostrarHessiana(hessianaLatex) {
    const hessianaDiv = document.getElementById('hessiana');
    hessianaDiv.innerHTML = `\\[ H_{f} (x) = ${hessianaLatex}\\]`; 
    MathJax.typeset();
}

function obtenerHessiana(n) {
    fetch(`/calcular_hessiana?n=${n}`)
        .then(response => response.json())
        .then(data => {
            mostrarHessiana(data.hessiana);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function mostrarMenoresPrincipales(menoresPrincipalesLatex) {
    const menoresPrincipalesDiv = document.getElementById('menoresPrincipales');
    const menoresPrincipalesDiv_phone = document.getElementById('menoresPrincipales_phone');
    let contenido = '';
    let contenido_phone = '';
    menoresPrincipalesLatex.forEach((conjunto, idx) => {
        if (conjunto.length > 0) {
            let menores_principales_phone = ``;
            contenido += `<u>Menores Principales de Orden ${idx + 1}</u>:`;
            contenido_phone += `<u>Menores Principales de Orden ${idx + 1}</u>:`;
            // Añadir \biggl y \biggr a los menores principales
            contenido += `\\[ M_{${idx + 1}} = \\left\\{ ${conjunto.join(', ')} \\right\\} \\]`;
            conjunto.forEach(element => {
                menores_principales_phone += `<p>\\( ${element}, \\)</p>`
            });
            contenido_phone += `\\(M_{${idx + 1}}\\) = {
                                    <div class="w-full d-flex align-items-center flex-column">
                                        ${menores_principales_phone}
                                    </div> 
                                }`;
        }
    });

    menoresPrincipalesDiv.innerHTML = contenido;
    menoresPrincipalesDiv_phone.innerHTML = contenido_phone;
    MathJax.typeset();
}

function obtenerMenoresPrincipales(n) {
    fetch(`/calcular_menores_principales?n=${n}`)
        .then(response => response.json())
        .then(data => {
            mostrarMenoresPrincipales(data.menores_principales);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function mostrarCobbDouglasSin(cant_variables, tecnologia_A, valor_exponentes, calculos_CD_sin, operacion_CD) {
    let derivadas_CD_sin = calculos_CD_sin.derivadas;
    let arr_derivadas_CD_sin_phone = String(derivadas_CD_sin).split(",");
    let derivadas_CD_sin_phone = ``;
    arr_derivadas_CD_sin_phone.forEach(element => {
        derivadas_CD_sin_phone += `<p>\\( ${element} \\)</p>`
    });

    let punto_critico_CD_sin = calculos_CD_sin.puntos_criticos;
    let hessiana_CD_sin = calculos_CD_sin.hessiana;
    let hessiana_evaluada_CD_sin = calculos_CD_sin.hessiana_evaluada;
    hessiana_CD_sin += ` \\ \\Rightarrow \\ H_{f}(x) = ${hessiana_evaluada_CD_sin}`
    let menores_principales_CD_sin = calculos_CD_sin.menores_principales;
    let menores_evaluados_CD_sin = calculos_CD_sin.menores_evaluados;

    let contenido_men_prin = '';
    let contenido_men_prin_phone = '';
    
    menores_evaluados_CD_sin.forEach((conjunto_ev, id) => {
        if (conjunto_ev.length > 0) {
            menores_principales_CD_sin.forEach((conjunto, idx) => {
                if (conjunto.length > 0) {
                    let contenido_men_eva = '';
                    contenido_men_prin += `<u>Menores Principales de Orden ${idx + 1}</u>: `;
                    contenido_men_prin_phone += `<u>Menores Principales de Orden ${idx + 1}</u>: `;
                    conjunto.forEach(element => {
                        contenido_men_eva += `<p>\\( ${element}, \\)</p>`
                    });
                    contenido_men_prin_phone += `\\(M_{${idx + 1}}\\) = {
                        <div class="w-full d-flex align-items-center flex-column">
                            ${contenido_men_eva}
                        </div> 
                        }
                        \\[ \\Rightarrow \\ M_{${idx + 1}}(x) = \\left\\{ ${conjunto_ev[idx].join(', ')} \\right\\} \\]
                    `;
                    contenido_men_prin += `
                        \\[ M_{${idx + 1}}(x) = \\left\\{ ${conjunto.join(', ')} \\right\\}  \\ \\Rightarrow 
                        \\ M_{${idx + 1}}(x) = \\left\\{ ${conjunto_ev[idx].join(', ')} \\right\\} \\]
                    `;
                }
            });
        }
    });

    if (menores_evaluados_CD_sin.length == 0) {
        menores_principales_CD_sin.forEach((conjunto, idx) => {
            if (conjunto.length > 0) {
                let contenido_men_eva = '';
                contenido_men_prin += `<u>Menores Principales de Orden ${idx + 1}</u>: `;
                contenido_men_prin_phone += `<u>Menores Principales de Orden ${idx + 1}</u>: `;
                conjunto.forEach(element => {
                    contenido_men_eva += `<p>\\( ${element}, \\)</p>`
                });
                contenido_men_prin_phone += `\\(M_{${idx + 1}}\\) = {
                    <div class="w-full d-flex align-items-center flex-column">
                        ${contenido_men_eva}
                    </div> 
                    }
                    \\[ \\Rightarrow \\ M_{${idx + 1}}(x) = \\left\\{ \\text{N/A. No existen puntos críticos} \\right\\} \\]
                `;
                contenido_men_prin += `
                    \\[ M_{${idx + 1}}(x) = \\left\\{ ${conjunto.join(', ')} \\right\\}  \\ \\Rightarrow 
                    \\ M_{${idx + 1}}(x) = \\left\\{ \\text{N/A. No existen puntos críticos} \\right\\} \\]
                `;
            }
        });
    }

    if (tecnologia_A == "1" || tecnologia_A == 1) {
        tecnologia_A = "";
    };

    let inicio_var = `f(x) = f( `;
    let inicio_func = `) = ${tecnologia_A} `;
    for (let i = 1; i <= cant_variables; i++) {
        inicio_var += `x_{${i}}`;
        if (i < cant_variables) {
            inicio_var += ', \\ ';
        }

        if (valor_exponentes[i-1] == "1" || valor_exponentes[i-1] == 1){
            inicio_func += `x_{${i}}`
        }else{
            inicio_func += `x_{${i}}^{${valor_exponentes[i-1]}}`
        };
        
    }
    inicio_var += inicio_func;

    if (operacion_CD === "maximizar") {
        funcionDiv = document.getElementById('funcion_max_CD_sin');
        derivadaDiv = document.getElementById('derivada_max_CD_sin');
        puntosCriticosDiv = document.getElementById('puntos_criticos_max_CD_sin');
        hessianaDiv = document.getElementById('hessiana_max_CD_sin');
        menores_principales_Div = document.getElementById('menores_principales_max_CD_sin');
    }else if (operacion_CD === "minimizar"){
        funcionDiv = document.getElementById('funcion_min_CD_sin');
        derivadaDiv = document.getElementById('derivada_min_CD_sin');
        puntosCriticosDiv = document.getElementById('puntos_criticos_min_CD_sin');
        hessianaDiv = document.getElementById('hessiana_min_CD_sin');
        menores_principales_Div = document.getElementById('menores_principales_min_CD_sin');
    };

    funcionDiv.innerHTML = `\\[ ${inicio_var} \\]`;
    derivadaDiv.innerHTML = `<div class="d-flex align-items-center flex-column">
                                ${derivadas_CD_sin_phone}
                            </div>
                            `;
    puntosCriticosDiv.innerHTML = `\\[ ${punto_critico_CD_sin} \\]`;
    hessianaDiv.innerHTML = `
                                <p>
                                    \\[ H_{f}(x) = ${calculos_CD_sin.hessiana} \\]
                                    \\[ \\Rightarrow \\ H_{f}(x) = ${hessiana_evaluada_CD_sin} \\]
                                </p>
                            `;
    menores_principales_Div.innerHTML = `
                                <p>
                                    ${contenido_men_prin_phone}
                                </p>
                            `;
    MathJax.typeset();
}

function obtenerCobbDouglasSin(cant_var, operacion_CD) {
    let tecno_A = generarParametroA();
    let valor_exp = generarNumerosAleatorios(cant_var, operacion_CD);
    // let valor_exp = [0.5, 0.5];
    // Preparar los datos para enviar
    const data = {
        A: tecno_A,
        n: parseInt(cant_var),
        exponentes: valor_exp
    };

    // Realizar la solicitud POST al servidor
    fetch('/calcular_cobb_douglas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
            mostrarCobbDouglasSin(cant_var, tecno_A, valor_exp, data, operacion_CD);
        })
        .catch(error => {
            console.error('Error:', error);
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
                numero = Math.random() * (10 - (-10)) + (-10);
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
            cumpleCondicion = (numeros.filter(num => num > 1).length <= 1); // A lo sumo 1 número mayor a 1
        }
    }

    return numeros;
}

function generarParametroA(min = 0.1, max = 5) {
    let A_var = Math.random() * (max - min) + min;
    A_var = parseFloat(A_var.toFixed(2));
    return A_var;
}

function generateGraph(event) {
    event.preventDefault();

    const A = parseFloat(document.getElementById("A").value);
    const n = parseInt(document.getElementById("n").value);
    const alphas = [];

    for (let i = 1; i <= n; i++) {
        alphas.push(parseFloat(document.getElementById(`alpha${i}`).value));
    }

    if (n === 1) {
        plot1D(A, alphas[0]);
    } else if (n === 2) {
        plot2D(A, alphas);
    } else if (n > 2 && n <= 5) {
        plotPairs(A, alphas, n);
    } else {
        alert("Gráficos para más de 5 dimensiones no están soportados.");
    }
}

function plotPairs(A, alphas, n) {
    const x = Array.from({ length: 30 }, (_, i) => 0.1 + i * 0.3);
    const fixedValues = Array(n).fill(1); // Valores constantes para las variables no graficadas

    for (let i = 0; i < n - 1; i++) {
        for (let j = i + 1; j < n; j++) {
            const z = [];

            for (let xi = 0; xi < x.length; xi++) {
                z[xi] = [];
                for (let xj = 0; xj < x.length; xj++) {
                    // Producto de todas las variables, manteniendo constantes las no incluidas
                    let product = A;
                    for (let k = 0; k < n; k++) {
                        if (k === i) {
                            product *= Math.pow(x[xi], alphas[k]);
                        } else if (k === j) {
                            product *= Math.pow(x[xj], alphas[k]);
                        } else {
                            product *= Math.pow(fixedValues[k], alphas[k]);
                        }
                    }
                    z[xi][xj] = product;
                }
            }

            // Graficar la combinación (x[i], x[j])
            const trace = {
                x: x,
                y: x,
                z: z,
                type: "surface",
            };

            Plotly.newPlot(
                "graph",
                [trace],
                {
                    title: `Gráfico para (x${i + 1}, x${j + 1})`,
                    scene: {
                        xaxis: { title: `x${i + 1}` },
                        yaxis: { title: `x${j + 1}` },
                        zaxis: { title: "f(x)" },
                    },
                }
            );
        }
    }
}


function optimizacion_exp_sin(exponente) {
    let variable_cant = ' variables</span>';
    if (exponente == 1) {
        variable_cant = ' variable</span>';
    }
    const titulo_modal = document.getElementById("modalOptimizarLabel");
    titulo_modal.innerHTML = '<span>Optimización sin restricciones de la función de tipo Cobb-Douglas para ' + exponente + variable_cant;

    const titulo_opt_CD = document.getElementById("text_func_opt_CD");
    titulo_opt_CD.innerHTML = "<p>La función de tipo Cobb-Douglas (CD) a optimizar es: </p>";

    const funcion_optimizar_CD_sin = document.getElementById('funcion_optimizar_CD');
    let inicio_var = `f(x) = f( `;
    let var_list = ``;
    let var_list_CD = ``;
    let precio_var = ``;
    let costo_suma = ``;
    let new_costo_suma = ``;
    for (let i = 1; i <= exponente; i++) {
        inicio_var += `x_{${i}}`;
        var_list += `x_{${i}}`;
        var_list_CD += `\\widehat{x_{${i}}}`;
        precio_var += `w_{${i}}`;
        costo_suma += `w_{${i}}x_{${i}}`;
        new_costo_suma += `w_{${i}} \\widehat{x}_{${i}}`;
        if (i < exponente) {
            inicio_var += ', \\ ';
            var_list += ', \\ ';
            var_list_CD += ', \\ ';
            precio_var += ', \\ ';
            costo_suma += ' + ';
            new_costo_suma += ' + ';
        }
    }
    inicio_var += `) = A`;

    const funcion_derivada_parcial_CD_sin = document.getElementById("funcion_deri_parc_CD");
    let inicio_deri_parc = ``;

    const funcion_derivada_parcial_CD_sin_phone = document.getElementById("funcion_deri_parc_CD_phone");
    let inicio_deri_parc_phone = ``;

    const funcion_hessiana_CD_sin = document.getElementById("funcion_hessiana_CD");
    let inicio_hessiana = `<strong>Matriz Hessiana - Analísis de convexidad y concavidad</strong>
    <p>
        En el análisis de funciones económicas, las propiedades de convexidad y concavidad desempeñan un papel esencial, 
        especialmente en el estudio de las funciones CD. Estas propiedades determinan el comportamiento de la función y las 
        decisiones óptimas relacionadas con la asignación de recursos y la producción. Para evaluar dichas propiedades, 
        la matriz Hessiana constituye una herramienta analítica fundamental. La matriz Hessiana de \\(f(x)\\) se expresa como:
    </p>`;
    
    const maximizar_CD_sin = document.getElementById("maximizar_CD");
    let inicio_maximizador = '<strong>Maximización</strong>';

    const minimizar_CD_sin = document.getElementById("minimizar_CD");
    let inicio_minimizador = '<strong>Minimización</strong>';

    const conclusion_CD_sin = document.getElementById("conclusion_CD");
    let inicio_conclusion = '<strong>Conclusión</strong>';

    let indices_list = ``;
    let exponentes_list = ``;
    let exponentes_list_0 = ``;
    let exponentes_list_0_1 = ``;
    let exponentes_suma = ``;
    let signo_operacion = "";
    let deri_parc_costo = ``;
    let cant_insumo_costo = ``;
    let deri_parc_beneficio = ``;
    let cant_beneficio_costo = ``;
    let new_var_CD = ``;
    let exp_func_oferta = ``;
    let new_func_oferta = `\\[ f(\\widehat{x}) \\ = \\ \\biggl[ \\frac{1}{A} \\biggl( \\frac{1}{P} \\biggr) `;

    if (exponente == 'n') {
        indices_list = '1, ..., n';
    }
    if (exponente  % 2 === 0) {
        signo_operacion = "-";
    }else{
        signo_operacion = "";
    }

    for (let i = 1; i <= exponente; i++) {
        inicio_var += ` x_{${i}}^{\\alpha_{${i}}}`;
        inicio_deri_parc += `
            \\frac{\\partial f}{\\partial x_{${i}}} = \\alpha_{${i}} \\frac{f(x)}{x_{${i}}} = 0
        `;
        inicio_deri_parc_phone += `
            <p>
                \\( \\frac{\\partial f}{\\partial x_{${i}}} = \\alpha_{${i}} \\frac{f(x)}{x_{${i}}} = 0 \\)
            </p>
        `;
        deri_parc_costo += ` 
            \\[ \\frac{\\partial C}{\\partial x_{${i}}} = \\frac{w_{${i}}f(x) - f_{x_{${i}}}(x)(${costo_suma})}{f^{2}(x)} = 0 \\]
        `;
        deri_parc_beneficio += ` 
            \\[ \\frac{\\partial \\Pi}{\\partial x_{${i}}} = Pf_{x_${i}}(${var_list}) - w_{${i}} = 0 \\Rightarrow Pf_{x_${i}}(x) = w_{${i}} \\]
        `;
        
        indices_list += `${i}`;
        exponentes_list += `{\\alpha_{${i}}}`;
        exponentes_list_0 += `\\( \\alpha_{${i}}  < 0 \\)`;
        exponentes_list_0_1 += `\\( 0 < \\alpha_{${i}}  < 1 \\)`;
        exponentes_suma += `\\alpha_{${i}}`;
        if (i < exponente) {
            indices_list += ' , ';
            exponentes_list_0 += ' , ';
            exponentes_list_0_1 += ' , ';
            exponentes_suma += ' + ';
            inicio_deri_parc += ', \\ \\ \\ \\ \\';
        }
        cant_beneficio_costo += `\\[`;
        cant_insumo_costo += `\\[`;
        new_var_CD += ` 
            \\[ \\widehat{x_{${i}}} \\ = \\ \\biggl[ \\frac{1}{PA} 
        `;
        let exp_faltantes = ``;
        let suma_exp = ``;
        for (let index = 1; index <= exponente; index++) {
            new_var_CD += ` 
                \\biggl( \\frac{w_{${index}}}{\\alpha_{${index}}} \\biggr)
            `;
            if (i != index) {
                if (i == exponente & index == exponente - 1) {
                    cant_beneficio_costo += `
                    x_${i} = \\frac{ \\alpha_{${i}} w_{${index}}x_{${index}}}{ \\alpha_{${index}} w_{${i}}} \\ \\ \\ \\ 
                    `;
                    cant_insumo_costo += `
                    \\frac{w_{${i}}}{w_{${index}}} = \\frac{f_{x_${i}}(x)}{f_{x_{${index}}}(x)} \\ \\ \\ \\
                    `;
                }else{
                    cant_beneficio_costo += `
                    x_${i} = \\frac{ \\alpha_{${i}} w_{${index}}x_{${index}}}{ \\alpha_{${index}} w_{${i}}}, \\ \\ \\ \\ 
                    `;
                    cant_insumo_costo += `
                    \\frac{w_{${i}}}{w_{${index}}} = \\frac{f_{x_${i}}(x)}{f_{x_{${index}}}(x)}, \\ \\ \\ \\
                    `;
                }
                
                new_var_CD += ` 
                ^{\\alpha_{${index}}}
                `;
            }else{
                for (let j = 1; j <= exponente; j++) {
                    if (index != j) {
                        exp_faltantes += `\\alpha_{${j}}`;
                        if ((j < exponente && index != exponente) || (index == exponente && j < index - 1)) {
                            exp_faltantes += ' + ';
                        }
                    }
                }
                new_var_CD += ` 
                ^{1 - (${exp_faltantes})}
                `;
            }
            suma_exp += `\\alpha_{${index}}`;
            if (index < exponente) {
                suma_exp += ' + ';
            }
        }
        new_var_CD += ` 
            \\biggr] ^{ \\frac{1}{${suma_exp} - 1} } \\]
        `;
        cant_beneficio_costo += ` \\]`;
        cant_insumo_costo += ` \\]`;
        exp_func_oferta += `
        \\biggl( \\frac{w_{${i}}}{\\alpha_{${i}}} \\biggr) ^{\\alpha_{${i}}}
        `;
    }

    new_func_oferta += `
        ^{${exponentes_suma}} ${exp_func_oferta} \\biggr]  ^{\\frac{1}{${exponentes_suma} - 1}} \\]
    `;

    let new_func_beneficio = `
        \\[ \\Pi(\\widehat{x}) = (1 - ({${exponentes_suma}})) \\biggl[ \\frac{1}{PA} ${exp_func_oferta} \\biggr]  ^{\\frac{1}{${exponentes_suma} - 1}} \\]
    `;
    const text_ini_deri_parc_CD_sin = document.getElementById("text_ini_deri_parc_CD");
    text_ini_deri_parc_CD_sin.innerHTML = `
        <p>
            En optimización garantizar que una función alcance valores máximos y mínimos absolutos es esencial para asegurar 
            la existencia de soluciones óptimas globales. Desde un punto de vista económico esto permite determinar, 
            por ejemplo, el nivel máximo de producción, la mayor utilidad alcanzable o el costo mínimo bajo ciertas condiciones.
            A continuación, calculamos las derivadas parciales de \\(f(x)\\) con respecto a cada \\(x_{i}\\) para 
            \\(i = ${indices_list} \\) e igualamos a cero para encontrar los puntos críticos. Las derivadas parciales son:
        </p>
    `;
    const funcion_derivada_parcial_CD_sin_lambda = document.getElementById(
        "funcion_deri_parc_CD_lambda"
    );
    funcion_derivada_parcial_CD_sin_lambda.innerHTML = ``;

    switch (exponente) {
        case 1:
        case "1":
            funcion_optimizar_CD_sin.innerHTML = `\\(${inicio_var}\\)`;
            funcion_derivada_parcial_CD_sin.innerHTML = `\\(${inicio_deri_parc}\\)`;
            funcion_derivada_parcial_CD_sin_phone.innerHTML = `${inicio_deri_parc_phone}`;
            inicio_hessiana += `
                <div id="hessiana"></div>
                <p>
                    Para la función CD con una sola variable, esto generalmente no tiene soluciones para \\( x_{1} \\) a menos que \\( A \\) o \\( \\alpha_{1} \\) sean cero. 
                    Se puede calcular la segunda derivada para entender la curvatura de la función. La segunda derivada parcial de \\( f(x) \\) con respecto a \\( x_{1} \\) es:
                </p>
                <p>
                    \\[
                        \\frac{\\partial^2 f}{\\partial x_{1}^2} = \\alpha_{1} \\left( \\alpha_{1} - 1 \\right) \\frac{f(x)}{x_{1}^2}
                    \\]
                </p>
                <ul>
                    <li>
                        \\(\\alpha_{1} \\left( \\alpha_{1} - 1 \\right) = 0 \\), cuando \\( \\alpha_{1} = 0\\) o \\( \\alpha_{1} = 1 \\) 
                    </li>
                    <li>
                        \\(\\alpha_{1} \\left( \\alpha_{1} - 1 \\right) < 0 \\), cuando \\( 0 < \\alpha_{1} < 1\\) 
                    </li>
                    <li>
                        \\(\\alpha_{1} \\left( \\alpha_{1} - 1 \\right) > 0 \\), cuando \\( \\alpha_{1} < 0 \\) y \\( \\alpha_{1} > 1 \\) 
                    </li>
                </ul>
                <p>
                    Entonces,
                </p>
                <ul>
                    <li>
                        Sí \\(\ f^{''}(x) > 0 \\), la función es convexa en ese intervalo, es deicr, cuando \\(\ \\alpha_{1} \\geq 1 \\).
                    </li>
                    <li>
                        Sí \\(\ f^{''}(x) < 0 \\), la función es cóncava o estrictamente cóncava en ese intervalo, es decir, cuando \\(\ \\alpha_{1} < 0 \\).
                    </li>
                    <li>
                        La función \\(\ f(x) \\) es estrictamente convexa cuando \\(\ \\alpha_{1} > 1 \\). 
                    </li>
                </ul>
            `;

            inicio_maximizador += `
                <p>
                    Para maximizar funciones de producción o utilidad representadas por funciones CD, el comportamiento de la función depende del valor del exponente \\( \\alpha_1 \\). A continuación se detallan los casos más comunes:
                </p>
                <ul>
                    <li>
                        \\( \\alpha_1 < 0 \\): La función sigue creciendo indefinidamente sin alcanzar un máximo local, a menos que existan restricciones adicionales que limiten el crecimiento. Este comportamiento puede ser económico ineficiente, ya que un productor no maximiza su rendimiento bajo estas condiciones.
                    </li>
                    <li>
                        \\( 0 < \\alpha_1 < 1 \\): La función es creciente, pero a un ritmo decreciente. No alcanza un máximo local, ya que sigue creciendo a medida que \\( x_1 \\) aumenta, aunque de forma más lenta. Económicamente, esto refleja rendimientos marginales decrecientes en la producción a medida que se incrementan los insumos.
                    </li>
                    <li>
                        \\( \\alpha_1 = 1 \\): La función es lineal. No tiene máximos locales en el dominio positivo y sigue creciendo de manera constante conforme \\( x_1 \\) aumenta. En este caso, los recursos se asignan de manera proporcional, pero no existe un punto óptimo de producción.
                    </li>
                    <li>
                        \\( \\alpha_1 > 1 \\): La función crece indefinidamente a medida que \\( x_1 \\) aumenta, lo que indica que no existe un máximo local. Esto podría ser económicamente insostenible, ya que se requeriría un incremento continuo de insumos para lograr más producción, lo cual no es eficiente.
                    </li>
                </ul>
                <p>
                    En conclusión, maximizar funciones CD de una sola variable sin restricciones es inviable, ya que la función sigue creciendo indefinidamente, lo que no refleja un comportamiento óptimo desde el punto de vista económico.
                </p>
                <p>
                    <u>Ejemplo:</u> Supongamos que queremos maximizar la siguiente función CD:
                </p>
                <p>
                    \\[
                        f(x) = 2 x^{0.5}
                    \\]
                </p>
                <p>
                    Para obtener el valor óptimo de \\( x \\), calculamos la derivada de \\( f(x) \\) con respecto a \\( x \\):
                </p>
                <p>
                    \\[
                        \\frac{\\partial f}{\\partial x} = 2 \\cdot 0.5 \\cdot x^{0.5 - 1} = \\frac{1}{\\sqrt{x}}
                    \\]
                </p>
                <p>
                    Ahora, igualamos la derivada a cero para encontrar los puntos críticos:
                </p>
                <p>
                    \\[
                        \\frac{1}{\\sqrt{x}} = 0
                    \\]
                </p>
                <p>
                    Sin embargo, no hay soluciones para \\( x > 0 \\) que hagan que la derivada sea igual a cero, ya que \\( \\frac{1}{\\sqrt{x}} \\) siempre es positiva para \\( x > 0 \\). Esto implica que la función \\( f(x) \\) está siempre en crecimiento en el dominio positivo. 
                </p>
                <p>
                    Por lo tanto, sin restricciones adicionales, la función sigue creciendo a medida que \\( x \\) aumenta, lo que indica que no existe un máximo para \\( x > 0 \\). En términos económicos, esto sugiere que, si no se imponen restricciones, la producción continuará aumentando indefinidamente, lo que no es sostenible ni eficiente en el largo plazo.
                </p>
            `;

            inicio_minimizador += `
                <p>
                    Para minimizar una función CD que modela costos o gastos, se sigue el mismo proceso que para maximizar funciones de producción o utilidad, pero con la diferencia de que ahora buscamos el valor de \\( x_1 \\) que minimiza el costo en lugar de maximizar la utilidad. Es importante considerar los valores de \\( x_1 \\) en el dominio permitido y analizar el comportamiento en los extremos. A continuación, se presentan los casos más comunes:
                </p>
                <ul>
                    <li>
                        \\( \\alpha_1 < 0 \\): En este caso, el costo decrece indefinidamente conforme \\( x_1 \\) aumenta. Sin embargo, no existe un mínimo local en el dominio positivo. El costo se aproxima a cero cuando \\( x_1 \\) es extremadamente grande. Económicamente, esto podría implicar que los costos no se ajustan de manera eficiente, lo que no es un comportamiento realista en la mayoría de las situaciones.
                    </li>
                    <li>
                        \\( 0 < \\alpha_1 < 1 \\): Aquí, la función de costos sigue aumentando conforme \\( x_1 \\) crece, pero a un ritmo decreciente. La función no tiene un mínimo local, pero muestra un comportamiento de rendimientos marginales decrecientes. Este tipo de comportamiento es común en situaciones en las que aumentar el uso de un insumo genera costos adicionales que, aunque aumentan, lo hacen a un ritmo más bajo.
                    </li>
                    <li>
                        \\( \\alpha_1 = 1 \\): En este caso, la función de costos es lineal, lo que significa que los costos aumentan de manera constante conforme \\( x_1 \\) crece. Si \\( A > 0 \\), la función sigue creciendo conforme \\( x_1 \\) aumenta. Si \\( A < 0 \\), el mínimo se alcanza cuando \\( x_1 \\) es muy grande y \\( f(x) \\) se aproxima a cero.
                    </li>
                    <li>
                        \\( \\alpha_1 > 1 \\): Cuando \\( \\alpha_1 > 1 \\), la función presenta un mínimo en \\( x_1 = 0 \\), lo que sugiere que el costo mínimo se alcanza al optimizar la cantidad de insumos o factores de producción utilizados. Este escenario es común cuando se optimizan procesos de producción o distribución.
                    </li>
                </ul>
                <p>
                    Para funciones CD que modelan costos sin restricciones, si \\( \\alpha_1 > 1 \\), el mínimo de la función se encuentra en \\( x = 0 \\). Esto indica que el costo se optimiza al no utilizar ningún insumo, lo que podría interpretarse como un punto de eficiencia en algunos modelos.
                </p>
                <p>
                    <u>Ejemplo:</u> Supongamos que queremos minimizar la siguiente función CD que modela los costos de producción:
                </p>
                <p>
                    \\[
                        f(x) = 3 x^{2}
                    \\]
                </p>
                <p>
                    Para encontrar el valor de \\( x \\) que minimiza \\( f(x) \\), calculamos la derivada de \\( f(x) \\) con respecto a \\( x \\):
                </p>
                <p>
                    \\[
                        \\frac{\\partial f}{\\partial x} = 3 \\cdot 2 \\cdot x^{2 - 1} = 6x
                    \\]
                </p>
                <p>
                    Ahora, igualamos la derivada a cero para encontrar los puntos críticos:
                </p>
                <p>
                    \\[
                        6x = 0
                    \\]
                </p>
                <p>
                    Esto nos da el punto crítico \\( x = 0 \\). Para determinar si este punto es un mínimo o un máximo, calculamos la segunda derivada:
                </p>
                <p>
                    \\[
                        \\frac{\\partial^{2} f}{\\partial x^{2}} = 6 \\cdot x^{1 - 1} = 6
                    \\]
                </p>
                <p>
                    La segunda derivada es positiva (\\( 6 > 0 \\)) para todos los valores de \\( x \\), lo que indica que la función es convexa en todo su dominio. Como resultado, \\( x = 0 \\) es un punto mínimo global.
                </p>
                <p>
                    Sin embargo, desde una perspectiva económica, aunque \\( x = 0 \\) sea el mínimo matemático, este resultado no es realista. En la práctica, no es posible que \\( x \\) sea igual a cero, ya que siempre se requieren ciertos insumos o factores de producción. Por lo tanto, aunque el valor mínimo de la función sea 0 en \\( x = 0 \\), el valor óptimo de \\( x \\) debería ser diferente de cero, dependiendo del contexto y las restricciones del problema económico.
                </p>
            `;

            inicio_conclusion += `
                <p>
                    El comportamiento de la función depende del valor de \\( \\alpha_1 \\). Para funciones CD sin restricciones, si \\( \\alpha_1 > 1 \\), 
                    se puede minimizar la función en \\( x = 0 \\), lo que indica que el costo o el gasto puede ser optimizado al no utilizar insumos. Sin embargo, 
                    desde una perspectiva económica, aunque \\( x = 0 \\) sea el mínimo matemático, este resultado no es realista, ya que implica la ausencia total 
                    de factores de producción, lo cual no es posible en la práctica. Además, si \\( \\alpha_1 > 1 \\), maximizar la función sería imposible sin restricciones, 
                    ya que la función sigue creciendo conforme \\( x_1 \\) aumenta.
                </p>
            `;

            obtenerHessiana(exponente);

            break;
        case "n":
                    funcion_optimizar_CD_sin.innerHTML = `\\[f(x) = f(x_{1}, ..., x_{n}) = A\\prod_{i=1}^{n} x_{i}^{\\alpha_{i}}\\]`;
                    
                    funcion_derivada_parcial_CD_sin.innerHTML = `
                        \\[
                            \\frac{\\partial f}{\\partial x_{i}}
                            = A x_{1}^{\\alpha_{1}} \\cdots \\alpha_{i}x_{i}^{\\alpha_{i} - 1} \\cdots x_{n}^{\\alpha_{n}}
                            = \\frac{\\alpha_{i}Ax_{1}^{\\alpha_{1}}\\cdots x_{i}^{\\alpha_{i}} \\cdots x_{n}^{\\alpha_{n}}}{x_{i}}
                            = \\alpha_{i} \\frac{f(x)}{x_{i}}
                            = 0, 
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                        \\]
                        
                    `;
                    funcion_derivada_parcial_CD_sin_phone.innerHTML = `
                        \\[
                            \\frac{\\partial f}{\\partial x_{i}}
                            = A x_{1}^{\\alpha_{1}} \\cdots \\alpha_{i}x_{i}^{\\alpha_{i} - 1} \\cdots x_{n}^{\\alpha_{n}},
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                            \\]
                        \\[ \\Rightarrow
                            \\frac{\\partial f}{\\partial x_{i}}
                            = \\frac{\\alpha_{i}Ax_{1}^{\\alpha_{1}}\\cdots x_{i}^{\\alpha_{i}} \\cdots x_{n}^{\\alpha_{n}}}{x_{i}},
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                        \\]
                        \\[ \\Rightarrow
                            \\frac{\\partial f}{\\partial x_{i}}
                            = \\alpha_{i} \\frac{f(x)}{x_{i}}
                            = 0,
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                        \\]
                        
                    `;
                    inicio_hessiana = `<p><strong>Matriz Hessiana - Analísis de convexidad y concavidad</strong></p>`;
                    inicio_hessiana += `
                        <p>
                            En el análisis de funciones económicas, las propiedades de convexidad y concavidad desempeñan un papel esencial, 
                            especialmente en el estudio de las funciones CD. Estas propiedades determinan el comportamiento de la función y las 
                            decisiones óptimas relacionadas con la asignación de recursos y la producción. Para evaluar dichas propiedades, 
                            la matriz Hessiana constituye una herramienta analítica fundamental. La matriz Hessiana de \\(f(x)\\) se expresa como:
                        </p>
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
                        <p>
                            La estructura específica de la matriz Hessiana permite analizar cómo los valores de los parámetros \\(\\alpha_{i} (\\forall i = ${indices_list})\\) 
                            determinan la curvatura de la función \\(f(x)\\), lo que permite clasificarla como convexa o cóncava en un conjunto determinado, lo que a su vez ayuda a 
                            clasificar los puntos críticos de una función. Entonces, obtenemos que la función CD \\(f(x)\\), con \\(x \\in S \\subseteq \\mathbb{R}^{n}\\), es: 
                            <ul>
                                <li>
                                    Convexa sí \\(\\alpha_{i} \\notin [0, 1]\\) para todo \\(i = 1, ..., n\\) y tenemos que:
                                    <p class="hidden_phone">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ \\geq \\ 0
                                        \\ \\ \\ \\text{para} \\ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                    <p class="hidden_pc">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ \\geq \\ 0 \\]
                                        para \\[ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                </li>
                                <li>
                                    Estrictamente convexa sí \\(\\alpha_{i} \\notin [0, 1]\\) para todo \\(i = 1, ..., n\\) y tenemos que:
                                    <p class="hidden_phone">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ > \\ 0
                                        \\ \\ \\ \\text{para} \\ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                    <p class="hidden_pc">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ > \\ 0 \\]
                                        para \\[ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                </li>
                                <li>
                                    Cóncava sí \\(0 < \\alpha_{i} < 1\\) y \\(\\sum \\alpha_{i} \\leq 1\\) para todo \\(i = 1, ..., n\\).
                                </li>
                                <li>
                                    Estrictamente cóncava sí \\(0 < \\alpha_{i} < 1\\) y \\(\\sum \\alpha_{i} < 1\\) para todo \\(i = 1, ..., n\\).
                                </li>
                            </ul>
                        <p>
                        <p>
                            En términos generales, las propiedades de convexidad y concavidad en las funciones CD tienen implicaciones directas sobre el 
                            comportamiento de la producción en relación con los insumos. La convexidad sugiere que, al aumentar los insumos, la producción 
                            crece de manera más eficiente, lo que mejora el rendimiento de los recursos. Por el contrario, la concavidad 
                            implica que a medida que se incrementan los insumos la eficiencia de la producción o el rendimiento de los recursos disminuyen. 
                            De acuerdo con este resultado, concluimos que \\(f(x)\\), con \\(x \\in S \\subseteq \\mathbb{R}^{${exponente}}\\), tiene un: 
                            <ul>
                                <li>
                                    Mínimo absoluto sí \\(\\alpha_{i} \\notin [0, 1]\\) para todo \\(i = 1, ..., n\\) y tenemos que:
                                    <p class="hidden_phone">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ \\geq \\ 0
                                        \\ \\ \\ \\text{para} \\ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                    <p class="hidden_pc">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ \\geq \\ 0 \\]
                                        para \\[ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                </li>
                                <li>
                                    Mínimo absoluto estricto sí \\(\\alpha_{i} \\notin [0, 1]\\) para todo \\(i = 1, ..., n\\) y tenemos que:
                                    <p class="hidden_phone">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ > \\ 0
                                        \\ \\ \\ \\text{para} \\ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                    <p class="hidden_pc">
                                        \\[(-1)^{r+1} \\ \\alpha_{i_{1}} \\cdots \\alpha_{i_{r}} \\ \\biggl( \\sum \\alpha_{i_{k}} - 1 \\biggl) \\ > \\ 0 \\]
                                        para \\[ r = 1, ..., n \\ \\text{y} \\ k = 1, .., r. \\]
                                    </p>
                                </li>
                                <li>
                                    Máximo absoluto sí \\(0 < \\alpha_{i} < 1\\) y \\(\\sum \\alpha_{i} \\leq 1\\) para todo \\(i = 1, ..., n\\).
                                </li>
                                <li>
                                    Máximo absoluto estricto sí \\(0 < \\alpha_{i} < 1\\) y \\(\\sum \\alpha_{i} < 1\\) para todo \\(i = 1, ..., n\\).
                                </li>
                            </ul>
                        <p>
                    `;
        
                    inicio_maximizador += `
                        <p>
                            Para maximizar funciones CD de \\( n \\) variables, es esencial comprender cómo varían los exponentes \\( \\alpha_i \\).
                            <ul>
                                <li>
                                    \\( \\alpha_i < 0 \\ \\forall \\ i = 1, \\dots, n \\): La función crece conforme las variables \\( x_i \\) decrecen, 
                                    especialmente cuando \\( x_i \\) se acerca a cero. En este caso, es fundamental 
                                    analizar cómo interactúan todos los exponentes para determinar si el punto crítico es realmente un máximo local 
                                    en la optimización.
                                </li>
                                <li>
                                    \\( 0 < \\alpha_i < 1 \\ \\forall \\ i = 1, \\dots, n \\): La función crece a un ritmo decreciente. No existe un máximo 
                                    local, pero la función sigue aumentando a medida que las variables \\( x_i \\) crecen.
                                </li>
                                <li>
                                    \\( \\alpha_i = 1 \\ \\forall \\ i = 1, \\dots, n \\): La función es lineal con respecto a estas variables, sin máximos 
                                    locales en el dominio positivo. Aunque las variables \\( x_i \\) siguen creciendo, la función no presenta máximos locales. 
                                    Sin embargo, la combinación de otros exponentes podría generar un comportamiento no lineal 
                                    y, en algunos casos, un máximo.
                                </li>
                                <li>
                                    \\( \\alpha_i > 1 \\ \\forall \\ i = 1, \\dots, n \\): La función crece indefinidamente sin un máximo local, a menos que 
                                    existan restricciones adicionales. A medida que cualquiera de las variables \\( x_i \\) crece, la función también crece 
                                    de manera acelerada, lo que impide la existencia de un máximo sin restricciones.
                                </li>
                            </ul>
                        </p>
                        <p>
                            Maximizar funciones CD de \\( n \\) variables sin restricciones adicionales generalmente no es posible, 
                            ya que la función sigue creciendo indefinidamente conforme las variables \\( x_i \\) aumentan. Para encontrar un máximo local 
                            es necesario introducir restricciones como presupuestos o recursos limitados, o modificar la función para permitir un máximo en 
                            el dominio considerado.
                        </p>
                    `;

                    inicio_minimizador += `
                        <p>
                            Para minimizar funciones CD de \\( n \\) variables, es fundamental entender cómo varía el comportamiento de la 
                            función según los exponentes \\( \\alpha_i \\).
                            <ul>
                                <li>
                                    \\( \\alpha_i < 0 \\ \\forall \\ i = 1, \\dots, n \\): La función decrece conforme las variables \\( x_i \\) 
                                    crecen, lo que sugiere que podría alcanzar un mínimo en algún punto donde las variables \\( x_i \\) sean lo 
                                    suficientemente grandes. Sin embargo, sin restricciones adicionales la función podría seguir decreciendo indefinidamente.
                                </li>
                                <li>
                                    \\( \\alpha_i = 0 \\ \\forall \\ i = 1, \\dots, n \\): La función es constante con respecto a esas variables, 
                                    y no influye en la minimización directa. La función depende únicamente de las variables con exponentes no nulos.
                                </li>
                                <li>
                                    \\( \\alpha_i > 0 \\ \\forall \\ i = 1, \\dots, n \\): La función crece conforme las variables \\( x_i \\) 
                                    crecen, lo que significa que no tiene un mínimo local en el dominio positivo. El mínimo se alcanzaría en los bordes 
                                    del dominio, es decir, cuando alguna variable \\( x_i \\) tiende a cero. Sin embargo, para \\( x_i = 0 \\), la función 
                                    se anula o no está definida, lo que implica que no hay un mínimo local dentro del dominio positivo.
                                </li>
                                <li>
                                    Si los exponentes son una combinación de positivos y negativos, la función tendrá un comportamiento más 
                                    complejo y podría alcanzar un mínimo. En este caso, podría existir un mínimo local, cuya existencia depende del análisis detallado de las derivadas parciales y 
                                    la matriz Hessiana.
                                </li>
                            </ul>
                        </p>
                        <p>
                            Minimizar una función CD de \\( n \\) variables sin restricciones adicionales generalmente no es posible de manera directa. Sin embargo, 
                            cuando existen exponentes negativos o una combinación de exponentes positivos y negativos, la función puede decrecer en algunas direcciones, 
                            lo que permite la existencia de mínimos locales o globales bajo ciertas condiciones. Al igual que con la maximización, introducir restricciones 
                            es clave para encontrar un mínimo local.
                        </p>
                    `;


                    inicio_conclusion += `
                        <p>
                            Para la función CD planteada:
                        </p>
                        <ul>
                            <li>
                                No es posible obtener un máximo finito; la función tiende a infinito. Entonces, 
                                para maximizar la función \\( f(x) \\), es necesario considerar 
                                restricciones que limiten los valores de cada \\( x_{i} \\ \\forall \\ i = 1, ..., n \\ \\).
                            </li>
                            <li>
                                Alcanza su valor mínimo en los bordes del dominio, es decir, cuando al menos un 
                                \\( x_{i} = 0 \\ \\forall \\ i = 1, ..., n \\ \\). En estos puntos, el valor de la función es 0.
                            </li>
                        </ul>
                        <p>
                            En conclusión, la función CD sin restricciones sigue creciendo conforme aumentan los insumos y no es posible encontrar un punto máximo o mínimo.
                            Por lo tanto, las funciones CD estándar no tienen puntos críticos interiores sin restricciones. La maximización o minimización 
                            generalmente ocurre en los bordes del dominio, pero no en un punto interior donde las derivadas parciales se anulen. 
                            Para hallar puntos críticos, se necesita un contexto con restricciones (como restricciones de presupuesto, por ejemplo) 
                            o una función modificada que altere la forma estándar.
                        </p>
                        <p>
                            <u>Ejemplo:</u> 
                            Para una firma que utiliza ${exponente} insumos \\(x_{1}, ..., x_{n}\\) a precios \\(w_{1}, ..., w_{n}\\) por unidad 
                            respectivamente, el objetivo es minimizar el costo promedio, una medida clave de eficiencia económica. Este costo refleja el 
                            nivel de recursos necesarios para producir una unidad de producto, y su reducción permite identificar la combinación más eficiente 
                            de insumos para maximizar la producción al menor costo posible <a href="referencias#ref3" target="_blank">[3]</a>. 
                            Matemáticamente, el costo promedio se expresa como:
                            \\[ C(x) = \\frac{\\sum_{i=1}^{n} w_{i}x_{i} }{f(x)}\\]

                            donde \\(f = f(x_{1}, ..., x_{n})\\)  es la función de producción, la cual describe la relación matemática entre los insumos utilizados 
                            y la cantidad de producto final producido <a href="referencias#ref3" target="_blank">[3]</a>. Para minimizar el costo promedio \\(C\\), 
                            debemos calcular las derivadas parciales de \\(C\\) con respecto a cada insumo \\(x_{i} (\\forall i = ${indices_list})\\), y luego igualarlas 
                            a cero para obtener las condiciones necesarias de optimización. Esto es:

                            <span class="hidden_phone">
                                \\[ \\frac{\\partial C}{\\partial x_{i}} = \\frac{w_{i}f(x_{1}, ..., x_{n}) - f_{x_{i}}(x_{1}, ..., x_{n}) \\sum_{i=1}^{n} w_{i}x_{i}}{(f(x_{1}, ..., x_{n}))^{2}} = 0 \\]
                            </span>
                            <span class="hidden_pc">
                                \\[ \\frac{\\partial C}{\\partial x_{i}} = \\frac{w_{i}f(x_{1}, ..., x_{n}) - f_{x_{i}}(x_{1}, ..., x_{n}) \\sum_{i=1}^{n} w_{i}x_{i}}{(f(x_{1}, ..., x_{n}))^{2}} \\]
                                \\[ \\Rightarrow \\frac{\\partial C}{\\partial x_{i}} = 0 \\]
                            </span>
                            
                            para todo \\(i= 1, ..., n\\).  Esta ecuación equivale a:

                            <span class="hidden_phone">
                                \\[ w_{i}f(x_{1}, ..., x_{n}) - f_{x_{i}}(x_{1}, ..., x_{n}) \\sum_{i=1}^{n} w_{i}x_{i} = 0 \\ \\ \\Rightarrow \\ \\ w_{i}f(x_{1}, ..., x_{n}) = f_{x_{i}}(x_{1}, ..., x_{n}) \\sum_{i=1}^{n} w_{i}x_{i} \\]
                            </span>
                            <span class="hidden_pc">
                                \\[w_{i}f(x_{1}, ..., x_{n}) - f_{x_{i}}(x_{1}, ..., x_{n}) \\sum_{i=1}^{n} w_{i}x_{i} = 0 \\]
                                \\[\\Rightarrow w_{i}f(x_{1}, ..., x_{n}) = f_{x_{i}}(x_{1}, ..., x_{n}) \\sum_{i=1}^{n} w_{i}x_{i} \\]
                            </span>

                            para \\(i = 1, ..., n\\). Al fijar el índice \\(i\\), se busca comparar la relación entre el precio del insumo \\(x_i\\) y los precios de los otros insumos, 
                            con el fin de establecer un sistema de igualdades que permita determinar las cantidades óptimas de insumos. Al tomar el cociente entre las expresiones 
                            correspondientes a las derivadas parciales de la producción y los precios, obtenemos las siguientes relaciones:
                            <span class="hidden_phone">
                                \\[\\frac{w_{i}}{w_{1}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{1}}(x_{1}, ..., x_{n})}, \ \\cdots, \ \\frac{w_{i}}{w_{i-1}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i-1}}(x_{1}, ..., x_{n})}, \ \\frac{w_{i}}{w_{i+1}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i+1}}(x_{1}, ..., x_{n})}, \ \\cdots, \ \\frac{w_{i}}{w_{n}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{n}}(x_{1}, ..., x_{n})}\\]
                            </span>
                            <span class="hidden_pc">
                                \\[\\frac{w_{i}}{w_{1}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{1}}(x_{1}, ..., x_{n})},\\]
                                \\[\\cdots \\]
                                \\[\\frac{w_{i}}{w_{i-1}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i-1}}(x_{1}, ..., x_{n})}, \\]
                                \\[\\frac{w_{i}}{w_{i+1}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i+1}}(x_{1}, ..., x_{n})}, \\]
                                \\[\\cdots\\]
                                \\[\\frac{w_{i}}{w_{n}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{n}}(x_{1}, ..., x_{n})}\\]
                            </span>

                            para cada \\( i = 1, \\dots, n \\). Este conjunto de ecuaciones permite comparar las productividades marginales de los insumos, 
                            demostrando que la relación entre los precios de los insumos debe igualarse a la relación entre sus productividades marginales 
                            para minimizar el costo promedio. Esta condición de optimización es fundamental ya que al mantener dicha igualdad la 
                            firma asigna sus recursos de manera eficiente, asegurando que el costo de cada insumo ponderado por su precio, sea proporcional 
                            a su contribución a la producción.

                            Por otro lado, el beneficio económico se define como la diferencia entre los ingresos totales generados por la venta de los 
                            productos y los costos totales asociados a su producción <a href="referencias#ref3" target="_blank">[3]</a>. Si el productor 
                            vende su producto a un precio \\( P \\) por unidad, matemáticamente el beneficio, denotado por \\( \\Pi \\), se expresa como:

                            \\[ \\Pi(x_{1}, ..., x_{n}) = Pf(x_{1}, ..., x_{n}) - \\sum_{i=1}^{n} w_{i}x_{i} \\]

                            Este enfoque permite al productor analizar el impacto de las decisiones de asignación de recursos sobre la rentabilidad, considerando tanto los precios de los 
                            insumos como la eficiencia en la producción. Entonces,

                            <ul>
                                <li>
                                    Si \\( f(x_{1}, ..., x_{n}) \\) es homogénea de grado 1, no existe un máximo de beneficio, ya que el beneficio puede seguir creciendo indefinidamente 
                                    a medida que se aumenta la escala de producción.
                                </li>
                                <li>
                                    Si \\( f(x_{1}, ..., x_{n}) \\) no es homogénea de grado 1, la combinación de insumos que produce el mayor beneficio corresponde a las soluciones 
                                    del siguiente sistema de ecuaciones:
                                    <span class="hidden_phone">
                                        \\[
                                            \\frac{\\partial{\\Pi}}{\\partial x_{i}} = Pf_{x_{i}}(x_{1}, ..., x_{n}) - w_{i} = 0 \\Rightarrow Pf_{x_{i}}(x_{1}, ..., x_{n}) = w_{i} \\ \\ \\ \\text{ para todo } i=1, ...,n
                                        \\]
                                    </span>
                                    <span class="hidden_pc">
                                        \\[\\frac{\\partial{\\Pi}}{\\partial x_{i}} = Pf_{x_{i}}(x_{1}, ..., x_{n})-w_{i} = 0\\]
                                        \\[ \\Rightarrow \\frac{Pf_{x_{i}}(x_{1}, ..., x_{n}) = w_{i}\\]
                                        \\[\\text{ para todo } i=1, ...,n\\]
                                    </span>
                                    De esta manera, para maximizar las ganancias, una empresa debe usar cada recurso hasta el punto en que el valor adicional que aporta a la 
                                    producción sea igual al costo que implica su uso. Es decir, debe asegurarse de que lo que gana con cada recurso sea equivalente a lo que paga por él.
                                </li>
                            </ul>

                            Como resultado, las condiciones necesarias de primer orden para minimizar el costo promedio y maximizar el beneficio son las mismas, lo que implica que 
                            la eficiencia en la asignación de insumos para minimizar costos también asegura que el beneficio se maximice, bajo la condición de que la función de 
                            producción no sea homogénea de grado 1.

                            Ahora bien, consideremos que la firma emplea una tecnología de producción CD para maximizar su beneficio. La función de producción está dada por: 
                            \\[f(x_{1}, ..., x_{n}) = A\\prod_{i=1}^{n} x_{i}^{\\alpha_{i}}\\]
                        
                            \\(x_{i}\\) representa la cantidad del \\(i\\) - ésimo insumo, \\(\\alpha_{i}\\) son los parámetros de elasticidad de producción, y \\(A\\) es una 
                            constante de escala. Para determinar las condiciones de maximización de producción o minimización de costos, calculamos las productividades marginales 
                            de la siguiente forma:
                        
                            <span class="hidden_phone">
                                \\[f_{x_{1}}(x_{1}, ..., x_{n}) = \\alpha_{1} \\frac{f(x_{1}, ..., x_{n})}{x_{1}}, 
                                \\cdots, f_{x_{n}}(x_{1}, ..., x_{n}) = \\alpha_{n} \\frac{f(x_{1}, ..., x_{n})}{x_{n}}\\]
                            </span>
                            <span class="hidden_pc">
                                \\[f_{x_{1}}(x_{1}, ..., x_{n}) = \\alpha_{1} \\frac{f(x_{1}, ..., x_{n})}{x_{1}}, \\]
                                \\[\\cdots\\]
                                \\[f_{x_{n}}(x_{1}, ..., x_{n}) = \\alpha_{n} \\frac{f(x_{1}, ..., x_{n})}{x_{n}}\\]
                            </span>
                            
                            Para analizar las condiciones necesarias de maximización de beneficio, consideremos el cociente de las productividades marginales entre dos insumos 
                            \\(x_{i}\\) y \\(x_{j}\\), para \\(i, j = 1, ..., n\\) con \\(i \\neq j\\). Entonces,

                            <span class="hidden_phone">
                                \\[\\frac{w_{i}}{w_{j}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{j}}(x_{1}, ..., x_{n})} 
                                = \\frac{\\alpha_{i} \\frac{f(x_{1}, ..., x_{n})}{x_{i}}}{\\alpha_{j} \\frac{f(x_{1}, ..., x_{n})}{x_{j}}} 
                                = \\frac{\\alpha_{i}x_{j}}{\\alpha_{j}x_{i}}\\]
                            </span>
                            <span class="hidden_pc">
                                \\[\\frac{w_{i}}{w_{j}} = \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{j}}(x_{1}, ..., x_{n})} 
                                    = \\frac{\\alpha_{i} \\frac{f(x_{1}, ..., x_{n})}{x_{i}}}{\\alpha_{j} \\frac{f(x_{1}, ..., x_{n})}{x_{j}}} \\]
                                \\[\\Rightarrow \\frac{w_{i}}{w_{j}} = \\frac{\\alpha_{i}x_{j}}{\\alpha_{j}x_{i}}\\]
                            </span>
                            
                            lo cual es equivalente a,

                            \\[ x_{j} = x_{i} \\frac{w_{i} \\alpha_{j}}{w_{j}\\alpha_{i}} \\ \\ \\ \\text{para cada \\( j = 1, ..., n \\) con \\( i \\neq j \\)}\\]

                            Este cociente genera una relación entre los precios y las cantidades óptimas de los insumos \\(x_{i}\\) y \\(x_{j}\\) 
                            para cada \\(i, j = 1, ..., n\\) con \\(i \\neq j\\). Sustituyendo estas relaciones en la condición 
                            \\(P f_{x_{i}}(x_{1}, \\ldots, x_{n}) = w_{i}\\), se obtiene:

                            <span class="hidden_phone">
                                \\[P\\alpha_{i}A \\left[ \\left(x_{i} \\frac{w_{i} \\alpha_{1}}{w_{1}\\alpha_{i}} 
                                \\right)^{\\alpha_{1}} \\ \\cdots \\ \\left(x_{i} \\frac{w_{i} \\alpha_{i-1}}{w_{i-1}
                                \\alpha_{i}} \\right)^{\\alpha_{i-1}} \\ x_{i}^{\\alpha_{i} -1} \\ \\left(x_{i} 
                                \\frac{w_{i} \\alpha_{i+1}}{w_{1}\\alpha_{i}} \\right)^{\\alpha_{i+1}} \\ \\cdots 
                                \\ \\left(x_{i} \\frac{w_{i} \\alpha_{n}}{w_{n}\\alpha_{i}} \\right)^{\\alpha_{n}} 
                                \\right] = w_{i}\\]

                                Al simplificar esta expresión, se obtiene:
                            </span>

                            \\[ PA \\left( \\frac{w_{i}}{\\alpha_{i}}x_{i} \\right)^{\\sum_{j=1}^{n} 
                            \\alpha_{j} - 1} \\prod_{j=1}^{n} \\left(\\frac{\\alpha_{j}}{w_{j}} 
                            \\right)^{\\alpha_{j}} = 1 \\]

                            Esta ecuación muestra cómo los precios de los insumos influyen directamente en la cantidad demandada de cada uno de ellos. 
                            Específicamente, un aumento en \\(w_{i}\\) reduce la cantidad demandada del insumo \\(x_{i}\\) por parte de la firma, 
                            mientras que un aumento en el precio \\(w_{j}\\) puede llevar a la firma a demandar una mayor cantidad del insumo \\(x_{j}\\), 
                            resultado que conecta los precios relativos (\\(w_{i}\\), \\(w_{j}\\)), las elasticidades de producción (\\(\\alpha_{i}\\), 
                            \\(\\alpha_{j}\\)) y las cantidades óptimas de insumos. Ahora, despejando \\(x_{i}\\) 
                            se identifica la cantidad óptima de insumos que la firma debe utilizar para maximizar su beneficio. 

                            \\[  \\left(x_{i} \\right)^{\\sum_{j=1}^{n} \\alpha_{j} - 1}   = 
                            \\frac{1}{PA} \\left( \\frac{\\alpha_{i}}{w_{i}} \\right)^{\\sum_{j=1}^{n} \\alpha_{j} 
                            - 1}   \\prod_{j=1}^{n}\\left(\\frac{w_{j}}{\\alpha_{j}} \\right)^{\\alpha_{j}} \\]

                            Denominando \\(x_i\\) como \\(\\hat{x_i}\\), las cantidades de factores que se utilizan para maximizar el beneficio son: 

                            <span class="hidden_phone">
                                \\[\\hat{x_{i}} = \\left[ \\frac{1}{PA} \\left( \\frac{\\alpha_{i}}{w_{i}} 
                                \\right)^{\\sum_{j=1}^{n} \\alpha_{j} - 1}   \\prod_{j=1}^{n}\\left(\\frac{w_{j}}
                                {\\alpha_{j}} \\right)^{\\alpha_{j}} \\right]^{\\frac{1}{\\sum_{j=1}^{n} 
                                \\alpha_{j} - 1}} = \\frac{\\alpha_{i}}{w_{i}} \\left[\\frac{1}{PA}  
                                \\prod_{j=1}^{n}\\left(\\frac{w_{j}}{\\alpha_{j}} \\right)^{\\alpha_{j}} 
                                \\right]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}}\\]
                            </span>
                            <span class="hidden_pc">
                                \\[\\hat{x_{i}} = \\left[ \\frac{1}{PA} \\left( \\frac{\\alpha_{i}}{w_{i}} 
                                \\right)^{\\sum_{j=1}^{n} \\alpha_{j} - 1}   \\prod_{j=1}^{n}\\left(\\frac{w_{j}}
                                {\\alpha_{j}} \\right)^{\\alpha_{j}} \\right]^{\\frac{1}{\\sum_{j=1}^{n} 
                                \\alpha_{j} - 1}}\\]

                                \\[\\Rightarrow \\hat{x_{i}} = \\frac{\\alpha_{i}}{w_{i}} \\left[\\frac{1}{PA}  
                                \\prod_{j=1}^{n}\\left(\\frac{w_{j}}{\\alpha_{j}} \\right)^{\\alpha_{j}} 
                                \\right]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}}\\]
                            </span>

                            para cada \\( i=1, ..., n \\). De este modo, las cantidades óptimas que se producen para maximizar el beneficio son:

                            \\[f(\\hat{x}) = f(\\hat{x_{1}}, \\cdots, \\hat{x_{n}}) = \\left(\\frac{1}{P} 
                            \\right)^{\\frac{\\sum_{j=1}^{n} \\alpha_{j}}
                            {\\sum_{j=1}^{n} \\alpha_{j} - 1}} \\left[\\frac{1}{A}  \\prod_{j=1}^{n}
                            \\left(\\frac{w_{j}}{\\alpha_{j}} \\right)^{\\alpha_{j}} \\right]^{\\frac{1}
                            {\\sum_{j=1}^{n} \\alpha_{j} - 1}} \\]
                            
                            donde \\(\\widehat{x} = (\\hat{x_{1}}, \\cdots, \\hat{x_{n}}) \\). 
                            Esta expresión representa <strong>la función de oferta</strong>, que determina la cantidad de producción posible dadas las condiciones del mercado y la eficiencia en el 
                            uso de los insumos <a href="referencias#ref6" target="_blank">[6]</a>. Por otro lado, <strong>la función de beneficio</strong>, refleja el beneficio total 
                            obtenido por la firma al considerar tanto los ingresos generados por la venta del producto como los costos de los insumos <a href="referencias#ref3" target="_blank">[3]</a>. 
                            El beneficio máximo esta dado por:

                            \\[ \\Pi (\\hat{x}) = Pf(\\hat{x}) - \\sum_{i=1}^{n} w_{i}\\hat{x_{i}} \\]

                            <span class="hidden_phone">
                                Así,

                                \\[ \\Pi (\\hat{x}) = \\left[\\frac{1}{PA}  \\prod_{j=1}^{n}
                                \\left(\\frac{w_{j}}{\\alpha_{j}} \\right)^{\\alpha_{j}} \\right]^{\\frac{1}
                                {\\sum_{j=1}^{n} \\alpha_{j} - 1}} - \\sum_{i=1}^{n} \\alpha_{i} \\left[\\frac{1}{PA}
                                \\prod_{j=1}^{n}\\left(\\frac{w_{j}}{\\alpha_{j}} \\right)^{\\alpha_{j}} 
                                \\right]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}}\\]
                            </span>

                            Por lo cual,

                            \\[ \\Pi (\\hat{x}) = \\left( 1 - \\sum_{i=1}^{n} \\alpha_{i} \\right)
                            \\left[\\frac{1}{PA}  \\prod_{j=1}^{n}\\left(\\frac{w_{j}}{\\alpha_{j}} 
                            \\right)^{\\alpha_{j}} \\right]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}} \\]
                            Esto nos permite determinar el beneficio generado por la firma bajo condiciones de maximización, mostrando que el beneficio está directamente relacionado con los precios 
                            de los insumos \\(w_{i}\\), las cantidades de insumos utilizados \\(x_{i}\\) y los parámetros de elasticidad de producción \\(\\alpha_{i}\\), para todo \\(i = ${indices_list}\\). 
                            Estos factores subrayan la importancia de una utilización eficiente de los insumos y una adecuada gestión de los costos para maximizar el beneficio. 
                        </p>
                    `;
        
                    break;
        default:
            funcion_optimizar_CD_sin.innerHTML = `\\(${inicio_var}\\)`;
            funcion_derivada_parcial_CD_sin.innerHTML = `\\(${inicio_deri_parc}\\)`;
            funcion_derivada_parcial_CD_sin_phone.innerHTML = `${inicio_deri_parc_phone}`;
            inicio_hessiana += `
                <div id="hessiana"></div>
                <p>
                    La estructura específica de la matriz Hessiana permite analizar cómo los valores de los parámetros \\(\\alpha_{i} (\\forall i = ${indices_list})\\) 
                    determinan la curvatura de la función \\(f(x)\\), lo que permite clasificarla como convexa o cóncava en un conjunto determinado, lo que a su vez ayuda a 
                    clasificar los puntos críticos de una función. Ahora bien, los menores principales son claves para analizar la definitud de la matriz Hessiana. 
                    Para una matriz \\(${exponente} x ${exponente}\\), los menores principales son: 
                </p>
                <div id="menoresPrincipales" class="hidden_phone"></div>
                <div id="menoresPrincipales_phone" class="hidden_pc"></div>
                <p>Teniendo en cuenta que \\( H_{f}(x) \\) es:</p>
                <ul>
                    <li>
                        Definida positiva si \\( M_{i} > 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                    <li>
                        Definida negativa si \\( (-1)^{i} M_{i} > 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                    <li>
                        Semidefinida positiva si \\( M_{i} \\geq 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                    <li>
                        Semidefinida negativa si \\( (-1)^{i} M_{i} \\geq 0 \\) para \\( 1 \\leq i \\leq ${exponente} \\).
                    </li>
                </ul>
                <p>
                    A través del análisis de los menores principales de la matriz Hessiana y las condiciones sobre los parámetros 
                    \\(\\alpha_{i}  (\\forall i = ${indices_list})\\), se puede concluir que la matriz Hessiana \\( H_{f}(x) \\) es:
                </p>
                <ul>
                    <li>
                        Definida positiva si se da alguno de los siguientes casos: 
                        <ul>
                            <li>
                                ${exponentes_list_0}
                            </li>
                            <li>
                                \\( ${exponentes_suma} \\) > 1, \\( \\alpha_{i} < 0 \\) para cada \\( i \\) (\\( 1 \\leq i \\leq ${exponente} \\)) excepto para un único valor de \\( i \\), 
                                es decir, existe \\( j \\) tal que \\( j \\neq i \\) y \\( \\alpha_{j} > 1 \\)
                            </li>
                        </ul>
                    </li>
                    <li>
                        Definida negativa si ${exponentes_list_0_1} y \\( ${exponentes_suma} \\) < 1
                    </li>
                    <li>
                        Semidefinida positiva si se da alguno de los siguientes casos:
                        <ul>
                            <li>
                                ${exponentes_list_0}
                            </li>
                            <li>
                                \\( ${exponentes_suma} \\) \\( \\geq \\) 1, \\( \\alpha_{i} < 0 \\) para cada \\( i \\) (\\( 1 \\leq i \\leq ${exponente} \\))
                                excepto para un único valor de \\( i \\), es decir, existe \\( j \\) tal que \\( j \\neq i \\) y \\( \\alpha_{j} > 1 \\)
                            </li>
                        </ul>
                    </li>
                    <li>
                        Semidefinida negativa si ${exponentes_list_0_1} y \\( ${exponentes_suma} \\) \\( \\leq \\) 1
                    </li>
                </ul>
                <p>
                    Por lo tanto, 
                </p>
                <ul>
                    <li>
                        \\( f(x) \\) es convexa si \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\)  y 
                        ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( \\geq 0 \\)
                    </li>
                    <li>
                        \\( f(x) \\) es cóncava si y sólo si \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = ${indices_list} \\)  y  
                        \\( ${exponentes_suma} \\) \\( \\leq 1 \\)
                    </li>
                    <li>
                        \\( f(x) \\) es estrictamente convexa si \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\)  y 
                        ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( > 0 \\)
                    </li>
                    <li>
                        \\( f(x) \\) es estrictamente cóncava si y sólo si \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = ${indices_list} \\)  y  
                        \\( ${exponentes_suma} \\) \\( < 1 \\)
                    </li>
                </ul>
                <p>
                    En términos generales, las propiedades de convexidad y concavidad en las funciones CD tienen implicaciones directas sobre el 
                    comportamiento de la producción en relación con los insumos. La convexidad sugiere que, al aumentar los insumos, la producción 
                    crece de manera más eficiente, lo que mejora el rendimiento de los recursos. Por el contrario, la concavidad 
                    implica que a medida que se incrementan los insumos la eficiencia de la producción o el rendimiento de los recursos disminuyen. 
                    De acuerdo con este resultado, concluimos que \\(f(x)\\), con 
                    \\(x \\in S \\subseteq \\mathbb{R}^{${exponente}}\\), tiene un: 
                </p>
                <ul>
                    <li>
                        Mínimo absoluto sí \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\)  y 
                        ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( \\geq 0 \\)
                    </li>
                    <li>
                        Mínimo absoluto estricto sí \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\)  y 
                        ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( > 0 \\)
                    <li>
                        Máximo absoluto sí y sólo si \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = ${indices_list} \\)  y  
                        \\( ${exponentes_suma} \\) \\( \\leq 1 \\)
                    </li>
                    <li>
                        Máximo absoluto estricto sí y sólo si \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = ${indices_list} \\)  y  
                        \\( ${exponentes_suma} \\) \\( < 1 \\)
                    </li>
                </ul>
            `;
            inicio_maximizador += `
                <p>
                    Comúnmente las funciones CD se maximizan cuando \\( \\alpha_{i} > 0 \\ \\forall \\ \\ i = ${indices_list} \\),
                    y cuando la función está limitada (por ejemplo, restricciones presupuestarias). Ahora 
                    bien, podemos encontrar puntos máximos donde la función sea cóncava y encontrar el máximo global 
                    donde la función suele ser estrictamente cóncava. Entonces, si existen puntos críticos en la función
                    se puede maximizar funciones CD con valores
                    \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = ${indices_list} \\)  y  \\( ${exponentes_suma} \\) \\( \\leq 1 \\).
                </p>
                <p>
                    <u> Ejemplo </u>: Supongamos que queremos maximizar la función CD:
                </p>
                <div id="funcion_max_CD_sin"></div>
                <p>
                    Calculando la derivada de \\( f(x) \\) con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\), obtenemos que:
                </p>
                <div id="derivada_max_CD_sin"></div>
                <p>
                    Ahora debemos encontrar los puntos críticos, esto se realiza igualando las derivadas parciales a cero. Así,
                </p>
                <div id="puntos_criticos_max_CD_sin"></div>
                <p>
                    Igualando la derivada a cero y resolviendo la ecuación obtenemos que no hay valores con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\)
                    donde la derivada sea igual a cero, lo que indica que no hay un máximo para \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\)
                    dado que \\( \\frac{\\partial f}{\\partial x_{i}} > 0 \\) para todo \\( x_{i} > 0 \\) la función esta siempre en crecimiento. 
                    Sin restricciones adicionales, la función continúa aumentando a medida que \\( x_{i} \\) crece. Por lo tanto, la función no se puede maximizar.
                </p>
                <p>
                    Para determinar si los puntos críticos son máximos, mínimos o puntos de silla, se calcula la matriz Hessiana:
                </p>
                <div id="hessiana_max_CD_sin"></div>
                <p>
                    Ahora bien, los menores principales son claves para analizar la definitud de la matriz Hessiana, que a su vez ayuda a 
                    clasificar los puntos críticos de una función. Para una matriz \\(${exponente} x ${exponente}\\), los menores principales son: 
                </p>
                <div id="menores_principales_max_CD_sin"></div>
                <p>
                    Entonces, resolviendo la ecuación obtenemos que no hay valores con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\)
                    donde se pueda definir la Hessiana, lo que indica que no hay un máximo. Por lo tanto, la función no se puede maximizar.
                </p>
            `;

            inicio_minimizador += `
                <p>
                    La convexidad es clave para determinar la existencia de mínimos. Si una función CD es convexa, cualquier punto crítico 
                    encontrado será un mínimo. Además, si la función es estrictamente convexa, dicho mínimo será global.
                    Por lo tanto, si existen puntos críticos en la función, es posible minimizar funciones CD bajo las condiciones 
                    \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\) y 
                    ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( \\geq 0 \\).
                </p>
                <p>
                    <u> Ejemplo </u>: Supongamos que queremos minimizar la función CD:
                </p>
                <div id="funcion_min_CD_sin"></div>
                <p>
                    Calculando la derivada de \\( f(x) \\) con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\), obtenemos que:
                </p>
                <div id="derivada_min_CD_sin"></div>
                <p>
                    Ahora debemos encontrar los puntos críticos, esto se realiza igualando las derivadas parciales a cero. Así,
                </p>
                <div id="puntos_criticos_min_CD_sin"></div>
                <p>
                    Para determinar si los puntos críticos son máximos, mínimos o puntos de silla, se calcula la matriz Hessiana:
                </p>
                <div id="hessiana_min_CD_sin"></div>
                <p>
                    Ahora bien, los menores principales son claves para analizar la definitud de la matriz Hessiana, que a su vez ayuda a 
                    clasificar los puntos críticos de una función. Para una matriz \\(${exponente} x ${exponente}\\), los menores principales son: 
                </p>
                <div id="menores_principales_min_CD_sin"></div>
                <p>
                    Entonces, resolviendo la ecuación obtenemos que no hay valores con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\)
                    donde se pueda definir la Hessiana, lo que indica que no hay un mínimo. Por lo tanto, la función no se puede minimizar.
                </p>
            `;

            inicio_conclusion += `
                <p>
                            Para la función CD planteada:
                        </p>
                        <ul>
                            <li>
                                No es posible obtener un máximo finito; la función tiende a infinito. Entonces, 
                                para maximizar la función \\( f(x) \\), es necesario considerar 
                                restricciones que limiten los valores de cada \\( x_{i} \\ \\forall \\ ${indices_list} \\ \\).
                            </li>
                            <li>
                                Alcanza su valor mínimo en los bordes del dominio, es decir, cuando al menos un 
                                \\( x_{i} = 0 \\ \\forall \\ i = ${indices_list} \\ \\). En estos puntos, el valor de la función es 0.
                            </li>
                        </ul>
                        <p>
                            En conclusión, la función CD sin restricciones sigue creciendo conforme aumentan los insumos y no es posible encontrar un punto máximo o mínimo.
                            Por lo tanto, las funciones CD estándar no tienen puntos críticos interiores sin restricciones. La maximización o minimización 
                            generalmente ocurre en los bordes del dominio, pero no en un punto interior donde las derivadas parciales se anulen. 
                            Para hallar puntos críticos, se necesita un contexto con restricciones (como restricciones de presupuesto, por ejemplo) 
                            o una función modificada que altere la forma estándar.
                        </p>
                <p>
                    <u> Ejemplo </u>: Para una firma que utiliza ${exponente} insumos \\(${var_list}\\) a precios \\(${precio_var}\\) por unidad 
                    respectivamente, el objetivo es minimizar el costo promedio, una medida clave de eficiencia económica. Este costo refleja el 
                    nivel de recursos necesarios para producir una unidad de producto, y su reducción permite identificar la combinación más eficiente 
                    de insumos para maximizar la producción al menor costo posible <a href="referencias#ref3" target="_blank">[3]</a>. 
                    Matemáticamente, el costo promedio se expresa como:
                    \\[ C(x) =  \\frac{${costo_suma}}{f(x)} \\]
                    donde \\(x =(${var_list})\\) es un vector de ${exponente} variables independientes y \\(f(x)\\) es la función de producción, 
                    la cual describe la relación matemática entre los insumos utilizados y la cantidad de producto final producido 
                    <a href="referencias#ref3" target="_blank">[3]</a>. Para minimizar el costo promedio \\(C\\), debemos calcular las derivadas 
                    parciales de \\(C\\) con respecto a cada insumo \\(x_{i} (\\forall i = ${indices_list})\\), y luego igualarlas a cero para obtener las 
                    condiciones necesarias de optimización. Esto es:
                    ${deri_parc_costo}
                    Al tomar el cociente entre las expresiones correspondientes a las derivadas parciales de la producción y los precios, para cada  
                    \\(x_{i} (\\forall i = ${indices_list})\\), obtenemos las siguientes relaciones:
                    ${cant_insumo_costo}
                    Este conjunto de ecuaciones permite comparar las productividades marginales de los insumos, 
                    demostrando que la relación entre los precios de los insumos debe igualarse a la relación entre sus productividades marginales 
                    para minimizar el costo promedio. Esta condición de optimización es fundamental ya que al mantener dicha igualdad la 
                    firma asigna sus recursos de manera eficiente, asegurando que el costo de cada insumo ponderado por su precio, sea proporcional 
                    a su contribución a la producción.

                    Por otro lado, el beneficio económico se define como la diferencia entre los ingresos totales generados por la venta de los 
                    productos y los costos totales asociados a su producción <a href="referencias#ref3" target="_blank">[3]</a>. Si el productor 
                    vende su producto a un precio \\( P \\) por unidad, matemáticamente el beneficio, denotado por \\( \\Pi \\), se expresa como:
                    \\[ \\Pi(${var_list}) = Pf(${var_list}) - (${costo_suma}) \\]
                    Este enfoque permite al productor analizar el impacto de las decisiones de asignación de recursos sobre la rentabilidad, considerando tanto los precios 
                    de los insumos como la eficiencia en la producción. Entonces,
                    <ul>
                        <li>
                            Si \\( f(${var_list}) \\) es homogénea de grado 1, no existe un máximo de beneficio, ya que el beneficio puede seguir creciendo indefinidamente 
                            a medida que se aumenta la escala de producción.
                        </li>
                        <li>
                            Si \\( f(${var_list}) \\) no es homogénea de grado 1, la combinación de insumos que produce el mayor beneficio corresponde a las soluciones 
                            del siguiente sistema de ecuaciones:
                            ${deri_parc_beneficio}
                            De esta manera, para maximizar las ganancias, una empresa debe usar cada recurso hasta el punto en que el valor adicional que aporta a la 
                            producción sea igual al costo que implica su uso. Es decir, debe asegurarse de que lo que gana con cada recurso sea equivalente a lo que paga por él.
                        </li>
                    </ul>
                    Como resultado, las condiciones necesarias de primer orden para minimizar el costo promedio y maximizar el beneficio son las mismas, lo que implica 
                    que la eficiencia en la asignación de insumos para minimizar costos también asegura que el beneficio se maximice, bajo la condición de que la función 
                    de producción no sea homogénea de grado 1.
                    
                    Ahora bien, consideremos que la firma emplea una tecnología de producción CD para maximizar su beneficio. La función de producción está dada por:
                    \\[ ${inicio_var} \\] 
                    donde \\(x_{i}\\) representa la cantidad del \\(i\\) - ésimo insumo, \\(\\alpha_{i}\\) son los parámetros de elasticidad de producción, y \\(A\\) 
                    es una constante de escala, para todo \\( i = ${indices_list}\\). Para determinar las condiciones de maximización de producción o minimización de costos, 
                    calculamos las productividades marginales y reemplazando en el cociente de las condiciones necesarias, obtenemos que: ${cant_beneficio_costo} <br>
                    
                    Esta ecuación muestra cómo los precios de los insumos influyen directamente en la cantidad demandada de cada uno de ellos. Sustituyendo estas relaciones 
                    en la condición \\( Pf_{x_i} = w_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\) y, despejando \\(x_{i}\\) y denominándola como \\(\\hat{x_i}\\), 
                    se identifica la <strong>cantidad óptima de insumos</strong> que la firma debe utilizar para maximizar su beneficio. 
                    Las cantidades de factores que se utilizan para maximizar el beneficio son: ${new_var_CD}
                    
                    De este modo, las cantidades óptimas que se producen para maximizar el beneficio son:  ${new_func_oferta} donde \\(\\widehat{x} = (${var_list_CD}) \\). 
                    Esta expresión representa <strong>la función de oferta</strong>, que determina la cantidad de producción posible dadas las condiciones del mercado y la eficiencia en el 
                    uso de los insumos <a href="referencias#ref6" target="_blank">[6]</a>. Por otro lado, <strong>la función de beneficio</strong>, refleja el beneficio total 
                    obtenido por la firma al considerar tanto los ingresos generados por la venta del producto como los costos de los insumos <a href="referencias#ref3" target="_blank">[3]</a>. 
                    El beneficio máximo esta dado por:
                    \\[ \\Pi(\\widehat{x}) = Pf(\\widehat{x}) - (${new_costo_suma}) \\]
                    Por lo tanto, ${new_func_beneficio}
                    Esto nos permite determinar el beneficio generado por la firma bajo condiciones de maximización, mostrando que el beneficio está directamente relacionado con los precios 
                    de los insumos \\(w_{i}\\), las cantidades de insumos utilizados \\(x_{i}\\) y los parámetros de elasticidad de producción \\(\\alpha_{i}\\), para todo \\(i = ${indices_list}\\). Estos factores subrayan la 
                    importancia de una utilización eficiente de los insumos y una adecuada gestión de los costos para maximizar el beneficio. 
                </p>
            `;

            obtenerCobbDouglasSin(exponente, "maximizar");
            obtenerCobbDouglasSin(exponente, "minimizar");
            obtenerHessiana(exponente);
            obtenerMenoresPrincipales(exponente);
            break;
    }

    funcion_hessiana_CD_sin.innerHTML = inicio_hessiana;
    maximizar_CD_sin.innerHTML = inicio_maximizador;
    minimizar_CD_sin.innerHTML = inicio_minimizador;
    conclusion_CD_sin.innerHTML = inicio_conclusion;

    // Renderiza las expresiones matemáticas con MathJax
    MathJax.typeset();
    const params = new URLSearchParams();
    params.append('n', exponente);

}
