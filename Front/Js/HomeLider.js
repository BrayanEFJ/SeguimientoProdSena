//Variables para un futuro uso
let selInstru;
let selEstado;
let selFicha;

//funcion para que el cbonombre cambie al nombre que se selecciono
function seleccionarInstructor(NombreIns, NumeroDocumento,) {
    document.getElementById('CboInstructores').innerText = `${NumeroDocumento}`
    document.getElementById('NombreInstructor').value = `${NombreIns}`
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







function formatearFecha(fecha) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', options);
    return fechaFormateada;
}

function mostrarfichassinasignacion() {

        const startTime = performance.now();

        fetch('https://SeguimientoSena.somee.com/Fichas/TraerFichas')
            .then(response => response.json())
            .then(data => {

                const elapsedTime = performance.now() - startTime;

                // Mostrar el tiempo en la consola

                setTimeout(() => {
                    alert(`Tiempo transcurrido: ${elapsedTime} milisegundos`);
                }, 300);

                const tablaFichas = $('#tablareg').DataTable();
                if (tablaFichas) {
                    tablaFichas.destroy();
                }
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



function MostrarNombreInstructores() {
    const comboElement = document.getElementById('CboInstructores');

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
                            seleccionarInstructor(item.nombresInstructor,item.numeroDocumentoInstructor);
                        };

                        comboElement.nextElementSibling.appendChild(optionElement);
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
    document.getElementById('InicioAsignacion').min = today;

    const inicioCalendario = document.getElementById('InicioAsignacion');
    const finCalendario = document.getElementById('FinAsignacion');

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
            const fechaFin = new Date(finCalendario.value);

            fechaInicio.setDate(fechaInicio.getDate() + 1);

            // Actualizar el valor del calendario de fin
            finCalendario.value = fechaInicio.toISOString().split('T')[0];
        }
    });
    
}

function cambiarBotones() {
    var radioAsignar = document.getElementById('radio1');
    var btnAsignar = document.getElementById('btnasignar');
    var btnmodasignacion = document.getElementById('btnmodasignacion');
    var btnGuardarCambios = document.getElementById('btnguardarcambios');

    // Restablecer la visibilidad de los botones
    btnAsignar.style.display = 'none';
    btnmodasignacion.style.display = 'none';
    btnGuardarCambios.style.display = 'none';

    // Determinar la visibilidad según la selección del combo y del radio button
    if (radioAsignar.checked) {
        btnAsignar.style.display = 'block';
    } else {
        btnGuardarCambios.style.display = 'block';
        btnmodasignacion.style.display = 'block';
    }
}



// Función que devuelve una promesa que se resuelve después de ejecutar mostrarDiv('c1')
function mostrarDivAsync() {
    return new Promise(resolve => {
        mostrarDiv('c1');
        resolve();
    });
}

// Función que devuelve una promesa que se resuelve después de ejecutar MostrarNombreInstructores
function mostrarNombreInstructoresAsync() {
    return new Promise(resolve => {
        MostrarNombreInstructores();
        resolve();
    });
}

// Función que devuelve una promesa que se resuelve después de ejecutar Parafechas
function parafechasAsync() {
    return new Promise(resolve => {
        Parafechas();
        resolve();
    });
}

// Función que devuelve una promesa que se resuelve después de ejecutar cambiarBotones
function cambiarBotonesAsync() {
    return new Promise(resolve => {
        cambiarBotones();
        resolve();
    });
}

// Función principal asincrónica que ejecuta todas las funciones secuencialmente
async function ejecutarTodasLasFunciones() {
    await mostrarDivAsync();
    await mostrarNombreInstructoresAsync();
    await parafechasAsync();
    await cambiarBotonesAsync();

    // Después de que todas las funciones anteriores se completen, ejecutar initializeDataTable
    
}

// Llamar a la función principal



document.addEventListener("DOMContentLoaded", function () {
    // Muestra el primer div por defecto
    ejecutarTodasLasFunciones();
    //Deja como fecha minima para el primer calendario (Hoy)
    
});





    $(document).ready(function () {
        // Agrega un evento de clic a las filas de la tabla
        var radio1 = document.getElementById('radio1');
        
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

                    // Supongamos que rowData[3] es "dd/mm/yyyy"
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




