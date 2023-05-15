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
    let filasExp = '<tr><td>alpha<sub>1</sub></td><td><input type="text" class="form-control" id="alpha_1" onkeypress="return soloExponentes(event);"></td></tr>';
    for (let index = 1; index < e; index++) {
        filasExp = filasExp + `<tr><td>alpha<sub>${index + 1}</sub></td><td><input type="text" class="form-control" id="alpha_${index + 1}" onkeypress="return soloExponentes(event);"></td></tr>`;
    }
    document.getElementById('tablaExponentes').innerHTML = filasExp;

    const RestriccionCheck = document.getElementById('RestriccionCheck').checked;

    if (RestriccionCheck) {
        const costoTotal = `<tr><td>Total</td><td><input type="text" min="0" class="form-control" id='costoTotal' onkeypress="return soloNumeros(event);"></td></tr>`;
        let filasVariables = '<tr><td>X<sub>1</sub></td><td><input type="text" min="0" class="form-control" id="X_1" onkeypress="return soloNumeros(event);"></td></tr>';
        for (let index = 1; index < e; index++) {
            filasVariables = filasVariables + `<tr><td>X<sub>${index + 1}</sub></td><td><input type="text" class="form-control" id="X_${index + 1}"></td></tr>`;
        }
        document.getElementById('tablaUnidadesCosto').innerHTML = costoTotal + filasVariables;
        document.getElementById('unidadesCosto').classList.remove('d-none');
    } else {
        document.getElementById('unidadesCosto').classList.add('d-none');
    }
}

function soloNumeros(evt) {
    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;
    if (code == 8) { // backspace.
        return true;
    } else if (code >= 48 && code <= 57) { // es a number.
        return true;
    } else { // otras keys.
        return false;
    }
}

function soloExponentes(evt) {
    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;
    console.log(code);
    if (code == 8) { // backspace.
        return true;
    } else if (code >= 46 && code <= 57) { // es a number.
        return true;
    } else { // otras keys.
        return false;
    }
}


