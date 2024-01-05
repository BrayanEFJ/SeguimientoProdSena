//Variables para un futuro uso
let selInstru;
let selEstado;
let selFicha;

//funcion para que el cbonombre cambie al nombre que se selecciono
function seleccionarInstructor(NombreIns) {
    document.getElementById('CboInstructores').innerText = `${NombreIns}`
    selInstru = NombreIns;
}
//funcion para que el cboestado cambie al nombre que se selecciono
function seleccionarEstado(Estado) {
    document.getElementById('CboEstado').innerText = `${Estado}`
    selEstado = Estado;
}
//funcion ára que el cbo de las fichas (Segundo modulo) cambie al nombre que se selecciono
function seleccionarFichapen(Ficha) {
    document.getElementById('Cboficha').innerText = `${Ficha}`
    selFicha = Ficha;
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
    window.location.href = "IndexSena.aspx";
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
    setTimeout(function () {
        initializeDataTable('tablareg');
    }, 400);
});

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

    // Obtener radio buttons
    var radio1 = document.getElementById('radio1');
    var radio2 = document.getElementById('radio2');

    // Agregar evento de cambio a los radio buttons
    radio1.addEventListener('click', function () {
        if (radio1.checked) {
            cambiarColumnas(columnasPorAsignar);
            mostrarfichassinasignacion();
            // Puedes agregar aquí la lógica para mostrar los datos correspondientes
        }
    });

    radio2.addEventListener('click', function () {
        if (radio2.checked) {
            cambiarColumnas(columnasYaAsignadas);
            mostrarfichasasignadas();
            // Puedes agregar aquí la lógica para mostrar los datos correspondientes
        }
    });

    mostrarfichassinasignacion();
   
});

function formatearFecha(fecha) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', options);
    return fechaFormateada;
}

function mostrarfichassinasignacion() {
    
    fetch('https://SeguimientoSena.somee.com/Fichas/TraerFichas')
        .then(response => response.json())
        .then(data => {

            // Obtener la tabla body
            var tablaBody = document.getElementById('tablaBody');

            // Función para formatear la fecha
            
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
            } else {
                console.error('La respuesta de la API está vacía o no es válida.');
            }
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
}

//modificar esta funcion, el fetch esta mal y hay quye corregirlo tambien en la api

function mostraraprendicesfichas() {
    const codigodefichabuscar = document.getElementById("Codfichasearchseg").value;
    const apiUrl = `https://SeguimientoSena.somee.com/Seguimientodto/TraerinformacionAprendices/${codigodefichabuscar}`

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Obtener la tabla body
            var tablaBody = document.getElementById('tablabodyfichasandaprend');
           
            const tablaFichas = $('#tablafichasunicas').DataTable();
            if (tablaFichas) {
                tablaFichas.destroy(); 
            }
            
            // Verificar si los datos están presentes y no son nulos
            if (data && data.length > 0) {
                tablaBody.innerHTML = '';

                // Iterar sobre los datos y agregar filas a la tabla
                data.forEach(item => {
                    var row = tablaBody.insertRow();
                    // codigoficha, numerodedocuemnto, apellidos, nombres, visita1, visita2, visist3
                    row.insertCell(0).textContent = item.codigoFicha || '';
                    row.insertCell(1).textContent = item.numeroDocumentoAprendiz || '';
                    row.insertCell(2).textContent = item.apellidosAprendiz || '';
                    row.insertCell(3).textContent = item.nombresAprendiz || '';
                    row.insertCell(4).textContent = formatearFecha(item.visita1Seguimiento) || '';
                    row.insertCell(5).textContent = formatearFecha(item.visita2Seguimiento) || '';
                    row.insertCell(6).textContent = formatearFecha(item.visita3Seguimiento) || '';
                });

                // Destruir la instancia DataTable existente (si existe

                // Inicializar DataTable
                initializeDataTable('tablafichasunicas');
            } else {
                console.error('La respuesta de la API está vacía o no es válida.');
                alert("Esta ficha no tiene información actual sobre seguimientos");
                tablaBody.innerHTML = 'Null data.';
                // codigoficha, numerodedocuemnto, apellidos, nombres, visita1, visita2, visist3
            }
        })
        .catch(error => console.error('Error al obtener datos de la API:', error));
}

document.addEventListener("DOMContentLoaded", function () {
    // Muestra el primer div por defecto
    mostrarDiv('c1');

    //queda pendiente traer la variable de nombre (intentos fallidos)

});
