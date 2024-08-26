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
    let filasExp = '<tr><td>&alpha;<sub>1</sub></td><td><input type="text" class="form-control" id="alpha_1" onkeypress="return soloNumeros(event);" title="Ingresa el valor del exponente de la variable 1" placeholder="Ingresa el valor del exponente de x_1" required></td></tr>';
    for (let index = 1; index < e; index++) {
        filasExp = filasExp + `<tr><td>&alpha;<sub>${index + 1}</sub></td><td><input type="text" class="form-control" id="alpha_${index + 1}" onkeypress="return soloNumeros(event);" title="Ingresa el valor del exponente de la variable ${index + 1}" placeholder="Ingresa el valor del exponente de x_${index + 1}" required></td></tr>`;
    }
    document.getElementById('tablaExponentes').innerHTML = filasExp;

    const RestriccionCheck = document.getElementById('RestriccionCheck').checked;

    if (RestriccionCheck) {
        const costoTotal = `<tr><td>Total</td><td><input type="text" min="0" class="form-control" id='costoTotal' onkeypress="return soloNumeros(event);" title="Ingresa el valor del costo total" placeholder="Ingresa el precio del costo total" required></td></tr>`;
        let filasVariables = '<tr><td>x<sub>1</sub></td><td><input type="text" min="0" class="form-control" id="x_1" onkeypress="return soloNumeros(event);" title="Ingresa el precio por unidad de la variable 1" placeholder="Ingresa el precio de x_1" required></td></tr>';
        for (let index = 1; index < e; index++) {
            filasVariables = filasVariables + `<tr><td>x<sub>${index + 1}</sub></td><td><input type="text" class="form-control" id="x_${index + 1}" title="Ingresa el precio por unidad de la variable ${index + 1}" placeholder="Ingresa el precio de x_${index + 1}" required></td></tr>`;
        }
        document.getElementById('tablaUnidadesCosto').innerHTML = costoTotal + filasVariables;
        document.getElementById('unidadesCosto').classList.remove('d-none');
    } else {
        document.getElementById('unidadesCosto').classList.add('d-none');
    }
}

function soloNumeros(evt) {
    var code = (evt.which) ? evt.which : evt.keyCode;
    var inputText = evt.target.value;

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

var form = document.getElementById('button-formulario-optimizacion');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('click en formulario');
})




