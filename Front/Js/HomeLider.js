const cboInstructores = document.getElementById('CboInstructores');
const nombreInstructor = document.getElementById('NombreInstructor');
const cboEstado = document.getElementById('CboEstado');
const cboFicha = document.getElementById('Cboficha');
const radio1 = document.getElementById('radio1');
const radio2 = document.getElementById('radio2');
const inicioCalendario = document.getElementById('InicioAsignacion');
const finCalendario = document.getElementById('FinAsignacion');
const observacion1 = document.getElementById('Observacion1');
const observacion2 = document.getElementById('Observacion2');
const observacion3 = document.getElementById('Observacion3');
const fechavisita1 = document.getElementById('Visita1');
const fechavisita2 = document.getElementById('Visita2');
const fechavisita3 = document.getElementById('Visita3');
const btnAsignar = document.getElementById('btnasignar');
const btnmodasignacion = document.getElementById('btnmodasignacion');
const btnGuardarCambios = document.getElementById('btnguardarcambios');
const Nombrepersonaseg = document.getElementById('Nombredelapersona');
const fichapersonaseg = document.getElementById('fichapersona');

fichapersonaseg.style.display = 'none';
Nombrepersonaseg.style.display = 'none';

function seleccionarInstructor(NombreIns, NumeroDocumento) {
    cboInstructores.textContent = NumeroDocumento;
    nombreInstructor.value = NombreIns;
}
// Mejora de la función seleccionarEstado
function seleccionarEstado(Estado) {
    cboEstado.textContent = Estado;
}
// Mejora de la función seleccionarFichapen
function seleccionarFichapen(Ficha) {
    cboFicha.textContent = Ficha;
}

//funcion de carga para mostrar la tabla con su paginacion (ocultando cuadro de busqueda,numero de elementos 
//y visualizacion por cantidades grandes, esta actualmente limitada a 5 registros a la vez)
function initializeDataTable(tableId) {
    $('#' + tableId).DataTable({
        "pagingType": "full_numbers",
        "pageLength": 5,
        "searching": false,
        "lengthChange": false,
        "info": false,
    });
}

function initializeDataTableRecargado(tableId, estado) {
    const tabla = $('#' + tableId).DataTable({
        "pagingType": "full_numbers",
        "pageLength": 5,
        "searching": false,
        "lengthChange": false,
        "info": false,
        "stateSave": true,
        "stateSaveCallback": function (settings, data) {
            localStorage.setItem('dataTables_' + tableId, JSON.stringify(data));
        },
        "stateLoadCallback": function (settings) {
            return JSON.parse(localStorage.getItem('dataTables_' + tableId));
        },
        ...estado
    });

    if (filaSeleccionadaIndex !== null) {
        const selectedNode = tabla.row(filaSeleccionadaIndex).nodes().to$();
        selectedNode.addClass('fila-seleccionada');
        console.log('Fila seleccionada después de la recarga:', tabla.row(filaSeleccionadaIndex).data());
        filaSeleccionadaIndex = null;
    }

    // Aplicar la clase de selección después de cada redibujo de la tabla
    tabla.on('page.dt', function () {
        tabla.rows().nodes().to$().removeClass('fila-seleccionada');
        limpiarCampos();
    });
}

//funciones de carga que muestran y ocultan el menu
document.getElementById('iconButton').addEventListener('mouseenter', function () {
    // Mostrar el menú
    $(this).find('.dropdown-menu').show();
});
// Manejar el evento mouseleave para ocultar el menú
document.getElementById('iconButton').addEventListener('mouseleave', function () {
    // Ocultar el menú
    $(this).find('.dropdown-menu').hide();
});
//funcion de accion para cerrar sesion en el sistema
document.getElementById('btncerrarsesion').addEventListener('click', function () {
    window.location.href = "Indexhtml.html";
});
//funcion de prueba mostrar divs
document.getElementById('MenuAsignamiento').addEventListener('click', function () {
    mostrarDiv('c1')
});
document.getElementById('MenuFichas').addEventListener('click', function () {
    mostrarDiv('c2')
});
document.getElementById('MenuSeguimiento').addEventListener('click', function () {
    mostrarDiv('c3')
});


function mostrarDiv(divClass) {
    // Oculta todos los divs al hacer clic en una opción del menú
    var divs = document.querySelectorAll('.container-fluid');
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.display = 'none';
    }
    // Muestra el div correspondiente a la clase
    var selectedDiv = document.querySelector('.' + divClass);
    if (selectedDiv) {
        selectedDiv.style.display = 'block';
    }
}

radio1.checked = true;

document.addEventListener("DOMContentLoaded", function () {
    // Obtener la tabla y sus th
    var tabla = document.getElementById('tablareg');
    var thArray = Array.from(tabla.getElementsByTagName('th'));

    // Mapeo de nombres de columna
    const columnasPorAsignar = [
        'Codigo',
        'Especialidad',
        'Fecha inicio lectiva',
        'Fecha fin lectiva',
        'Fecha inicio productiva',
        'Fecha fin productiva'
    ];
    const columnasYaAsignadas = [
        'Codigo',
        'Documento del instructor',
        'Ficha',
        'Fecha asignacion',
        'Fecha fin asignacion',
        'Estado asignacion'
    ];
    // Función para cambiar los identificadores y textos de los th
    function cambiarColumnas(columnas) {
        thArray.forEach((th, index) => {
            th.id = columnas[index] + 'Column';
            th.textContent = columnas[index];
        });
    }
    radio1.addEventListener('click', function () {
        if (radio1.checked) {
            cambiarColumnas(columnasPorAsignar);
            mostrarfichassinasignacion();

            // Puedes agregar aquí la lógica para mostrar los datos correspondientes
        }
        cambiarBotones();
    });
    radio2.addEventListener('click', function () {
        if (radio2.checked) {
            cambiarColumnas(columnasYaAsignadas);
            mostrarfichasasignadas();
            // Puedes agregar aquí la lógica para mostrar los datos correspondientes
        }
        cambiarBotones();
    });
    mostrarfichassinasignacion();
});

//funcion que sirve para formatear la fecha que me trae la api a formato dd/mm/yyyyy
function formatearFecha(fecha) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', options);
    return fechaFormateada;
}

function mostrarfichassinasignacion() {
    fetch('https://SeguimientoSena.somee.com/Fichas/TraerFichas')
        .then(response => response.json())
        .then(data => {
            const tablaFichas = $('#tablareg').DataTable();
            if (tablaFichas) {
                tablaFichas.destroy();
            }
            // Obtener la tabla body
            var tablaBody = document.getElementById('tablaBody');

            // Verificar si los datos están presentes y no son nulos
            if (data && data.length > 0) {
                tablaBody.innerHTML = '';

                // Iterar sobre los datos y agregar filas a la tabla
                data.forEach(item => {
                    var row = tablaBody.insertRow();
                    row.insertCell(0).textContent = item.codigoFicha || '';
                    row.insertCell(1).textContent = item.especialidadFicha || '';
                    row.insertCell(2).textContent = formatearFecha(item.fechaInicioLectivaFicha) || '';
                    row.insertCell(3).textContent = formatearFecha(item.fechaFinLectivaFicha) || '';
                    row.insertCell(4).textContent = formatearFecha(item.fechaInicioProductivaFicha) || '';
                    row.insertCell(5).textContent = formatearFecha(item.fechaFinProductivaFicha) || '';
                });
                initializeDataTable('tablareg');
            } else {
                console.error('La respuesta de la API está vacía o no es válida.');
            }
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
}

function mostrarfichasasignadas() {
    fetch('https://SeguimientoSena.somee.com/Asignacion/TraerFichasAsignadas')
        .then(response => response.json())
        .then(data => {

            const tablaFichas = $('#tablareg').DataTable();
            if (tablaFichas) {
                tablaFichas.destroy();
            }
            // Obtener la tabla body
            var tablaBody = document.getElementById('tablaBody');

            // Verificar si los datos están presentes y no son nulos
            if (data && data.length > 0) {
                tablaBody.innerHTML = '';

                // Iterar sobre los datos y agregar filas a la tabla
                data.forEach(item => {
                    var row = tablaBody.insertRow();
                    row.insertCell(0).textContent = item.codigoAsignacion || '';
                    row.insertCell(1).textContent = item.numeroDocumentoInstructorAsignacion || '';
                    row.insertCell(2).textContent = item.codigoFichaAsignacion || '';
                    row.insertCell(3).textContent = formatearFecha(item.fechaInicioAsignacion) || '';
                    row.insertCell(4).textContent = formatearFecha(item.fechaFinAsignacion) || '';
                    row.insertCell(5).textContent = item.estadoAsignacion || '';
                });

                initializeDataTable('tablareg');
            } else {
                console.error('La respuesta de la API está vacía o no es válida.');
            }
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
}

let filaSeleccionadaIndex;

function mostraraprendicesfichas() {
    const codigodefichabuscar = document.getElementById("Codfichasearchseg").value;
    const apiUrl = `https://SeguimientoSena.somee.com/Seguimientodto/TraerinformacionAprendices/${codigodefichabuscar}`

    const tablaFichas = $('#tablafichasunicas').DataTable();

    // Guardar el estado actual de DataTables
    const estadoActual = tablaFichas.state.loaded();

    // Guardar el índice de la fila seleccionada actual antes de destruir la tabla
    const filaSeleccionada = tablaFichas.row('.fila-seleccionada');
    filaSeleccionadaIndex = filaSeleccionada.length > 0 ? filaSeleccionada.index() : null;
    console.log('Fila seleccionada antes de destruir la tabla:', filaSeleccionadaIndex);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            var tablaBody = document.getElementById('tablabodyfichasandaprend');

            // Destruir la tabla
            if (tablaFichas) {
                tablaFichas.destroy();
            }

            if (data && data.length > 0) {
                tablaBody.innerHTML = '';

                var descripcionr = data[0];
                if (descripcionr.numeroDocumentoAprendiz == null) {
                    tablaBody.innerHTML = 'Null data.';
                    swal("sin datos", "Esta ficha no tiene una asignación","error")
                }

                else {
                    data.forEach(item => {
                        var row = tablaBody.insertRow();
                        row.insertCell(0).textContent = item.codigoFicha || '';
                        row.insertCell(1).textContent = item.numeroDocumentoAprendiz || '';
                        row.insertCell(2).textContent = item.apellidosAprendiz || '';
                        row.insertCell(3).textContent = item.nombresAprendiz || '';
                        row.insertCell(4).textContent = item.visita1Seguimiento ? formatearFecha(item.visita1Seguimiento) : '';
                        row.insertCell(5).textContent = item.visita2Seguimiento ? formatearFecha(item.visita2Seguimiento) : '';
                        row.insertCell(6).textContent = item.visita3Seguimiento ? formatearFecha(item.visita3Seguimiento) : '';
                    });
                    initializeDataTableRecargado('tablafichasunicas', estadoActual);
                }
            } else {
                console.error('La respuesta de la API está vacía o no es válida.');
                swal("sin datos", "Esta ficha no tiene información actual sobre seguimientos", "error")
                limpiarCampos();
                tablaBody.innerHTML = 'Null data.';
                
            }
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
}


function MostrarNombreInstructores() {

    fetch('https://SeguimientoSena.somee.com/Instructores/TraerInstructores')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    if (item && item.numeroDocumentoInstructor !== undefined) {
                        // Crear una opción para cada instructor y agregarla al combo
                        const optionElement = document.createElement('a');
                        optionElement.classList.add('dropdown-item');
                        optionElement.href = '#';
                        optionElement.textContent = item.numeroDocumentoInstructor;
                        optionElement.onclick = function () {
                            seleccionarInstructor(item.nombresInstructor, item.numeroDocumentoInstructor);
                        };
                        cboInstructores.nextElementSibling.appendChild(optionElement);
                    } else {
                        console.error('Un objeto en la respuesta no tiene la propiedad esperada:', item);
                    }
                });
            } else {
                console.error('La respuesta de la API no es un array válido o está vacía.');
            }
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
}

function Parafechas() {
    const today = new Date().toISOString().split('T')[0];
    inicioCalendario.min = today;
    fechavisita1.min = today;
    
    fechavisita3.min = fechavisita2.value;

    inicioCalendario.addEventListener('change', function () {
        // Obtener la fecha seleccionada en el primer calendario
        const fechaInicio = new Date(this.value);

        // Calcular la fecha máxima permitida para el segundo calendario (2 años después)
        const fechaMaxima = new Date(fechaInicio);
        fechaMaxima.setFullYear(fechaMaxima.getFullYear() + 2);

        // Formatear la fecha máxima para el atributo 'max' del segundo calendario
        const fechaMaximaFormato = fechaMaxima.toISOString().split('T')[0];

        // Establecer la fecha máxima en el segundo calendario
        finCalendario.min = inicioCalendario.value;
        finCalendario.max = fechaMaximaFormato;

        if (inicioCalendario.value > finCalendario.value && finCalendario.value !== '') {

            const fechaInicio = new Date(inicioCalendario.value);

            fechaInicio.setDate(fechaInicio.getDate() + 1);
            // Actualizar el valor del calendario de fin
            finCalendario.value = fechaInicio.toISOString().split('T')[0];
        }
    });
    fechavisita1.addEventListener('change', function () {
        // Obtener la fecha seleccionada en el primer calendario
        fechavisita2.min = fechavisita1.value;

    });

    fechavisita2.addEventListener('change', function () {
        // Obtener la fecha seleccionada en el primer calendario
        fechavisita3.min = fechavisita2.value;
    });
}
function cambiarBotones() {
    btnAsignar.style.display = 'none';
    btnmodasignacion.style.display = 'none';
    btnGuardarCambios.style.display = 'none';
    // Determinar la visibilidad según la selección del combo y del radio button
    if (radio1.checked) {
        btnAsignar.style.display = 'block';
    } else {
        btnGuardarCambios.style.display = 'block';
        btnmodasignacion.style.display = 'block';
    }
}

function mostrarobservaciones(codigoficha, numerodocaprendiz) {

    const apiUrl = `https://SeguimientoSena.somee.com/Seguimientodto/TraerinformacionAprendices/${codigoficha}/${numerodocaprendiz}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.length > 0) {
                const item = data[0];

                // Asignar valores a los campos de observación
                $('#Observacion1').val(item.observacion1Seguimiento).mouseover(function () {
                    $(this).attr('title', item.observacion1Seguimiento);
                });
                $('#Observacion2').val(item.observacion2Seguimiento).mouseover(function () {
                    $(this).attr('title', item.observacion2Seguimiento);
                });
                $('#Observacion3').val(item.observacion3Seguimiento).mouseover(function () {
                    $(this).attr('title', item.observacion3Seguimiento);
                });

                revisar();
            } else {
                console.error('La respuesta de la API está vacía o no es válida.');
            }
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));


}

function revisar() {
    const fechas = ['Visita1', 'Visita2', 'Visita3'];
    const observaciones = ['Observacion1', 'Observacion2', 'Observacion3'];

    for (let i = 0; i < fechas.length; i++) {
        const fechaElement = document.getElementById(fechas[i]);
        const observacionElement = document.getElementById(observaciones[i]);

        const hasValue = observacionElement.value && fechaElement.value;
        observacionElement.disabled = hasValue;
        fechaElement.disabled = hasValue ? true : false;
    }
}


//corregir el guardado de los datos (posiblemnete es el modo en el que se envia el json, la api y el endpoint estan bien)

var codigoFichaSeleccionada;
var numeroDocumentoSeleccionado;





function mostrardatosantesdeguardar() {
    // Datos
    var codigoFicha = codigoFichaSeleccionada;
    var numeroDocumentoAprendiz = numeroDocumentoSeleccionado;

    // Obtener los valores de observaciones y fechas y convertir a null si están vacíos
    var observacion1Value = convertirANull(observacion1.value);
    var fechavisita1Value = convertirANull(fechavisita1.value);

    var observacion2Value = convertirANull(observacion2.value);
    var fechavisita2Value = convertirANull(fechavisita2.value);

    var observacion3Value = convertirANull(observacion3.value);
    var fechavisita3Value = convertirANull(fechavisita3.value);

    // Construir objeto JSON
    var jsonData = {
        "visita1Seguimiento": fechavisita1Value,
        "observacion1Seguimiento": observacion1Value,
        "visita2Seguimiento": fechavisita2Value,
        "observacion2Seguimiento": observacion2Value,
        "visita3Seguimiento": fechavisita3Value,
        "observacion3Seguimiento": observacion3Value
    };

    // Endpoint
    var endpoint = `https://SeguimientoSena.somee.com/Seguimientodto/Actualizarseguimientos/${codigoFicha}/${numeroDocumentoAprendiz}`;

    // Realizar la solicitud HTTP
    fetch(endpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
        .then(response => {
            if (!response.ok) {
                // Capturar el cuerpo de la respuesta en caso de un error
                return response.text().then(errorText => {
                    throw new Error(`HTTP error! Status: ${response.status}, Error: ${errorText}`);
                });
            }
            else {
                swal("Actualizado con exito","","success")
                mostraraprendicesfichas();
                revisar();
                
            }
            return response.text();
        })
        .catch(error => {
            console.error('Error en la actualización:', error);
        });
}

function limpiarCampos() {
    const observaciones = [observacion1, observacion2, observacion3];
    const fechasVisita = [fechavisita1, fechavisita2, fechavisita3];

    // Limpiar campos de texto y habilitar
    for (const observacion of observaciones) {
        observacion.value = '';
        observacion.disabled = false;
    }

    // Limpiar campos de fecha y habilitar
    for (const fechaVisita of fechasVisita) {
        fechaVisita.value = '';
        fechaVisita.disabled = false;
    }

    Nombrepersonaseg.innerHTML = '';
    fichapersonaseg.innerHTML = '';

    fichapersonaseg.style.display = 'none';
    Nombrepersonaseg.style.display = 'none';
}



// Función para verificar y convertir a null si está vacío
function convertirANull(valor) {
    return valor && valor.trim() !== '' ? valor.trim() : null;
}

document.addEventListener("DOMContentLoaded", function () {
    // Muestra el primer div por defecto
    mostrarDiv('c1');
    MostrarNombreInstructores();
    Parafechas();
    cambiarBotones()

});

$(document).ready(function () {
    // Agrega un evento de clic a las filas de la tabla
    $('#tablareg tbody').on('click', 'tr', function () {
        // Remueve la clase de color de fondo de todas las filas
        $('#tablareg tbody tr').removeClass('fila-seleccionada');

        // Añade la clase de color de fondo a la fila clicada
        $(this).addClass('fila-seleccionada');

        $('#CodigoFicha').prop('disabled', true);

       

        // Obtiene los datos de todas las celdas de la fila clicada
        var rowData = $(this).find('td').map(function () {
            return $(this).text();
        }).get();

        if (radio1.checked) {
            // Actualiza el valor del campo de texto con el primer dato (código de ficha)
            $('#CodigoFicha').val(rowData[0]);
        }
        else if (radio2.checked) {
            $('#CodigoFicha').val(rowData[2]);

            var partes = rowData[3].split('/');
            var partes2 = rowData[4].split('/');
            var fechaComoDateinicio = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
            var fechaComoDatefinal = new Date(`${partes2[2]}-${partes2[1]}-${partes2[0]}`);
            var fechainiciostring = fechaComoDateinicio.toISOString().split('T')[0];
            var fechafinstring = fechaComoDatefinal.toISOString().split('T')[0];
            document.getElementById('InicioAsignacion').value = fechainiciostring;
            document.getElementById('FinAsignacion').value = fechafinstring;
        }

    });

});

$(document).ready(function () {
    $('#tablafichasunicas tbody').on('click', 'tr', function () {
        // Remueve la clase de color de fondo de todas las filas
        $('#tablafichasunicas tbody tr').removeClass('fila-seleccionada');
        // Añade la clase de color de fondo a la fila clicada
        $(this).addClass('fila-seleccionada');

        // Obtiene los datos de todas las celdas de la fila clicada
        var rowData = $(this).find('td').map(function () {
            return $(this).text();
        }).get();

        codigoFichaSeleccionada = rowData[0];
        numeroDocumentoSeleccionado = rowData[1];

        fichapersonaseg.style.display = 'block';
        Nombrepersonaseg.style.display = 'block';

        fichapersonaseg.innerHTML = "Ficha: " + rowData[0]
        Nombrepersonaseg.innerHTML = "Nombre: "+ rowData[3] + " " + rowData[2];
        


        var partes = rowData[4] ? rowData[4].split('/') : null;
        var partes2 = rowData[5] ? rowData[5].split('/') : null;
        var partes3 = rowData[6] ? rowData[6].split('/') : null;

        var fechaComoDateinicio = partes ? new Date(`${partes[2]}-${partes[1]}-${partes[0]}`) : null;
        var fechaComoDatefinal = partes2 ? new Date(`${partes2[2]}-${partes2[1]}-${partes2[0]}`) : null;
        var fechaComoDatefinal2 = partes3 ? new Date(`${partes3[2]}-${partes3[1]}-${partes3[0]}`) : null;

        var fechainiciostring = fechaComoDateinicio ? fechaComoDateinicio.toISOString().split('T')[0] : '';
        var fechafinstring = fechaComoDatefinal ? fechaComoDatefinal.toISOString().split('T')[0] : '';
        var fechastring = fechaComoDatefinal2 ? fechaComoDatefinal2.toISOString().split('T')[0] : '';

        fechavisita1.value = fechainiciostring;
        fechavisita2.value = fechafinstring;
        fechavisita3.value = fechastring;

        mostrarobservaciones(codigoFichaSeleccionada, numeroDocumentoSeleccionado);
    });
});