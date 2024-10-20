let cantidadVariables = 5;
let cantidadVariablesOpc = '<option select>1</option>'
var variableExpo = document.getElementById('inputDimension').value;
for (let index = 2; index < cantidadVariables + 1; index++) {
    cantidadVariablesOpc = cantidadVariablesOpc + `<option>${index}</option>`;
}

document.getElementById('inputDimension').innerHTML = cantidadVariablesOpc;
cantidadExp(variableExpo);

function cantidadExponente(e) {
    variableExpo = document.getElementById(e).value;
    cantidadExp(variableExpo);
}

function cantidadExp(e) {
    let filasExp = `
        <tr>
            <td>&alpha;<sub>1</sub></td>
            <td>
                <input 
                    type="text" 
                    class="form-control" 
                    id="alpha_1" 
                    onkeypress="return soloNumeros(event);"
                    onpaste="return false" oncut="return false" oncopy="return false" 
                    title="Ingresa el valor del exponente de la variable 1" 
                    placeholder="Ingresa el valor del exponente de x_1" 
                    required
                >
            </td>
        </tr>`
    ;
    for (let index = 1; index < e; index++) {
        filasExp = filasExp + `
            <tr>
                <td>&alpha;<sub>${index + 1}</sub></td>
                <td><input 
                    type="text" 
                    class="form-control" 
                    id="alpha_${index + 1}" 
                    onkeypress="return soloNumeros(event);"
                    onpaste="return false" oncut="return false" oncopy="return false"
                    title="Ingresa el valor del exponente de la variable ${index + 1}" 
                    placeholder="Ingresa el valor del exponente de x_${index + 1}" 
                    required>
                </td>
            </tr>`;
    }
    document.getElementById('tablaExponentes').innerHTML = filasExp;

    const RestriccionCheck = document.getElementById('RestriccionCheck').checked;

    if (RestriccionCheck) {
        const costoTotal = `
            <tr><td>Total</td>
                <td>
                    <input 
                        type="text" 
                        min="0" 
                        class="form-control" 
                        id='costoTotal' 
                        onkeypress="return soloNumeros(event);" 
                        onpaste="return false" oncut="return false" oncopy="return false"
                        title="Ingresa el valor del costo total" 
                        placeholder="Ingresa el precio del costo total" 
                        required
                    >
                </td>
            </tr>`;

        let filasVariables = `
            <tr>
                <td>w<sub>1</sub></td>
                <td>
                    <input 
                        type="text" 
                        min="0" 
                        class="form-control" 
                        id="w_1" 
                        onkeypress="return soloNumeros(event);" 
                        onpaste="return false" oncut="return false" oncopy="return false" 
                        title="Ingresa el precio por unidad de la variable 1" 
                        placeholder="Ingresa el precio de x_1" 
                        required
                    >
                </td>
            </tr>`;

        for (let index = 1; index < e; index++) {
            filasVariables = filasVariables + `
                                <tr>
                                    <td>w<sub>${index + 1}</sub></td>
                                    <td>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="w_${index + 1}" 
                                            onkeypress="return soloNumeros(event);" 
                                            onpaste="return false" oncut="return false" oncopy="return false"
                                            title="Ingresa el precio por unidad de la variable ${index + 1}" 
                                            placeholder="Ingresa el precio de x_${index + 1}" 
                                            required
                                        >
                                    </td>
                                </tr>`;
        }
        document.getElementById('tablaUnidadesCosto').innerHTML = costoTotal + filasVariables;
        document.getElementById('unidadesCosto').classList.remove('d-none');
    } else {
        document.getElementById('unidadesCosto').classList.add('d-none');
        document.getElementById('tablaUnidadesCosto').innerHTML = "";

    }
}

function soloNumeros(evt) {
    var code = (evt.which) ? evt.which : evt.keyCode;
    var inputText = evt.target.value;

    // Previene copiar, pegar y cortar
    evt.target.addEventListener('paste', function(e) {
        e.preventDefault();
    });
    evt.target.addEventListener('copy', function(e) {
        e.preventDefault();
    });
    evt.target.addEventListener('cut', function(e) {
        e.preventDefault();
    });

    if (code == 8) { // backspace.
        return true;
    } else if ((code >= 48 && code <= 57) || (code === 45 && inputText.length === 0)) { // números del 0 al 9 y guión en la primera posición.
        return true;
    } else if (code === 46 && inputText.indexOf('.') === -1) { // punto decimal.
        return true;
    } else { // otras teclas.
        return false;
    }
}

function obtenerExponentes(e, parametro) {
    let exponentes = [];
    // Recorre todos los inputs de exponentes y captura sus valores
    for (let index = 1; index <= e; index++) {
        let alphaValue = document.getElementById(`${parametro}_${index}`).value;
        alphaValue = parseFloat(alphaValue); // Convierte el valor a número
        
        // Valida que el valor sea un número y no esté vacío
        if (!isNaN(alphaValue)) {
            exponentes.push(alphaValue); // Almacena el valor en el array
        }
    }

    return exponentes; // Retorna el array de exponentes
}

var form = document.getElementById('formulario-optimizacion');
form.addEventListener('click', function (event) {
    // Obtener el formulario
    var formulario = document.getElementById('formularioCD');
    var campos = formulario.querySelectorAll('input[required]');
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

    // Verifica si el valor es un número válido, si no, asigna 1 como valor por defecto
    if (isNaN(tecnologiaA) || tecnologiaA === "" || tecnologiaA == 1) {
        document.getElementById('inputTecnologia').style.borderColor = "";
        tecnologiaA = "";
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
    
    if (todosCompletos) {
        document.getElementById('mensajeError').style.display = "none";
        const restriccionCheck = document.getElementById('RestriccionCheck').checked;
        const tipoOptimizacion = document.getElementById('inputState').value;

        var mensajeModal = `<p>Has seleccionado <strong>` + tipoOptimizacion + `</strong> la función Cobb-Douglas \\(f(x) = f(${lista_var_CD})\\).</p>`;
        if (restriccionCheck) {
            mensajeModal += `
                <p>Sujeta a la restricción \\(c(x) = c(${lista_var_CD})\\).</p>
                <p>Esto se puede formular como:</p>
                <p class="hidden_phone">
                    \\[
                        \\begin{align*}
                            \\text{${tipoOptimizacion}:} && 
                            f(x) = ${tecnologiaA} ${funcion_CD} \\\\
                            \\text{Sujeto a:} && 
                            c(x) = ${funcion_costo_CD} = ${costoTotal} \\\\
                        \\end{align*}
                    \\]
                </p>
                <p class="hidden_pc">
                    \\[
                        \\begin{align*}
                            \\text{${tipoOptimizacion.substring(0, 3)}:} && 
                            f(x) = ${tecnologiaA} ${funcion_CD} \\\\
                            \\text{Sujeto a:} && 
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
            // mensajeModal = `<p>No hay restricciones en esta optimización.</p>`;
        }
        
        // Reemplazar el contenido del modal
        document.querySelector('#modalOptimizar .modal-body').innerHTML = mensajeModal;

        var modalElement = new bootstrap.Modal(document.getElementById('modalOptimizar'));
        modalElement.show();
        
    } else {
        document.getElementById('mensajeError').style.display = "block";
    }
    
    MathJax.typeset();
})
