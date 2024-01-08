
let selerol;
function seleccionarRol(rol) {
    document.getElementById('dropdownMenuLink').innerText = `${rol}`
    selerol = rol;
}



function Ingresarsistema() {
    const Documento = document.getElementById("Document").value;
    const Password = document.getElementById("Password").value;

    if (selerol === "Coordinador" || selerol === "Lider de seguimiento") {
        const apiUrl = `https://seguimientosena.somee.com/${Documento}/${Password}`;

        
        // Realizar la solicitud utilizando fetch
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud HTTP: ${response.statusText}`);
                }
                // Parsear la respuesta como JSON
                return response.json();
            })
            .then(dataArray => {
                // Verificar si el array tiene al menos un elemento
                if (dataArray && dataArray.length > 0) {
                    // Obtener el primer elemento del array
                    const data = dataArray[0];

                    // Acceder a los campos de la respuesta JSON
                    const { numeroDocumentoAdmin, contraseñaAdmin, apellidosAdmin, nombresAdmin, rolAdmin } = data;


                    

                    const rolUsuario = selerol === "Coordinador" ? "Coordinador" : "Lider de seguimiento";

                    if (rolAdmin === rolUsuario && numeroDocumentoAdmin === Documento && contraseñaAdmin === contraseñaAdmin) {
                        
                        alert(`Has iniciado sesión con éxito ${rolUsuario} ${nombresAdmin} ${apellidosAdmin}`);
                        if (rolAdmin === "Lider de seguimiento") {
                            window.location.href = "HomeLider.html";
                        }
                        else {
                            window.location.href = "HomeCoordinador.html";
                        }
                    } else {
                        alert(`Credenciales incorrectas`);
                    }

                    // Resto del código
                } else {
                    // Si el array está vacío, mostrar un mensaje de error
                    throw new Error('No existe tu usuario o las credenciales son incorrectas');
                }
            })
            .catch(error => {
                // Manejar errores de la solicitud y mostrar en la consola
                alert(`Error en la solicitud, revisa los campos o tu conexion a internet`);
            });
    } else {
        alert("Estoy trabajando en eso");
    } 
}







