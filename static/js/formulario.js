let cantidadVariables = 5;
let cantidadVariablesOpc = '<option select>1</option>';
var variableExpo = document.getElementById('inputDimension').value;
for (let index = 2; index < cantidadVariables + 1; index++) {
    cantidadVariablesOpc += `<option>${index}</option>`;
}

document.getElementById('inputDimension').innerHTML = cantidadVariablesOpc;
cantidadExp(variableExpo);

// Función para generar filas de entrada de manera reutilizable
function generarInputFila(id, titulo, placeholder, tipo = "text", min = null, maxLength = 10) {
    return `
        <tr>
            <td>${titulo}</td>
            <td>
                <input 
                    type="${tipo}" 
                    class="form-control" 
                    id="${id}" 
                    ${min !== null ? `min="${min}"` : ""} 
                    ${maxLength !== null ? `maxlength="${maxLength}"` : ""} 
                    onkeypress="return soloNumeros(event, '${id}');" 
                    onpaste="return false" oncut="return false" oncopy="return false" 
                    title="Ingresa ${titulo.toLowerCase()}" 
                    placeholder="${placeholder}" 
                    required
                >
            </td>
        </tr>`;
}

// Genera las filas de la tabla de exponentes y costos
function cantidadExponente(e) {
    variableExpo = document.getElementById(e).value;
    cantidadExp(variableExpo);
}

// Genera las filas de la tabla de exponentes y costos
function cantidadExp(e) {
    let filasExp = generarInputFila(
        "alpha_1", "&alpha;<sub>1</sub>", "Ingresa el valor del exponente de x_1"
    );
    for (let index = 1; index < e; index++) {
        filasExp += generarInputFila(
            `alpha_${index + 1}`, `&alpha;<sub>${index + 1}</sub>`, `Ingresa el valor del exponente de x_${index + 1}`
        );
    }
    document.getElementById('tablaExponentes').innerHTML = filasExp;

    const RestriccionCheck = document.getElementById('RestriccionCheck').checked;

    if (RestriccionCheck) {
        const costoTotal = generarInputFila(
            "costoTotal", "Total", "Ingresa el precio del costo total", "text", 1, 10
        );
        let filasVariables = generarInputFila(
            "w_1", "w<sub>1</sub>", "Ingresa el precio de x_1", "text", 1, 10
        );
        for (let index = 1; index < e; index++) {
            filasVariables += generarInputFila(
                `w_${index + 1}`, `w<sub>${index + 1}</sub>`, `Ingresa el precio de x_${index + 1}`, "text", 1, 10
            );
        }
        document.getElementById('tablaUnidadesCosto').innerHTML = costoTotal + filasVariables;
        document.getElementById('unidadesCosto').classList.remove('d-none');
    } else {
        document.getElementById('unidadesCosto').classList.add('d-none');
        document.getElementById('tablaUnidadesCosto').innerHTML = "";
    }
}

// Función para verificar los valores ingresados
function soloNumeros(evt, id) {
    var input = evt.target;
    var code = evt.which || evt.keyCode;

    // Permitir números, punto decimal y signo negativo solo al principio en los exponentes (alpha)
    if (code === 8 || (code >= 48 && code <= 57) || code === 46 || (code === 45 && input.selectionStart === 0)) {
        
        // Validación para Exponentes (alpha)
        if (id.startsWith('alpha')) {
            // Permitir el signo negativo solo al principio
            if (input.value.length === 1 && input.value === "-") {
                return true; // Permitir que se quede el signo negativo al inicio
            }
            
            // Verificar que no haya más de un signo negativo
            if (input.value.indexOf('-') > 0) {
                return false;
            }

            // Verificar si ya hay un punto decimal
            if (input.value.indexOf('.') > -1 && code === 46) {
                return false; // No permitir otro punto decimal
            }

            // Validar que no haya más de 2 decimales
            var partes = input.value.split(".");
            if (partes.length === 2 && partes[1].length > 1) {
                return false; // No permitir más de 2 decimales
            }

            // Validar que la parte entera no tenga más de 4 dígitos
            var parteEntera = partes[0];
            if (
                (parteEntera.length > 4 && parteEntera[0] !== '-') ||  // Sin signo negativo
                (parteEntera.length > 5 && parteEntera[0] === '-')   // Con signo negativo
            ) {
                return false; // La parte entera no puede ser mayor a 4 dígitos
            }
        }

        // Validación para Costo Total y precios (w): No permitir negativos y solo 2 decimales
        if (id === "costoTotal" || id.startsWith("w_")) {
            if (code === 45) { // Si es un signo negativo, lo bloqueamos
                return false;
            }

            // Verificar si ya hay un punto decimal
            if (input.value.indexOf('.') > -1 && code === 46) {
                return false; // No permitir otro punto decimal
            }

            // Validar que no haya más de 2 decimales
            var partes = input.value.split(".");
            if (partes.length === 2 && partes[1].length > 1) {
                return false;
            }
        }

        // Verifica que la longitud actual no exceda el máximo de 7 caracteres en los exponentes (signo, parte entera y decimal)
        if (id.startsWith("alpha") && input.value.length >= 8) {
            return false;
        }

        // Verifica que la longitud no exceda 10 caracteres para los precios
        if ((id === "costoTotal" || id.startsWith("w_")) && input.value.length >= 10) {
            return false;
        }

        return true;
    }
    return false;
}

// Obtener exponentes dinámicamente
function obtenerExponentes(e, parametro) {
    let exponentes = [];
    for (let index = 1; index <= e; index++) {
        let alphaValue = parseFloat(document.getElementById(`${parametro}_${index}`).value);
        if (!isNaN(alphaValue)) {
            exponentes.push(alphaValue);
        }
    }
    return exponentes;
}

var form = document.getElementById('formulario-optimizacion');
form.addEventListener('click', function (event) {
    // Obtener el formulario
    var formulario = document.getElementById('formularioCD');
    var campos = formulario.querySelectorAll('input[required]');
    const tipoOptimizacion = document.getElementById('inputState').value;
    var todosCompletos = true;

    // Recorre todos los campos requeridos
    campos.forEach(function(campo) {
        if (!campo.value || campo.value == 0) { // Si el campo está vacío
            todosCompletos = false;
            campo.style.borderColor = "red"; // Resaltar campo vacío
        } else {
            campo.style.borderColor = ""; // Limpiar estilo si está completo
        }
    });

    let tecnologiaA = document.getElementById('inputTecnologia').value;
    tecnologiaA = parseFloat(tecnologiaA); // Convierte el valor a un número entero
    let ATecnologia = tecnologiaA;

    // Verifica si el valor es un número válido, si no, asigna 1 como valor por defecto
    if (isNaN(tecnologiaA) || tecnologiaA === "" || tecnologiaA == 1) {
        document.getElementById('inputTecnologia').style.borderColor = "";
        tecnologiaA = "";
        ATecnologia = 1;
    } else if (tecnologiaA === 0) {
        todosCompletos = false;
        document.getElementById('inputTecnologia').style.borderColor = "red"; // Cambia el borde a rojo
    } else {
        document.getElementById('inputTecnologia').style.borderColor = ""; // Restablece el color de borde si es válido
    }

    let cantidadExp = document.getElementById('inputDimension').value;
    let valoresExp = obtenerExponentes(cantidadExp, 'alpha');
    let funcion_CD = ``;
    let lista_var_CD = ``;

    valoresExp.forEach((element, index) => {
        if (element == 1) {
            element = "";
        }
        funcion_CD += `x_{${index + 1}}^{${element}}`;
        lista_var_CD += `x_{${index + 1}}`;
        if (index + 1 < cantidadExp) {
            lista_var_CD += ", \\ ";
        }
    });

    const RestriccionCheck = document.getElementById('RestriccionCheck').checked;
    let costoTotal = 0;
    let valoresCosto = [];
    let funcion_costo_CD = ``;

    if (RestriccionCheck) {
        costoTotal = document.getElementById('costoTotal').value;
        valoresCosto = obtenerExponentes(cantidadExp, 'w');
        valoresCosto.forEach((element, index) => {
            if (element == 1) {
                element = "";
            }
            funcion_costo_CD += `{${element}}x_{${index + 1}}`;
            if (index + 1 < cantidadExp) {
                funcion_costo_CD += " + ";
            }
        });
    }

    const data = {
        A: ATecnologia,
        n: parseInt(cantidadExp),
        exponentes: valoresExp,
        precios: valoresCosto,
        presupuesto: parseFloat(costoTotal)
    };

    var modalResult = new bootstrap.Modal(document.getElementById('modalOptimizacionResult'));
    var modalConfirm = new bootstrap.Modal(document.getElementById('modalOptimizar'));
        
    var buttonOptimizacion = document.getElementById('confirmarOptimizacion');
    buttonOptimizacion.addEventListener('click', function (event) {
        if (modalConfirm) {
            modalConfirm.hide();
            modalResult.show();
        }
        
        obtenerCobbDouglas(data, tipoOptimizacion);
    });

    var buttonOptimizacionClose = document.getElementById('modalOptimizacionResultClose');
    buttonOptimizacionClose.addEventListener('click', function (event) {
        if (modalResult) {
            modalConfirm.hide();
            modalResult.hide();
            let modalResultante = document.querySelector('#modalOptimizacionResult .modal-body');
            modalResultante.innerHTML = ""; // Limpia contenido previo
        }
    });
    
    if (todosCompletos) {
        document.getElementById('mensajeError').style.display = "none";
        const restriccionCheck = document.getElementById('RestriccionCheck').checked;

        var mensajeModal = `<p>Has seleccionado <strong>` + tipoOptimizacion + `</strong> la función Cobb-Douglas \\(f(x) = f(${lista_var_CD})\\).</p>`;
        if (restriccionCheck) {
            mensajeModal += `
                <p>Sujeta a la restricción \\(c(x) = c(${lista_var_CD})\\) = c.</p>
                <p>Esto se puede formular como:</p>
                <p class="hidden_phone">
                    \\[
                        \\begin{align*}
                            \\text{${tipoOptimizacion.substring(0, 3)}:} && 
                            f(x) = ${tecnologiaA} ${funcion_CD} \\\\
                            \\text{sujeto a:} && 
                            c(x) = ${funcion_costo_CD} = ${costoTotal} \\\\
                        \\end{align*}
                    \\]
                </p>
                <p class="hidden_pc">
                    \\[
                        \\begin{align*}
                            \\text{${tipoOptimizacion.substring(0, 3)}:} && 
                            f(x) = ${tecnologiaA} ${funcion_CD} \\\\
                            \\text{sujeto a:} && 
                            c(x) = ${funcion_costo_CD} = ${costoTotal} \\\\
                        \\end{align*}
                    \\]
                </p>
            `;
        } else {
            mensajeModal += `
                <p>Esto se puede formular como:</p>
                <p class="hidden_phone">
                    \\[
                        \\begin{align*}
                            \\text{${tipoOptimizacion}:} && 
                            f(x) = ${tecnologiaA} ${funcion_CD} \\\\
                        \\end{align*}
                    \\]
                </p>
                <p class="hidden_pc">
                    \\[
                        \\begin{align*}
                            \\text{${tipoOptimizacion.substring(0, 3)}:} && 
                            f(x) = ${tecnologiaA} ${funcion_CD} \\\\
                        \\end{align*}
                    \\]
                </p>
            `;
        }
        
        // Reemplazar el contenido del modal
        document.querySelector('#modalOptimizar .modal-body').innerHTML = mensajeModal;

        modalConfirm.show();
        
    } else {
        document.getElementById('mensajeError').style.display = "block";
    }
    
    MathJax.typeset();
})

function mostrarHessiana_Con(hessianaLatex) {
    const hessianaDiv = document.getElementById("hessiana_con");
    hessianaDiv.innerHTML = `\\[ H_{\\psi} (x) = ${hessianaLatex.hessiana_con}\\]`;
    MathJax.typeset();
}

let controller;

function obtenerHessiana_Con(n) {
    // Si ya existe un controlador de abort, lo abortamos
    if (controller) {
        controller.abort();
    }

    // Creamos un nuevo controlador de abort para esta solicitud
    controller = new AbortController();

    fetch(`/calcular_hessiana?n=${n}`, {
        signal: controller.signal
    })
    .then(response => response.json())
    .then(data => {
        mostrarHessiana_Con(data);
    })
    .catch(error => {
        if (error.name != 'AbortError') {
            console.error("Error:", error);
        }
    });
}

function obtenerCobbDouglas(datos, operacion_CD) {
    document.querySelector('#modalOptimizacionResult .modal-body').innerHTML = `
        <div class="modal-body text-center d-flex flex-column justify-content-center align-items-center" style="height: 300px;">
            <!-- Texto "Espere un momento" -->
            <h4 class = "textLoading">Espere un momento...</h4>

            <!-- Animación de línea que simula una función continua optimizándose -->
            <div class="graph-container">
                <svg width="200" height="150" viewBox="0 0 200 150">
                <path class="path" fill="transparent" stroke="#007bff" stroke-width="2" d="M 10 140 Q 50 100, 100 120 Q 150 140, 190 90" />
                <circle class="dot" cx="10" cy="140" r="4" fill="#007bff" />
                </svg>
            </div>
        </div>
    `;

    let urlCD = '/calcular_cobb_douglas';
    if ((datos.precios).length != 0) {
        urlCD = '/calcular_cobb_douglas_con_presupuesto';
    }

    // Si ya existe un controlador de abort, lo abortamos
    if (controller) {
        controller.abort();
    }

    // Creamos un nuevo controlador de abort para esta solicitud
    controller = new AbortController();

    fetch(urlCD, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos),
        signal: controller.signal // Usamos el controlador de abort en la solicitud
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        mostrarCobbDouglas(datos, operacion_CD, data);
    })
    .catch(error => {
        if (error.name != 'AbortError') {
            console.error('Error:', error);
            document.querySelector('#modalOptimizacionResult .modal-body').innerHTML = `Error: ${error.message}`;
        }
    });
}


function mostrarCobbDouglas(datos, operacion_CD, resultados) {
    let lista_var_CD = ``;
    let lista_exp_CD = ``;
    let lista_var_CD_con_opt = ``;
    let indices_list = ``;
    let valoresExp = datos.exponentes;
    let valoresCosto = datos.precios;
    let costoTotal = datos.presupuesto;
    let cantidadExp = datos.exponentes.length;
    let tecnologiaA = datos.A == 1 ? "" : datos.A;
    let funcionCD = ``;
    let funcion_CD_opt = `${tecnologiaA} `;
    let funcionAOptimizar = ``;
    let sumaExp = 0;
    
    valoresExp.forEach((element, index) => {
        sumaExp += parseFloat(element);
        if (element == 1) {
            element = "";
        }
        funcionCD += `x_{${index + 1}}^{${element}}`;
        funcion_CD_opt += `\\hat{x}_{${index + 1}}^{${element}}`;
        lista_var_CD += `x_{${index + 1}}`;
        lista_var_CD_con_opt += `\\hat{x_{${index + 1}}}`;
        lista_exp_CD += `\\alpha_{${index + 1}}`;
        indices_list += `${index + 1}`;
        if (index + 1 < cantidadExp) {
            lista_var_CD += ", \\ ";
            lista_var_CD_con_opt += ", \\ ";
            lista_exp_CD += ", \\ ";
            indices_list += ", \\ ";
        }
    });

    let det_bordeado_evaluado_CD_con = '';
    let clasificacion_CD_con = '';
    let texto_resultante_max_min = "";

    let funcion_costo_CD = ``;
    if ((datos.precios).length != 0) {
        valoresCosto.forEach((element, index) => {
            if (element == 1) {
                element = "";
            }
            funcion_costo_CD += `{${element}}x_{${index + 1}}`;
            if (index + 1 < cantidadExp) {
                funcion_costo_CD += " + ";
            }
        });

        det_bordeado_evaluado_CD_con = resultados.det_bordeado_evaluado[0];
        clasificacion_CD_con = (resultados.det_bordeado_evaluado)[1];

        switch (clasificacion_CD_con) {
            case " > 0 ":
                let parametro_optimizar = "mínimo";
                let operacion_optimizar = "minimizan";
                let funcion_optimizar_concava_convexa = "convexa";
                let objetivo_CD = `Los resultados obtenidos evidencian que los puntos críticos representan el nivel óptimo al cual se pueden asignar 
                    los recursos para minimizar los costos o gastos. En el contexto económico, al minimizar se busca reducir los costos o gastos necesarios 
                    para alcanzar un nivel deseado de producción o nivel de utilidad, logrando una asignación eficiente del presupuesto. 
                    Por otro lado, si el objetivo es maximizar, el enfoque está en aumentar la utilidad o producción total bajo las limitaciones presupuestarias 
                    y de precios, destacando el impacto positivo de decisiones basadas en modelos matemáticos bien fundamentados.`;
                
                if (operacion_CD === "maximizar") {
                    parametro_optimizar = "máximo";
                    operacion_optimizar = "maximizan";
                    funcion_optimizar_concava_convexa = "cóncava";
                    objetivo_CD = `Los resultados obtenidos evidencian que los puntos críticos representan el nivel óptimo al cual se pueden asignar 
                    los recursos para maximizar la producción o la utilidad. En el contexto económico, al maximizar, el enfoque está en aumentar la 
                    utilidad o producción total bajo las limitaciones presupuestarias y de precios, destacando el impacto positivo de 
                    decisiones basadas en definiciones y teoremas matemáticos fundamentados.`;
                }
    
                switch (true) {
                    case resultados.hessiana_evaluada.includes("positiva"):
                        if (operacion_CD == "minimizar") {
                            texto_resultante_max_min += `
                                <p>
                                    Concluyendo, hemos encontrado un punto ${parametro_optimizar} local para la función Cobb-Douglas bajo la 
                                    restricción presupuestaria. Además, dado que la función Cobb-Douglas es ${funcion_optimizar_concava_convexa}, 
                                    este punto ${parametro_optimizar} es un ${parametro_optimizar} absoluto. Por lo tanto, los valores óptimos de 
                                    cada variable \\(${lista_var_CD}\\) que ${operacion_optimizar} la función son los que alcanzan el 
                                    ${parametro_optimizar}. Así, el valor de la función objetivo evaluada en las soluciones óptimas es:
                
                                    <span class="hidden_phone">
                                        \\[
                                            f(\\hat{x}) = f(${lista_var_CD_con_opt}) = ${funcion_CD_opt} = ${resultados.valor_puntos_criticos}
                                        \\]
                                    </span>
                                    <span class="hidden_pc">
                                        \\[
                                            f(\\hat{x}) = ${funcion_CD_opt} = ${resultados.valor_puntos_criticos}
                                        \\]
                                    </span>
                
                                    ${objetivo_CD}
                                </p>
                                <p>
                                    El análisis realizado mediante la función Cobb-Douglas, complementado con la evaluación de la matriz Hessiana y el determinante bordeado, 
                                    permite clasificar los puntos críticos y confirmar si corresponden a ${parametro_optimizar}s. Esto demuestra la importancia de utilizar la optimización 
                                    matemática para determinar condiciones precisas bajo restricciones reales, como los precios de los bienes y un presupuesto limitado. 
                                    Estos resultados no solo permiten identificar si se están maximizando beneficios o minimizando costos, sino que también resaltan la 
                                    importancia de evaluar las propiedades de la función objetivo para garantizar decisiones consistentes y económicamente racionales.
                                </p>
                            `;
                        } else {
                            texto_resultante_max_min += `En el análisis de la función Cobb-Douglas, el objetivo era maximizarla bajo la restricción presupuestaria dada. 
                            Sin embargo, el estudio de la matriz Hessiana y el determinante bordeado indicó que los puntos críticos corresponden a mínimos locales. 
                            Esto sugiere que la función es convexa en la región considerada, lo que significa que los puntos críticos representan niveles de producción 
                            o utilidad mínimos bajo las restricciones. Este resultado refleja un comportamiento atípico en funciones Cobb-Douglas, pero puede presentarse 
                            dependiendo de los valores de los parámetros o en escenarios económicos específicos. Desde una perspectiva económica, al buscar maximizar 
                            la producción o utilidad, los puntos críticos encontrados indican que los recursos disponibles están siendo subutilizados, ya que se alcanzan 
                            niveles mínimos de producción o utilidad. Este comportamiento podría reflejar un modelo en el que la distribución de los insumos no sea eficiente 
                            o donde los exponentes asignen una menor sensibilidad a los insumos más importantes. Para maximizar la producción, sería necesario reevaluar los 
                            parámetros de la función o las condiciones de la restricción presupuestaria.`;
                        }
                        break;
                
                    case resultados.hessiana_evaluada.includes("negativa"):
                        if (operacion_CD == "maximizar") {
                            texto_resultante_max_min += `
                                <p>
                                    Concluyendo, hemos encontrado un punto ${parametro_optimizar} local para la función Cobb-Douglas bajo la 
                                    restricción presupuestaria. Además, dado que la función Cobb-Douglas es ${funcion_optimizar_concava_convexa}, 
                                    este punto ${parametro_optimizar} es un ${parametro_optimizar} absoluto. Por lo tanto, los valores óptimos de 
                                    cada variable \\(${lista_var_CD}\\) que ${operacion_optimizar} la función son los que alcanzan el 
                                    ${parametro_optimizar}. Así, el valor de la función objetivo evaluada en las soluciones óptimas es:
                
                                    <span class="hidden_phone">
                                        \\[
                                            f(\\hat{x}) = f(${lista_var_CD_con_opt}) = ${funcion_CD_opt} = ${resultados.valor_puntos_criticos}
                                        \\]
                                    </span>
                                    <span class="hidden_pc">
                                        \\[
                                            f(\\hat{x}) = ${funcion_CD_opt} = ${resultados.valor_puntos_criticos}
                                        \\]
                                    </span>
                
                                    ${objetivo_CD}
                                </p>
                                <p>
                                    El análisis realizado mediante la función Cobb-Douglas, complementado con la evaluación de la matriz Hessiana y el determinante bordeado, 
                                    permite clasificar los puntos críticos y confirmar si corresponden a ${parametro_optimizar}s. Esto demuestra la importancia de utilizar la optimización 
                                    matemática para determinar condiciones precisas bajo restricciones reales, como los precios de los bienes y un presupuesto limitado. 
                                    Estos resultados no solo permiten identificar si se están maximizando beneficios o minimizando costos, sino que también resaltan la 
                                    importancia de evaluar las propiedades de la función objetivo para garantizar decisiones consistentes y económicamente racionales.
                                </p>
                            `;
                        } else {
                            texto_resultante_max_min += `Al analizar la función Cobb-Douglas, se buscó minimizarla bajo la restricción presupuestaria dada. Sin embargo, el análisis de 
                            la matriz Hessiana y el determinante bordeado, reveló que los puntos críticos encontrados corresponden a máximos locales. Matemáticamente, esto implica que en la región considerada, la función es cóncava, 
                            lo que confirma que los puntos críticos representan niveles de producción o utilidad máximos bajo las restricciones impuestas. Desde el punto de vista económico, el objetivo de 
                            minimizar costos o gastos no puede lograrse con los valores de los parámetros actuales, ya que la función presenta puntos críticos que maximizan la producción o utilidad. Este 
                            resultado resalta la naturaleza de las decisiones óptimas bajo una restricción presupuestaria: en este caso, se logra un nivel de producción óptimo utilizando eficientemente los 
                            recursos disponibles. Para explorar la minimización de costos, sería necesario reformular la función objetivo o considerar un modelo con diferentes exponentes que reflejen 
                            decrecimientos en la producción a medida que aumentan los insumos.`;
                        }
                        break;
                
                    default:
                        // Puntos de Silla: Si el determinante bordeado es negativo, indicando que el punto crítico no es ni un máximo ni un mínimo local.
                        texto_resultante_max_min += `Este resultado sugiere que el punto crítico podría ser un punto de máximo o mínimo local, pero su clasificación no está claramente definida debido a la 
                        naturaleza indeterminada de la matriz Hessiana en esta área. Desde un enfoque económico, esto implica que las condiciones actuales no permiten una conclusión definitiva sobre si los 
                        recursos están siendo optimizados de manera eficiente. En escenarios económicos reales, esta ambigüedad podría reflejar situaciones en las que la distribución de los insumos no genera 
                        una maximización clara de la producción o utilidad, y sería necesario reevaluar las condiciones del modelo o los parámetros de la función para obtener un resultado más preciso y 
                        económicamente racional.`;
                        break;
                }
    
                break;
        
            default:
                texto_resultante_max_min += `Concluyendo así que, el punto crítico no es ni un máximo ni un mínimo local. 
                Este resultado sugiere que la función no alcanza un óptimo en el punto crítico evaluado, lo que podría indicar 
                la presencia de un punto de silla o una falta de condiciones necesarias para la optimización con la restricción dada.
                En términos económicos, esto refleja una ineficiencia en la asignación de recursos o la imposibilidad de alcanzar 
                un óptimo económico bajo las condiciones dadas, como restricciones presupuestarias o relaciones específicas entre los insumos. 
                La presencia de un punto de silla, por ejemplo, indica que ciertos cambios en las decisiones podrían mejorar el resultado 
                en una dirección, pero empeorarlo en otra. Este análisis subraya la importancia de reevaluar las condiciones iniciales, 
                como los precios, el presupuesto o la naturaleza de la función objetivo, para identificar si el sistema es realmente viable 
                o necesita ajustes para alcanzar un resultado óptimo.
                `;
                break;
        }
    }
    
    // Extraer datos del cálculo
    let derivadas_CD_con = resultados.derivadas;
    let arr_derivadas_CD_con_phone = String(derivadas_CD_con).split(",");
    let derivadas_CD_con_phone = ``;
    arr_derivadas_CD_con_phone.forEach(element => {
        derivadas_CD_con_phone += `<p>\\( ${element} \\)</p>`;
    });

    let textOpt = ``;
    let tipo_de_punto = ``;
    let text_deriv_parc = ``;
    let text_conclusion_sin = ``;
    if (operacion_CD == `maximizar`) {
        textOpt = `la producción o la utilidad`;
        tipo_de_punto = `máximo`;
        text_deriv_parc = `Al maximizar una función Cobb-Douglas, como una función de utilidad o producción, 
        las derivadas parciales representan la contribución marginal de cada insumo al resultado total 
        (ya sea utilidad o producción). Económicamente, igualar las derivadas parciales a cero implica buscar 
        el punto donde los insumos están asignados de forma óptima, es decir, donde el aumento en la cantidad 
        de un insumo ya no genera mejoras adicionales en el objetivo. Este es el punto crítico que identifica 
        el nivel óptimo de cada insumo para maximizar el resultado total.`;
        text_conclusion_sin = `Maximizar funciones CD de n variables sin restricciones adicionales es generalmente 
        imposible, ya que la función sigue creciendo en función de las variables. Para encontrar un máximo local, 
        se requiere de restricciones (como restricciones presupuestarias o de recursos) o modificar la función de tal 
        forma que se pueda encontrar un máximo local para maximizar la función CD`;
    }else{
        textOpt = `el costo o los gastos`;
        tipo_de_punto = `mínimo`;
        text_deriv_parc = `Al minimizar una función Cobb-Douglas, como una función de costos, las derivadas 
        parciales indican la tasa de variación del costo respecto a cambios en cada insumo. Económicamente, 
        igualar estas derivadas a cero busca identificar la combinación de insumos que minimiza el costo total, 
        manteniendo un equilibrio entre los costos de diferentes insumos y la proporción de su uso en la función 
        de producción.`;
        text_conclusion_sin = `Minimizar una función Cobb-Douglas en n variables, sin restricciones adicionales, 
        generalmente no es posible de manera directa. Sin embargo, en situaciones donde los exponentes son negativos, 
        o existe una combinación de exponentes positivos y negativos, la función podría decrecer en algunas direcciones, 
        lo que permite la existencia de mínimos locales o globales bajo ciertas condiciones`;
    }

    let text_suma_exp = ``;
    let conclusion_previa = ``;
    let existe_punto_critico = false;

    if (sumaExp < 1) {
        text_suma_exp = `la función tiende a cero conforme los valores de \\( x_i \\) crecen, lo que implica que no hay un punto ${tipo_de_punto}.`;
    }else if (sumaExp > 1){
        text_suma_exp = `la función crece indefinidamente a medida que \\( x_i \\to \\infty \\), lo que indica que no hay un punto crítico dentro del dominio positivo.`;
    }else{
        text_suma_exp = `la función es homogénea de grado uno, lo que significa que no tiene extremos, pero mantiene un crecimiento proporcional.`;
    }

    // Ahora verificamos combinaciones generales
    let combinacionFrase = `De acuerdo a los valores de los exponentes \\((${lista_exp_CD})\\), podemos concluir que `;

    // Verificamos si todos los exponentes son positivos, negativos o mixtos
    if (valoresExp.every(alpha => alpha > 0)) {
        combinacionFrase += `un aumento en todos los \\(x_i\\) incrementará \\(f(x)\\) de manera proporcional a cada \\(\\alpha_i\\), \\(\\forall i = ${indices_list}\\). `;
    } else if (valoresExp.every(alpha => alpha < 0)) {
        combinacionFrase += `un aumento en todos los \\(x_i\\) disminuirá \\(f(x)\\), ya que todos los exponentes son negativos, \\(\\forall i = ${indices_list}\\). `;
    } else if (valoresExp.some(alpha => alpha > 0) && valoresExp.some(alpha => alpha < 0)) {
        combinacionFrase += `un aumento en algunos \\(x_i\\) incrementará \\(f(x)\\), mientras que otros la disminuirán debido a los exponentes mixtos, \\(\\forall i = ${indices_list}\\). `;
    }

    // Definir las condiciones de la matriz Hessiana
    if (valoresExp.every(alpha => alpha < 0) || (valoresExp.filter(alpha => alpha > 1).length <= 1 && valoresExp.filter(alpha => alpha >= 0).length == cantidadExp - 1 && sumaExp > 1)) {
        combinacionFrase += ` Además, la matriz Hessiana es definida positiva en la región del dominio, lo que implica que la función es convexa y los 
        puntos críticos encontrados corresponderán a mínimos locales.`;
        conclusion_previa += `En el análisis de la función Cobb-Douglas, el objetivo era maximizarla bajo la restricción presupuestaria dada. 
        Sin embargo, el estudio de la matriz Hessiana indicó que los puntos críticos corresponden a mínimos locales. 
        Esto sugiere que la función es convexa en la región considerada, lo que significa que los puntos críticos representan niveles de producción 
        o utilidad mínimos bajo las restricciones. Este resultado refleja un comportamiento atípico en funciones Cobb-Douglas, pero puede presentarse 
        dependiendo de los valores de los parámetros o en escenarios económicos específicos. Desde una perspectiva económica, al buscar maximizar 
        la producción o utilidad, los puntos críticos encontrados indican que los recursos disponibles están siendo subutilizados, ya que se alcanzan 
        niveles mínimos de producción o utilidad. Este comportamiento podría reflejar un modelo en el que la distribución de los insumos no sea eficiente 
        o donde los exponentes asignen una menor sensibilidad a los insumos más importantes. Para maximizar la producción, sería necesario reevaluar los 
        parámetros de la función o las condiciones de la restricción presupuestaria.
        `;
        if (operacion_CD == `minimizar`) {
            existe_punto_critico = true;
        }
    } else if (valoresExp.every(alpha => alpha > 0) && valoresExp.every(alpha => alpha < 1) && sumaExp < 1) {
        combinacionFrase += ` Además, la matriz Hessiana es definida negativa en la región del dominio, lo que implica que la función es cóncava y 
        los puntos críticos encontrados corresponderán a máximos locales.`;
        conclusion_previa += `Al analizar la función Cobb-Douglas, se buscó minimizarla bajo la restricción presupuestaria dada. Sin embargo, el análisis de 
        la matriz Hessiana reveló que los puntos críticos encontrados corresponden a máximos locales. Matemáticamente, esto implica que en la región considerada, la función es cóncava, 
        lo que confirma que los puntos críticos representan niveles de producción o utilidad máximos bajo las restricciones impuestas. Desde el punto de vista económico, el objetivo de 
        minimizar costos o gastos no puede lograrse con los valores de los parámetros actuales, ya que la función presenta puntos críticos que maximizan la producción o utilidad. Este 
        resultado resalta la naturaleza de las decisiones óptimas bajo una restricción presupuestaria: en este caso, se logra un nivel de producción óptimo utilizando eficientemente los 
        recursos disponibles. Para explorar la minimización de costos, sería necesario reformular la función objetivo o considerar un modelo con diferentes exponentes que reflejen 
        decrecimientos en la producción a medida que aumentan los insumos.
        `;
        if (operacion_CD == `maximizar`) {
            existe_punto_critico = true;
        }
    } else if (valoresExp.every(alpha => alpha < 0) || (valoresExp.filter(alpha => alpha > 1).length <= 1 && valoresExp.filter(alpha => alpha >= 0).length == cantidadExp - 1 && sumaExp >= 1)) {
        combinacionFrase += ` Además, la matriz Hessiana es semidefinida positiva en la región del dominio, lo que implica que la función es convexa y los 
        puntos críticos encontrados podrían ser mínimos locales, puntos de silla o no ser concluyentes por sí solos.`;
        conclusion_previa += `En el análisis de la función Cobb-Douglas, el objetivo era maximizarla bajo la restricción presupuestaria dada. 
        Sin embargo, el estudio de la matriz Hessiana indicó que los puntos críticos corresponden a mínimos locales. 
        Esto sugiere que la función es convexa en la región considerada, lo que significa que los puntos críticos representan niveles de producción 
        o utilidad mínimos bajo las restricciones. Este resultado refleja un comportamiento atípico en funciones Cobb-Douglas, pero puede presentarse 
        dependiendo de los valores de los parámetros o en escenarios económicos específicos. Desde una perspectiva económica, al buscar maximizar 
        la producción o utilidad, los puntos críticos encontrados indican que los recursos disponibles están siendo subutilizados, ya que se alcanzan 
        niveles mínimos de producción o utilidad. Este comportamiento podría reflejar un modelo en el que la distribución de los insumos no sea eficiente 
        o donde los exponentes asignen una menor sensibilidad a los insumos más importantes. Para maximizar la producción, sería necesario reevaluar los 
        parámetros de la función o las condiciones de la restricción presupuestaria.
        `;
        if (operacion_CD == `minimizar`) {
            existe_punto_critico = true;
        }
    } else if (valoresExp.every(alpha => alpha > 0) && valoresExp.every(alpha => alpha < 1) && sumaExp <= 1) {
        combinacionFrase += ` Además, la matriz Hessiana es semidefinida negativa en la región del dominio, lo que implica que la función es cóncava y 
        los puntos críticos encontrados podrían ser máximos locales, puntos de silla o no ser concluyentes por sí solos.`;
        conclusion_previa += `Al analizar la función Cobb-Douglas, se buscó minimizarla bajo la restricción presupuestaria dada. Sin embargo, el análisis de 
        la matriz Hessiana reveló que los puntos críticos encontrados corresponden a máximos locales. Matemáticamente, esto implica que en la región considerada, la función es cóncava, 
        lo que confirma que los puntos críticos representan niveles de producción o utilidad máximos bajo las restricciones impuestas. Desde el punto de vista económico, el objetivo de 
        minimizar costos o gastos no puede lograrse con los valores de los parámetros actuales, ya que la función presenta puntos críticos que maximizan la producción o utilidad. Este 
        resultado resalta la naturaleza de las decisiones óptimas bajo una restricción presupuestaria: en este caso, se logra un nivel de producción óptimo utilizando eficientemente los 
        recursos disponibles. Para explorar la minimización de costos, sería necesario reformular la función objetivo o considerar un modelo con diferentes exponentes que reflejen 
        decrecimientos en la producción a medida que aumentan los insumos.
        `;
        if (operacion_CD == `maximizar`) {
            existe_punto_critico = true;
        }
    } else {
        combinacionFrase += ` Además, la matriz Hessiana puede ser indefinida en los puntos críticos, lo que indicaría la presencia de 
        puntos de silla en los que la función cambia de concavidad a convexidad dependiendo de la dirección.`;
        existe_punto_critico = true;
    }

    let fin_punto_critico = existe_punto_critico ? "d-none" : "d-block";
    let continua_punto_critico = existe_punto_critico ? "d-block" : "d-none";

    let modalResultante = document.querySelector('#modalOptimizacionResult .modal-body');
    modalResultante.innerHTML = ""; // Limpia contenido previo
    let textResult = ``;
    
    if ((datos.precios).length != 0) {
        funcionAOptimizar += `
            <p class="hidden_phone">
                \\[
                    \\begin{align*}
                        \\text{${operacion_CD.substring(0, 3)}:} && 
                        f(x) = ${tecnologiaA} ${funcionCD} \\\\
                        \\text{sujeto a:} && 
                        c(x) = ${funcion_costo_CD} = ${costoTotal} \\\\
                    \\end{align*}
                \\]
            </p>
            <p class="hidden_pc">
                \\[
                    \\begin{align*}
                        \\text{${operacion_CD.substring(0, 3)}:} && 
                        f(x) = ${tecnologiaA} ${funcionCD} \\\\
                        \\text{sujeto a:} && 
                        c(x) = ${funcion_costo_CD} = ${costoTotal} \\\\
                    \\end{align*}
                \\]
            </p>
        `;
        textResult = `
            <p> 
                Sea \\(x = (${lista_var_CD}) \\in \\mathbb{R}^{${cantidadVariables}}_{+} \\) donde cada 
                \\(x_{i} \\) representa la cantidad asignada al bien o insumo \\(i \\), \\(\\forall \\ i = ${indices_list} \\). 
                El objetivo es ${operacion_CD} la función Cobb-Douglas \\(f(x) \\) sujeta a la restricción presupuestaria \\(c(x) \\).
                Esto se puede formular como: ${funcionAOptimizar}
            </p>
            <p>
                Desde una perspectiva económica, este tipo de optimización con restricciones es relevante en situaciones donde se busca 
                identificar la mejor combinación de insumos para ${operacion_CD} ${textOpt}, considerando limitaciones como el presupuesto o 
                recursos disponibles. El análisis de la función Cobb-Douglas bajo restricciones proporciona una base teórica para entender cómo 
                distribuir los recursos eficientemente entre distintos insumos, destacando su importancia relativa en el rendimiento total. 
                Resolver este tipo de problemas permite explorar puntos críticos y determinar si son ${tipo_de_punto}s, lo que contribuye a 
                mejorar la eficiencia y la toma de decisiones estratégicas en contextos económicos reales. Para resolver este tipo de problemas 
                utilizamos el método de Lagrange definiendo la función lagrangiana:
            </p>
            <p class="hidden_phone">
                \\[
                    \\psi(x) = \\psi(${lista_var_CD}) = ${tecnologiaA} ${funcionCD} - \\lambda \\left( ${funcion_costo_CD} - ${costoTotal} \\right)  
                \\]
            </p>
            <p class="hidden_pc">
                \\[
                    \\psi(x) = ${tecnologiaA} ${funcionCD}
                \\] 
                \\[
                    - \\lambda \\left( ${funcion_costo_CD} - ${costoTotal} \\right)  
                \\]
            </p>
            <p>
                donde \\(\\lambda\\) es el multiplicador de Lagrange que nos permite manejar la restricción del presupuesto, este refleja el cambio en 
                \\(f(x)\\) cuando se ajusta el presupuesto disponible. ${combinacionFrase}
            </p>
            
            <div id="continua_optimizacion" class="${continua_punto_critico}">
                <p>
                    A continuación, calculamos las derivadas parciales de \\(\\psi(x)\\) con respecto a 
                    cada \\(x_{i}\\) para \\(i = ${indices_list}\\) e igualamos a cero para encontrar los puntos críticos. Las derivadas parciales son:
                </p>
                <div id="derivadasParciales"></div>
                <p>
                    Igualando la derivada a cero y resolviendo la ecuación, por el teorema de Lagrange, obtenemos que el valor óptimo para cada variable \\(x_i\\), 
                    para ${operacion_CD} la función CD bajo la restricción presupuestaria. Denominándo cada valor como \\( \\hat{x_i} \\), los valores óptimos son:
                </p>
                \\[ ${resultados.puntos_criticos} \\]
                <p>
                    En este contexto, la expresión vectorial de las soluciones óptimas es:
                    \\( \\hat{x} = (${lista_var_CD_con_opt}) \\)
                </p>
                <p>
                    Desde un punto de vista económico, estos valores indican cómo distribuir el presupuesto de \\(c = ${costoTotal}\\) entre los \\(x_i\\) 
                    de manera proporcional a sus parámetros \\(\\alpha_{i}\\) (que reflejan la importancia relativa de cada insumo en la producción) 
                    y sus precios. Para determinar si los puntos críticos son máximos, mínimos o puntos de silla, se calcula el determinante bordeado. 
                    Para la construcción de este determinante, utilizamos la matriz Hessiana. En el contexto de funciones de tipo Cobb-Douglas, 
                    la matriz Hessiana se define como:
                    <div id="hessiana_con"></div>
                    Evaluando en el punto crítico, obtenemos que la matriz hessiana es ${resultados.hessiana_evaluada}. Ahora, el determinante bordeado es:
                    \\[ ${resultados.det_bordeado} \\]

                    Evaluando en el punto crítico, obtenemos que: 
                    \\[ ${det_bordeado_evaluado_CD_con} \\]
                    ${texto_resultante_max_min}
                </p>
            </div>

            <div id="finaliza_optimizacion" class="${fin_punto_critico}">
                ${conclusion_previa}
            </div>
            
        `;
    } else {
        funcionAOptimizar += `
            <p>
                \\[
                    \\begin{align*}
                        f(x) = ${tecnologiaA} ${funcionCD} \\\\
                    \\end{align*}
                \\]
            </p>
        `;
        textResult = `
            <p> 
                Sea \\(x = (${lista_var_CD}) \\in \\mathbb{R}^{${cantidadVariables}}_{+} \\) donde cada 
                \\(x_{i} \\) representa la cantidad asignada al bien o insumo \\(i \\), \\(\\forall \\ i = ${indices_list} \\). 
                El objetivo es ${operacion_CD} la función Cobb-Douglas, que se expresa como: ${funcionAOptimizar}
            </p>
            <p>
                Desde una perspectiva económica, este tipo de optimización sin restricciones es relevante en situaciones donde se busca 
                identificar la mejor combinación de insumos para ${operacion_CD} ${textOpt}, sin considerar limitaciones externas como 
                presupuesto o capacidad. El análisis de la función Cobb-Douglas proporciona una base teórica para entender cómo los insumos 
                o bienes interactúan entre sí, destacando la importancia de cada uno en el rendimiento total. Resolver este tipo de problemas 
                permite explorar puntos críticos y determinar si son ${tipo_de_punto}s, lo que contribuye a mejorar la eficiencia y la toma de 
                decisiones estratégicas en contextos económicos.
            </p>
            <p>
                A continuación, calculamos las derivadas parciales de \\(f(x)\\) con respecto a cada \\(x_{i}\\) para 
                \\(i = ${indices_list} \\) e igualamos a cero para encontrar los puntos críticos. Las derivadas parciales son:
            </p>
            <div id="derivadasParciales"></div>
            <p> ${text_deriv_parc} </p>
            <p> Igualando las derivadas parciales a cero, obtenemos: </p>
            \\[ ${resultados.puntos_criticos} \\]
                    <div id="hessiana_con"></div>

            <p>
                Sin embargo, no existen puntos críticos dentro del dominio positivo de \\( f(x) \\), ya que las derivadas parciales solo son iguales 
                a cero cuando \\( x_{i} = 0 \\), lo cual no es válido porque \\( x_{i} > 0 \\). Además, dado que \\( \\frac{\\partial f}{\\partial x_{i}} \\) 
                depende de los exponentes \\( \\alpha_{i} \\), ${text_suma_exp}
                Entonces, sin restricciones adicionales, no es posible identificar un ${tipo_de_punto} en este escenario, es decir, no hay un punto donde la combinación 
                de insumos sea óptima. ${text_conclusion_sin}. 
            </p>
            <div id="finaliza_optimizacion" class="${fin_punto_critico}">Texto de optimización final</div>

        `;
    }

    modalResultante.innerHTML = textResult;
    derivadasParciales = document.getElementById("derivadasParciales");
    derivadasParciales.innerHTML = `
        <div class="d-flex align-items-center flex-column">
            ${derivadas_CD_con_phone}
        </div>
    `;
    obtenerHessiana_Con(cantidadExp);
    
    MathJax.typeset();
}