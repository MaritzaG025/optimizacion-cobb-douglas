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

function optimizacion_exp_sin(exponente) {
    let variable_cant = ' variables</span>';
    if (exponente == 1) {
        variable_cant = ' variable</span>';
    }
    const titulo_modal = document.getElementById("modalOptimizarLabel");
    titulo_modal.innerHTML = '<span>Optimización sin restricciones de la función de tipo Cobb-Douglas para ' + exponente + variable_cant;

    const titulo_opt_CD = document.getElementById("text_func_opt_CD");
    titulo_opt_CD.innerHTML = "<p>La función Cobb-Douglas (CD) a optimizar es: </p>";

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
    let inicio_hessiana = `<strong>Matriz Hessiana - Analísis de convexidad y concavidad</strong><p>Para determinar 
    si los puntos críticos son máximos, mínimos o puntos de silla, se calcula la matriz Hessiana \\(H_{f} (x)\\):</p>`;
    
    const maximizar_CD_sin = document.getElementById("maximizar_CD");
    let inicio_maximizador = '<strong>Maximización</strong>';

    const minimizar_CD_sin = document.getElementById("minimizar_CD");
    let inicio_minimizador = '<strong>Minimización</strong>';

    const conclusion_CD_sin = document.getElementById("conclusion_CD");
    let inicio_conclusion = '<strong>Conclusión</strong>';

    const text_ini_deri_parc_CD_sin = document.getElementById("text_ini_deri_parc_CD");
    text_ini_deri_parc_CD_sin.innerHTML = `
        <p>
            La optimización de la función CD sin restricciones implica encontrar los valores de \\(x_{i} \\) que maximizan o
            minimizan la función \\(f(x) \\). Derivando con respecto a cada variable \\(x_{i} \\) e igualando a cero, obtenemos que:
        </p>
    `;

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
    let new_func_oferta = `\\[ \\widehat{f}(x) \\ = \\ \\biggl[ \\frac{1}{A} \\biggl( \\frac{1}{P} \\biggr) `;

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
            \\[ \\frac{\\partial C}{\\partial x_{${i}}} = \\frac{w_{${i}}f(x) - f_{x_{${i}}}(${costo_suma})}{f^{2}(${var_list})} = 0 \\]
        `;
        deri_parc_beneficio += ` 
            \\[ \\frac{\\partial Q}{\\partial x_{${i}}} = Pf_{${i}} - w_{${i}} = 0 \\Rightarrow Pf_{${i}} = w_{${i}} \\]
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
            cant_insumo_costo += `
            \\frac{w_{${i}}}{w_{${i + 1}}} = \\frac{f_{x_${i}}}{f_{x_{${i + 1}}}}, \\ \\ \\ \\
            `;
        }else{
            cant_insumo_costo += `
            \\frac{w_{${i}}}{w_{${1}}} = \\frac{f_{x_${i}}}{f_{x_{${1}}}} 
            `;
        }
        cant_beneficio_costo += `\\[`;
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
                cant_beneficio_costo += `
                x_${i} = \\frac{ \\alpha_{${i}} w_{${index}}x_{${index}}}{ \\alpha_{${index}} w_{${i}}}, \\ \\ \\ \\ 
                `;
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
        exp_func_oferta += `
        \\biggl( \\frac{w_{${i}}}{\\alpha_{${i}}} \\biggr) ^{\\alpha_{${i}}}
        `;
    }

    new_func_oferta += `
        ^{${exponentes_suma}} ${exp_func_oferta} \\biggr]  ^{\\frac{1}{${exponentes_suma} - 1}} \\]
    `;

    let new_func_beneficio = `
        \\[ \\widehat{Q}(x) = (1 - ({${exponentes_suma}})) \\biggl[ \\frac{1}{PA} ${exp_func_oferta} \\biggr]  ^{\\frac{1}{${exponentes_suma} - 1}} \\]
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
                    Para maximizar funciones de producción o utilidad con
                    <ul>
                        <li>
                            \\( \\alpha_{1} < 0 \\), la función sigue creciendo indefinidamente sin un máximo local a menos que existan restricciones adicionales.
                        </li>
                        <li>
                            \\( 0 < \\alpha_{1} < 1 \\), la función es creciente pero a un ritmo decreciente. No hay un máximo local, la función sigue creciendo conforme \\( x_{1} \\) crece pero no de manera indefinida.
                        </li>
                        <li>
                            \\( \\alpha_{1} = 1 \\), la función es lineal, no tiene máximos locales en el dominio positivo, y la función sigue creciendo linealmente conforme \\( x_{1} \\) crece.
                        </li>
                        <li>
                            \\( \\alpha_{1} > 1 \\), la función crece indefinidamente a medida que \\( x_{1} \\) crece. 
                        </li>
                    </ul>
                </p>
                <p>
                    Por lo tanto, maximizar funciones CD de una sola variable y sin restricciones, sería imposible ya que la función CD sigue creciendo.
                </p>
                <p>
                    <u> Ejemplo </u>: Supongamos que queremos maximizar la función Cobb-Douglas de la siguiente forma:
                </p>
                <p>
                    \\[
                        f(x) = 2{x^{0.5}}
                    \\]
                </p>
                <p>
                    Calculando la derivada de \\( f(x) \\) con respecto a \\( x \\) obtenemos que:
                </p>
                <p>
                    \\[
                        \\frac{\\partial f}{\\partial x} = 2 \\cdot 0.5 \\cdot {x^{0.5 - 1}} = \\frac{1}{\\sqrt {x}}
                    \\]
                </p>
                <p>
                    Ahora, igualando la derivada a cero y resolviendo la ecuación obtenemos que no hay valores de \\( x \\)
                    en el dominio positivo donde la derivada sea igual a cero, lo que indica que no hay un máximo para \\( x > 0,\\)
                    dado que \\( \\frac{\\partial f}{\\partial x} > 0 \\) para todo \\( x > 0 \\) la función esta siempre en crecimiento
                    en el dominio positivo. Sin restricciones adicionales, la función continúa aumentando a medida que \\( x \\) crece.
                </p>
            `;

            inicio_minimizador += `
                <p>
                    Para minimizar funciones de producción o utilidad se considera los valores de \\( x_{1} \\) en el dominio permitido 
                    y se verifica el comportamiento en los extremos. Así, 
                    <ul>
                        <li>
                            \\( \\alpha_{1} < 0 \\), la función decrece indefinidamente conforme \\( x_{1} \\) aumenta, por lo que no tiene un mínimo.
                            El mínimo ocurre para un valor de \\( x_{1} \\) demasiado grande, donde \\( f(x) \\) se acerca a 0.
                        </li>
                        <li>
                            \\( 0 < \\alpha_{1} < 1 \\), la función no tiene un mínimo local, ya que sigue aumentando en el dominio positivo.
                        </li>
                        <li>
                            \\( \\alpha_{1} = 1 \\), a función es simplemente una línea recta con pendiente \\( A \\). Si \\( A > 0 \\) no tiene mínimos locales 
                            en el dominio positivo ya que la función sigue creciendo linealmente conforme \\( x_{1} \\) crece y si \\( A < 0 \\)
                            el mínimo ocurre para un valor de \\( x_{1} \\) demasiado grande, donde \\( f(x) \\) se acerca a 0.
                        </li>
                        <li>
                            \\( \\alpha_{1} > 1 \\), la función tiene un mínimo en \\( x_{1} = 0.\\) 
                        </li>
                    </ul>
                </p>
                <p>
                    Para funciones CD sin restricciones, si \\( \\alpha_{1} > 1 \\) se puede minimizar la función en \\( x = 0, \\)
                </p>
                <p>
                    <u> Ejemplo </u>: Supongamos que queremos minimizar la función Cobb-Douglas de la siguiente forma:
                </p>
                <p>
                    \\[
                        f(x) = 3{x^{2}}
                    \\]
                </p>
                <p>
                    Calculando la derivada de \\( f(x) \\) con respecto a \\( x \\) obtenemos que:
                </p>
                <p>
                    \\[
                        \\frac{\\partial f}{\\partial x} = 3 \\cdot 2 \\cdot {x^{2 - 1}} = 6x
                    \\]
                </p>
                <p>
                    Ahora, igualando la derivada a cero y resolviendo la ecuación obtenemos que el punto crítico es
                    \\( x = 0 \\). Ahora, calculamos la segunda derivada para determinar si el punto crítico es un mínimo o un máximo:
                </p>
                <p>
                    \\[
                        \\frac{\\partial^{2} f}{\\partial x^{2}} = 6 \\cdot {x^{1 - 1}} = 6
                    \\]
                </p>
                <p>
                    La segunda derivada es positiva (\\( 6 > 0 \\)) para todos los valores de \\( x \\), lo que indica que 
                    la función es convexa en todo su dominio y, \\( x = 0 \\) es un punto mínimo global. Ahora bien, dado 
                    que \\( x = 0 \\) está en el dominio permitido, \\( f(x) = 0 \\) es el valor mínimo de la función CD.
                    Por lo tanto, la función ( \\( f(x) = 3{x^{2}} \\) ) se minimiza en \\( x = 0 \\).
                </p>
                <p>
                    
                </p>
            `;

            inicio_conclusion += `
                <p>
                    El comportamiento de la función depende de \\( \\alpha_{1} \\) y para funciones CD sin restricciones, si \\( \\alpha_{1} > 1 \\)
                    se puede minimizar la función en \\( x = 0, \\) mientras que maximizarla sin restricciones sería imposible ya que la función CD sigue creciendo.
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
                            = 0
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                        \\]
                        
                    `;
                    funcion_derivada_parcial_CD_sin_phone.innerHTML = `
                        \\[
                            \\frac{\\partial f}{\\partial x_{i}}
                            = A x_{1}^{\\alpha_{1}} \\cdots \\alpha_{i}x_{i}^{\\alpha_{i} - 1} \\cdots x_{n}^{\\alpha_{n}}
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                            \\]
                        \\[ \\Rightarrow
                            \\frac{\\partial f}{\\partial x_{i}}
                            = \\frac{\\alpha_{i}Ax_{1}^{\\alpha_{1}}\\cdots x_{i}^{\\alpha_{i}} \\cdots x_{n}^{\\alpha_{n}}}{x_{i}}
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                        \\]
                        \\[ \\Rightarrow
                            \\frac{\\partial f}{\\partial x_{i}}
                            = \\alpha_{i} \\frac{f(x)}{x_{i}}
                            = 0
                            \\ \\ \\ \\forall \\ i = 1, ..., n
                        \\]
                        
                    `;
                    inicio_hessiana = `<p><strong>Matriz Hessiana - Analísis de convexidad y concavidad</strong></p>`;
                    inicio_hessiana += `
                        <p>
                            Para determinar si los puntos críticos son máximos, mínimos o puntos de silla, se calcula la matriz 
                            Hessiana \\(H_{f}\\) de una función CD para \\(\\mathbb{R}^{n}\\), con \\(n \\in \\mathbb{N}\\) y 
                            \\(n \\geq 2\\), así:
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
                            Entonces, obtenemos que la función de tipo CD \\(f(x)\\), con \\(x \\in S \\subseteq \\mathbb{R}^{n}\\), es: 
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
                            Por lo tanto, obtenemos que la función de tipo CD \\(f(x)\\), con \\(x \\in S \\subseteq \\mathbb{R}^{n}\\), tiene un:
                            <ul>
                                <li>
                                    mínimo absoluto sí \\(\\alpha_{i} \\notin [0, 1]\\) para todo \\(i = 1, ..., n\\) y tenemos que:
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
                                    mínimo absoluto estricto sí \\(\\alpha_{i} \\notin [0, 1]\\) para todo \\(i = 1, ..., n\\) y tenemos que:
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
                                    máximo absoluto sí \\(0 < \\alpha_{i} < 1\\) y \\(\\sum \\alpha_{i} \\leq 1\\) para todo \\(i = 1, ..., n\\).
                                </li>
                                <li>
                                    máximo absoluto estricto sí \\(0 < \\alpha_{i} < 1\\) y \\(\\sum \\alpha_{i} < 1\\) para todo \\(i = 1, ..., n\\).
                                </li>
                            </ul>
                        <p>
                        
                    `;
        
                    inicio_maximizador += `
                        <p>
                            Para maximizar funciones Cobb-Douglas (CD) de n variables, es esencial entender cómo el comportamiento de la 
                            función cambia según los exponentes en la función.
                            <ul>
                                <li>
                                    \\( \\alpha_{i} < 0 \\ \\forall \\ i = 1, ..., n \\), la función crece conforme las variables \\( x_{i} \\) decrecen, 
                                    especialmente cuando \\( x_{i} \\) se acerca a cero. En este caso, la función podría tener un máximo local, 
                                    pero es importante analizar cómo interactúan todos los exponentes para determinar si el punto crítico encontrado
                                    es un máximo relevante en la optimización.
                                </li>
                                <li>
                                    \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = 1, ..., n \\), la función es creciente pero a un ritmo decreciente. 
                                    No hay un máximo local; sin embargo, la función sigue creciendo conforme \\( x_{i} \\) crece, pero no 
                                    de manera indefinida. A medida que las variables aumentan, la función se aproxima a un límite.
                                </li>
                                <li>
                                    \\( \\alpha_{i} = 1 \\ \\forall \\ i = 1, ..., n \\), la función es lineal con respecto a esas variables, y no 
                                    tiene máximos locales en el dominio positivo. La función sigue creciendo conforme las variables 
                                    \\( x_{i} \\) correspondientes crecen. Sin embargo, la linealidad en algunos exponentes combinada 
                                    con otros exponentes podría generar un crecimiento no lineal en la función.
                                </li>
                                <li>
                                    \\( \\alpha_{i} > 1 \\ \\forall \\ i = 1, ..., n \\), la función sigue creciendo indefinidamente sin un máximo local 
                                    a menos que existan restricciones adicionales. A medida que cualquiera de las variables 
                                    \\( x_{i} \\) crece, la función también crece de manera acelerada.
                                </li>
                            </ul>
                        </p>
                        <p>
                            Maximizar funciones CD de n variables sin restricciones adicionales es generalmente imposible, 
                            ya que la función sigue creciendo en función de las variables \\( x_{i} \\). Para encontrar un máximo local, 
                            se requiere de restricciones (como restricciones presupuestarias o de recursos) o modificar la función de tal forma que 
                            se pueda encontrar un máximo local para maximizar la función CD.
                        </p>
                    `;
        
                    inicio_minimizador += `
                        <p>
                            Para minimizar funciones Cobb-Douglas (CD) de n variables, es esencial entender cómo el comportamiento de la 
                            función cambia según los exponentes en la función.
                            <ul>
                                <li>
                                    \\( \\alpha_{i} < 0 \\ \\forall \\ i = 1, ..., n \\), la función decrece conforme las variables  \\( x_{i} \\) 
                                    correspondientes crecen. Esto implica que la función podría alcanzar un mínimo en algún punto donde las 
                                    variables \\( x_{i} \\) sean suficientemente grandes. Sin embargo, sin restricciones adicionales, la función 
                                    puede seguir decreciendo indefinidamente.
                                </li>
                                <li>
                                    \\( \\alpha_{i} = 0 \\ \\forall \\ i = 1, ..., n \\), la función es constante con respecto a esas variables, 
                                    y no afecta la minimización directa. La función se reduce a depender solo de las variables con exponentes no nulos.
                                </li>
                                <li>
                                    \\( \\alpha_{i} > 0 \\ \\forall \\ i = 1, ..., n \\), la función sigue creciendo conforme las variables 
                                    \\( x_{i} \\) crecen, lo que significa que la función no tiene un mínimo local en el dominio positivo. 
                                    En este caso, el mínimo se alcanzaría en los bordes del dominio, es decir, cuando alguna variable 
                                    \\( x_{i} \\) tiende a cero. Sin embargo, para \\( x_{i} = 0 \\), la función se anula o no está definida, 
                                    lo cual significa que no hay un mínimo significativo dentro del dominio positivo.
                                </li>
                                <li>
                                    Si los exponentes son una combinación de positivos y negativos, la función tendrá un comportamiento más 
                                    complejo y puede alcanzar un mínimo dependiendo de la interacción entre los exponentes. En este caso, 
                                    puede existir un mínimo local, pero su determinación depende del análisis detallado de las derivadas 
                                    parciales y la matriz Hessiana.
                                </li>
                            </ul>
                        </p>
                        <p>
                            Minimizar una función Cobb-Douglas en n variables, sin restricciones adicionales, generalmente no es posible de 
                            manera directa. Sin embargo, en situaciones donde los exponentes son negativos, o existe una combinación de 
                            exponentes positivos y negativos, la función podría decrecer en algunas direcciones, lo que permite la 
                            existencia de mínimos locales o globales bajo ciertas condiciones.
                            
                            Al igual que con la maximización, introducir restricciones es clave para encontrar un mínimo significativo, 
                            especialmente en contextos donde las variables \\( x_{i} \\ \\forall \\ i = 1, ..., n \\ \\) están sujetas a límites. 
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
                            En conclusión, sin restricciones, la función Cobb-Douglas sigue creciendo conforme aumentan los insumos, y no es posible encontrar un punto máximo o mínimo.
                            Por lo tanto, las funciones CD estándar no tienen puntos críticos interiores sin restricciones. La maximización o minimización 
                            generalmente ocurre en los bordes del dominio, pero no en un punto interior donde las derivadas parciales se anulen. 
                            Para hallar puntos críticos, se necesita un contexto con restricciones (como restricciones de presupuesto, por ejemplo) 
                            o una función modificada que altere la forma estándar.
                        </p>
                        <p>
                            <u>Ejemplo:</u> 
                            Para una firma que usa n insumos \\(x_{1}, ..., x_{n}\\) a precios \\(w_{1}, ..., w_{n}\\) por unidad, respectivamente, el costo promedio es:
                            \\[ C = \\frac{\\sum_{i=1}^{n} w_{i}x_{i} }{f(x_{1}, ..., x_{n})}\\]

                            donde \\(f = f(x_{1}, ..., x_{n})\\)  es la función de producción. Las condiciones que se deben satisfacer para minimizar el costo promedio son:

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

                            para \\(i = 1, ..., n\\). Ahora bien , fijemos \\(i\\) y tomemos el cociente entre las expresiones correspondientes. Al simplificar, obtenemos que:
                            
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

                            para cada \\(i = 1, ..., n\\). Entonces, las cantidades de insumos que el productor debe usar para minimizar su costo promedio son aquellas para las cuales la relación entre las productividades marginales es igual a la relación entre los precios de los insumos de producción. Así, si el productor vende su producto a P por unidad, los beneficios están dados por:

                            \\[ \\Pi(x_{1}, ..., x_{n}) = Pf(x_{1}, ..., x_{n}) - \\sum_{i=1}^{n} w_{i}x_{i} \\]

                            Si la función de producción no es homogénea de grado uno, la combinación de insumos que produce el mayor beneficio son las soluciones del sistema de ecuaciones, 
                            
                            <span class="hidden_phone">
                                \\[\\frac{\\partial{\\Pi}}{\\partial x_{i}} = Pf_{x_{i}}(x_{1}, ..., x_{n})-w_{i} = 0 \\text{ para todo } i=1, ...,n\\]
                            </span>
                            <span class="hidden_pc">
                                \\[\\frac{\\partial{\\Pi}}{\\partial x_{i}} = Pf_{x_{i}}(x_{1}, ..., x_{n})-w_{i} = 0\\]
                                \\[\\text{ para todo } i=1, ...,n\\]
                            </span>
    
                            Entonces, el valor de la productividad marginal de cada insumo de producción debe ser igual a su precio.  Ahora bien , fijemos \\(i\\) y realicemos el cociente entre las expresiones. Entonces, al simplificar términos obtenemos que:

                            <span class="hidden_phone">
                                \\[\\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{1}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{1}}, \ \\cdots, \ \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i-1}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{i-1}}, \ \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i+1}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{i+1}}, \ \\cdots, \ \\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{n}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{n}}\\]
                            </span>
                            <span class="hidden_pc">
                                \\[\\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{1}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{1}},\\]
                                \\[\\cdots\\]
                                \\[\\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i-1}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{i-1}},\\]
                                \\[\\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{i+1}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{i+1}}\\]
                                \\[\\cdots\\]
                                \\[\\frac{f_{x_{i}}(x_{1}, ..., x_{n})}{f_{x_{n}}(x_{1}, ..., x_{n})} = \\frac{w_{i}}{w_{n}}\\]
                            </span>
    
                            para todo \\(i = 1, ..., n\\). Esto es, las condiciones necesarias (de primer orden) para minimizar el costo promedio y para maximizar el beneficio son las mismas.
    
                            Ahora bien, si la empresa produce n insumos con tecnología Cobb-Douglas (CD) \\[f(x_{1}, ..., x_{n}) = A\\prod_{i=1}^{n} x_{i}^{\\alpha_{i}}\\]
                        
                            Derivando con respecto a cada variable, obtenemos que:
                        
                            <span class="hidden_phone">
                                \\[f_{x_{1}}(x_{1}, ..., x_{n}) = \\alpha_{1} \\frac{f(x_{1}, ..., x_{n})}{x_{1}}, 
                                \\cdots, f_{x_{n}}(x_{1}, ..., x_{n}) = \\alpha_{n} \\frac{f(x_{1}, ..., x_{n})}{x_{n}}\\]
                            </span>
                            <span class="hidden_pc">
                                \\[f_{x_{1}}(x_{1}, ..., x_{n}) = \\alpha_{1} \\frac{f(x_{1}, ..., x_{n})}{x_{1}}, \\]
                                \\[\\cdots\\]
                                \\[f_{x_{n}}(x_{1}, ..., x_{n}) = \\alpha_{n} \\frac{f(x_{1}, ..., x_{n})}{x_{n}}\\]
                            </span>
                        
                            Ahora bien , fijemos \\( i \\) y sea \\( j=1, ..., n \\) con \\( i \\neq j \\). 
                            Reemplazando en el cociente de las condiciones necesarias, obtenemos que:

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

                            \\[\\frac{w_{i} \\alpha_{j}}{w_{j}\\alpha_{i}} = \\frac{x_{j}}{x_{i}}\\]

                            de donde, 

                            \\[ x_{j} = x_{i} \\frac{w_{i} \\alpha_{j}}{w_{j}\\alpha_{i}}\\]

                            para cada \\( j = 1, ..., n \\) con \\( i \\neq j \\). Esto es, 

                            \\[x_{1} = x_{i} \\frac{w_{i} \\alpha_{1}}{w_{1}\\alpha_{i}}, \\ \\cdots, 
                            \\ x_{n} = x_{i} \\frac{w_{i} \\alpha_{n}}{w_{n}\\alpha_{i}}\\]

                            Al reemplazar esta expresión en la condición 
                            \\( Pf_{x_{i}}(x_{1}, ..., x_{n}) = w_{i} \\), obtenemos que:

                            <span class="hidden_phone">
                                \\[P\\alpha_{i}A \\big[ \\big(x_{i} \\frac{w_{i} \\alpha_{1}}{w_{1}\\alpha_{i}} 
                                \\big)^{\\alpha_{1}} \\ \\cdots \\ \\big(x_{i} \\frac{w_{i} \\alpha_{i-1}}{w_{i-1}
                                \\alpha_{i}} \\big)^{\\alpha_{i-1}} \\ x_{i}^{\\alpha_{i} -1} \\ \\big(x_{i} 
                                \\frac{w_{i} \\alpha_{i+1}}{w_{1}\\alpha_{i}} \\big)^{\\alpha_{i+1}} \\ \\cdots 
                                \\ \\big(x_{i} \\frac{w_{i} \\alpha_{n}}{w_{n}\\alpha_{i}} \\big)^{\\alpha_{n}} 
                                \\big] = w_{i}\\]

                                Entonces,
                            </span>

                            \\[ PA \\big( \\frac{w_{i}}{\\alpha_{i}}x_{i} \\big)^{\\sum_{j=1}^{n} 
                            \\alpha_{j} - 1} \\prod_{j=1}^{n} \\big(\\frac{\\alpha_{j}}{w_{j}} 
                            \\big)^{\\alpha_{j}} = 1 \\]

                            Despejando \\( x_{i} \\), 

                            \\[  \\big(x_{i} \\big)^{\\sum_{j=1}^{n} \\alpha_{j} - 1}   = 
                            \\frac{1}{PA} \\big( \\frac{\\alpha_{i}}{w_{i}} \\big)^{\\sum_{j=1}^{n} \\alpha_{j} 
                            - 1}   \\prod_{j=1}^{n}\\big(\\frac{w_{j}}{\\alpha_{j}} \\big)^{\\alpha_{j}} \\]

                            Por lo cual, 

                            <span class="hidden_phone">
                                \\[\\hat{x_{i}} = \\big[ \\frac{1}{PA} \\big( \\frac{\\alpha_{i}}{w_{i}} 
                                \\big)^{\\sum_{j=1}^{n} \\alpha_{j} - 1}   \\prod_{j=1}^{n}\\big(\\frac{w_{j}}
                                {\\alpha_{j}} \\big)^{\\alpha_{j}} \\big]^{\\frac{1}{\\sum_{j=1}^{n} 
                                \\alpha_{j} - 1}} = \\frac{\\alpha_{i}}{w_{i}} \\big[\\frac{1}{PA}  
                                \\prod_{j=1}^{n}\\big(\\frac{w_{j}}{\\alpha_{j}} \\big)^{\\alpha_{j}} 
                                \\big]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}}\\]
                            </span>
                            <span class="hidden_pc">
                                \\[\\hat{x_{i}} = \\big[ \\frac{1}{PA} \\big( \\frac{\\alpha_{i}}{w_{i}} 
                                \\big)^{\\sum_{j=1}^{n} \\alpha_{j} - 1}   \\prod_{j=1}^{n}\\big(\\frac{w_{j}}
                                {\\alpha_{j}} \\big)^{\\alpha_{j}} \\big]^{\\frac{1}{\\sum_{j=1}^{n} 
                                \\alpha_{j} - 1}}\\]

                                \\[\\Rightarrow \\hat{x_{i}} = \\frac{\\alpha_{i}}{w_{i}} \\big[\\frac{1}{PA}  
                                \\prod_{j=1}^{n}\\big(\\frac{w_{j}}{\\alpha_{j}} \\big)^{\\alpha_{j}} 
                                \\big]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}}\\]
                            </span>

                            para cada \\( i=1, ..., n \\). Las funciones \\( \\widehat{x_{i}} \\) son las 
                            funciones de demanda de factores de la empresa, ellas determinan las cantidades de 
                            factores que se han de usar para maximizar el beneficio. Así, , las cantidades que 
                            se deben producir para maximizar el beneficio son: 

                            \\[\\hat{f}(x) = \\hat{f}(x_{1}, \\cdots, x_{n}) = f(\\hat{x_{1}}, \\cdots, 
                            \\hat{x_{n}}) \\]

                            Entonces, <strong>la función de oferta</strong> es: 

                            \\[\\hat{f}(x) = \\big(\\frac{1}{P} \\big)^{\\frac{\\sum_{j=1}^{n} \\alpha_{j}}
                            {\\sum_{j=1}^{n} \\alpha_{j} - 1}} \\big[\\frac{1}{A}  \\prod_{j=1}^{n}
                            \\big(\\frac{w_{j}}{\\alpha_{j}} \\big)^{\\alpha_{j}} \\big]^{\\frac{1}
                            {\\sum_{j=1}^{n} \\alpha_{j} - 1}}\\]

                            <strong>La función de beneficio</strong> está dada por:

                            \\[ \\hat{\\Pi}(x) = \\hat{\\Pi}(x_{1}, ..., x_{n}) = P\\hat{f}(X) - \\sum_{i=1}^{n} w_{i}\\hat{X_{i}} \\]

                            <span class="hidden_phone">
                                Así,

                                \\[ \\hat{\\Pi}(x) = \\hat{\\Pi}(x_{1}, ..., x_{n}) = \\big[\\frac{1}{PA}  \\prod_{j=1}^{n}
                                \\big(\\frac{w_{j}}{\\alpha_{j}} \\big)^{\\alpha_{j}} \\big]^{\\frac{1}
                                {\\sum_{j=1}^{n} \\alpha_{j} - 1}} - \\sum_{i=1}^{n} \\alpha_{i} \\big[\\frac{1}{PA}
                                \\prod_{j=1}^{n}\\big(\\frac{w_{j}}{\\alpha_{j}} \\big)^{\\alpha_{j}} 
                                \\big]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}}\\]
                            </span>

                            Por lo cual,

                            \\[ \\hat{\\Pi}(x) = \\big( 1 - \\sum_{i=1}^{n} \\alpha_{i} \\big)
                            \\big[\\frac{1}{PA}  \\prod_{j=1}^{n}\\big(\\frac{w_{j}}{\\alpha_{j}} 
                            \\big)^{\\alpha_{j}} \\big]^{\\frac{1}{\\sum_{j=1}^{n} \\alpha_{j} - 1}} \\]
                            Esto nos permite determinar cuánto beneficio genera la empresa bajo condiciones de maximización,
                            y como resultado final muestra que el beneficio está directamente relacionado con los coeficientes αi
                            y los precios de los insumos, lo que subraya la importancia de la estructura de costos y la eficiencia
                            de la producción en la maximización del beneficio.
                        </p>
                    `;
        
                    break;
        default:
            funcion_optimizar_CD_sin.innerHTML = `\\(${inicio_var}\\)`;
            funcion_derivada_parcial_CD_sin.innerHTML = `\\(${inicio_deri_parc}\\)`;
            funcion_derivada_parcial_CD_sin_phone.innerHTML = `${inicio_deri_parc_phone}`;
            inicio_hessiana += `
                <div id="hessiana"></div>
                <ul>
                    <li>
                        Si la Hessiana es definida negativa, el punto crítico es un máximo local.
                    </li>
                    <li>
                        Si la Hessiana es definida positiva, el punto crítico es un mínimo local.
                    </li>
                    <li>
                        Si la Hessiana tiene signos mixtos, entonces el punto crítico es un punto de silla.
                    </li>
                </ul>
                <p>
                    Ahora bien, los menores principales son claves para analizar la definitud de la matriz Hessiana, que a su vez ayuda a 
                    clasificar los puntos críticos de una función. Para una matriz \\(${exponente} x ${exponente}\\), los menores principales son: 
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
                        definida negativa si ${exponentes_list_0_1} y \\( ${exponentes_suma} \\) < 1
                    </li>
                    <li>
                        semidefinida positiva si se da alguno de los siguientes casos:
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
                        semidefinida negativa si ${exponentes_list_0_1} y \\( ${exponentes_suma} \\) \\( \\leq \\) 1
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
                    Así, concluimos que una función CD \\(f(x)\\), con \\(x \\in S \\subseteq \\mathbb{R}^{${exponente}}\\), tiene un: 
                </p>
                <ul>
                    <li>
                        mínimo absoluto sí \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\)  y 
                        ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( \\geq 0 \\)
                    </li>
                    <li>
                        mínimo absoluto estricto sí \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\)  y 
                        ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( > 0 \\)
                    <li>
                        máximo absoluto sí y sólo si \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = ${indices_list} \\)  y  
                        \\( ${exponentes_suma} \\) \\( \\leq 1 \\)
                    </li>
                    <li>
                        máximo absoluto estricto sí y sólo si \\( 0 < \\alpha_{i} < 1 \\ \\forall \\ i = ${indices_list} \\)  y  
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
                    <u> Ejemplo </u>: Supongamos que queremos maximizar la función Cobb-Douglas de la siguiente forma:
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
                    Entonces, igualando la derivada a cero y resolviendo la ecuación obtenemos que no hay valores con respecto a \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\)
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
                    donde se pueda definir la hessiana, lo que indica que no hay un máximo. Por lo tanto, la función no se puede maximizar.
                </p>
            `;

            inicio_minimizador += `
                <p>
                    La convexidad es clave para determinar la existencia de mínimos. Si una función CD es convexa, cualquier 
                    punto crítico encontrado será un mínimo y, si la función CD es estrictamente convexa, será un mínimo global.
                    Entonces, si existen puntos críticos en la función se puede minimizar funciones CD con valores
                    \\( \\alpha_{i} \\notin [0, 1] \\ \\forall \\ i = ${indices_list} \\)  y 
                        ${signo_operacion} \\( ${exponentes_list} \\) (\\( ${exponentes_suma} \\) - 1) \\( \\geq 0 \\)
                </p>
                <p>
                    <u> Ejemplo </u>: Supongamos que queremos minimizar la función Cobb-Douglas de la siguiente forma:
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
                    donde se pueda definir la hessiana, lo que indica que no hay un mínimo. Por lo tanto, la función no se puede minimizar.
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
                            En conclusión, sin restricciones, la función Cobb-Douglas sigue creciendo conforme aumentan los insumos, y no es posible encontrar un punto máximo o mínimo.
                            Por lo tanto, las funciones CD estándar no tienen puntos críticos interiores sin restricciones. La maximización o minimización 
                            generalmente ocurre en los bordes del dominio, pero no en un punto interior donde las derivadas parciales se anulen. 
                            Para hallar puntos críticos, se necesita un contexto con restricciones (como restricciones de presupuesto, por ejemplo) 
                            o una función modificada que altere la forma estándar.
                        </p>
                <p>
                    <u> Ejemplo </u>: Una empresa que usa ${exponente} insumos \\(${var_list}\\) a precios \\(${precio_var}\\) por unidad 
                    respectivamente, el costo promedio es
                    \\[ C =  \\frac{${costo_suma}}{f(${var_list})} \\]
                    donde f es la función de producción CD. Así, las ondiciones que se deben satisfacer para minimizar el costo promedio son:
                    ${deri_parc_costo}
                    Por lo cual, las cantidades de insumos que el productor debe usar para minimizar el costo promedio son aquellas para las 
                    cuales la relación entre las productividades marginales es igual a la relación entre los precios de los insumos de producción.
                    \\[ ${cant_insumo_costo} \\]
                    Si la función de producción no es homogénea de grado uno y los beneficios están dados por:
                    \\[ Q(${var_list}) = Pf(${var_list}) - (${costo_suma}) \\]
                    Entonces, la combinación de insumos que produce el mayor beneficio son las soluciones del sistema de ecuaciones
                    ${deri_parc_beneficio}
                    Por lo tanto, el valor de productividad marginal de cada insumo de producción debe ser igual a su precio. Así, las condiciones
                    necesarias de primer orden para maximizar el beneficio, son las mismas para minimizar el costo promedio.
                    \\[ ${cant_insumo_costo} \\]  
                    Ahora bien, la empresa produce con funciones CD de la forma 
                    \\[ ${inicio_var} \\] 
                    Entonces, derivando con respecto a cada variable y reemplazando en el cociente de las condiciones 
                    necesarias, obtenemos que: ${cant_beneficio_costo} <br>
                    Al reemplazar esta expresión en la condición \\( Pf_{i} = w_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\) y despejando \\( x_{i} \\) 
                    obtenemos que: ${new_var_CD}
                    Las funciones \\( x_{i} \\ \\forall \\ 1 \\leq i \\leq ${exponente} \\ \\) son las funciones de demanda de factores de la empresa, ellas 
                    determinan las cantidades de factores que se han de usar para maximizar el beneficio. Así, las cantidades que se deben producir para 
                    maximizar el beneficio son:  \\[ \\widehat{f}(x) = \\widehat{f}(${var_list}) = f(${var_list_CD}) = f( \\widehat{x} ) \\] 
                    Entonces, <strong>la función de oferta</strong> es: ${new_func_oferta}
                    <strong>La función de beneficio</strong> está dada por:
                    \\[ \\widehat{Q}(${var_list}) = PQ(\\widehat{x}) - (${new_costo_suma}) \\]
                    Por lo tanto, ${new_func_beneficio}
                    Esto nos permite determinar cuánto beneficio genera la empresa bajo condiciones de maximización,
                    y como resultado final muestra que el beneficio está directamente relacionado con los coeficientes αi
                    y los precios de los insumos, lo que subraya la importancia de la estructura de costos y la eficiencia
                    de la producción en la maximización del beneficio.
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
