// Función para listar los datos de los empleados en la tabla
getEmployeeData()
function getEmployeeData() {
    $.ajax({
        type: "GET", // Tipo de petición HTTP: GET
        url: "/Employee/GetEmp", // URL a la que se hace la petición para obtener los datos de los empleados
        data: {}, // No se envían datos adicionales en esta petición
        success: function (data) { // Función que se ejecuta si la petición es exitosa
            $("#tblBody").empty(); // Limpia el cuerpo de la tabla antes de agregar nuevos datos

            if (data.getInfo.length > 0) { // Verifica si hay empleados en la respuesta
                for (var i = 0; i < data.getInfo.length; i++) { // Itera sobre cada empleado en los datos obtenidos
                    // Agrega una nueva fila a la tabla por cada empleado
                    $("#tblBody").append("<tr>" +
                        "<td>" + data.getInfo[i].ID + "</td>" +
                        "<td>" + data.getInfo[i].Nombre + "</td>" +
                        "<td>" + data.getInfo[i].Position + "</td>" +
                        "<td>" + data.getInfo[i].Office + "</td>" +
                        "<td>" + data.getInfo[i].Salary + "</td>" +
                        "<td>" +
                        "<a href='#' onclick='getEmployeeById(" + data.getInfo[i].ID + ")' class='btn btn-success'>Editar</a>" + // Botón para editar
                        "<a onclick='DeleteEmployee(" + data.getInfo[i].ID + ")' href='#' class='btn btn-danger'>Eliminar</a>" + // Botón para eliminar
                        "</td>" +
                        "</tr>");
                }
            }
        },
        error: function (er) { // Función que se ejecuta si hay un error en la petición
            alert(er); // Muestra un mensaje de alerta con el error
        }
    });
}

// Función para traer la información de un empleado por su ID y mostrarla en el formulario de edición
function getEmployeeById(id) {
    $("#EmployeeForm")[0].reset(); // Resetea el formulario de empleado
    $.ajax({
        type: "POST", // Tipo de petición HTTP: POST
        url: "/Employee/GetEmployeeById", // URL a la que se hace la petición para obtener los datos de un empleado por su ID
        data: {
            Emp_id: id // Envía el ID del empleado como dato
        },
        success: function (data) { // Función que se ejecuta si la petición es exitosa
            // Llena el formulario con los datos del empleado
            $("#Emp_ID").val(data.ID);
            $("#Nombre").val(data.Nombre);
            $("#Position").val(data.Position);
            $("#Office").val(data.Office);
            $("#Salary").val(data.Salary);

            // Actualiza el título del modal con el nombre del empleado
            $("#exampleModalLabl").text("Empleado: " + data.Nombre);
            $("#employeeModal").modal('show'); // Muestra el modal
            $("#btnSaveEmp").addClass('btn-warning'); // Cambia el estilo del botón de guardar a advertencia (amarillo)
            $("#btnSaveEmp").val('Actualizar Empleado'); // Cambia el texto del botón a "Actualizar Empleado"
        },
        error: function (er) { // Función que se ejecuta si hay un error en la petición
            alert(er); // Muestra un mensaje de alerta con el error
        }
    });
}

// Función para eliminar un empleado por su ID
function DeleteEmployee(id) {
    var con = confirm("Desea eliminar este empleado "); // Muestra un cuadro de confirmación al usuario
    if (con == true) { // Si el usuario confirma la eliminación

        // Realiza la petición para eliminar al empleado
        $.ajax({
            type: "POST", // Tipo de petición HTTP: POST
            url: "/Employee/DeleteEmployee", // URL a la que se hace la petición para eliminar al empleado
            data: {
                empID: id // Envía el ID del empleado a eliminar
            },
            success: function (data) { // Función que se ejecuta si la petición es exitosa
                if (data.success == true) { // Si la eliminación fue exitosa
                    if (data.Exceptions == "Error") { // Si hubo algún error durante el proceso
                        alert(data.message); // Muestra el mensaje de error
                    } else {
                        getEmployeeData(); // Vuelve a cargar los datos de la tabla
                        alert(data.message); // Muestra un mensaje indicando que el empleado fue eliminado
                    }

                } else {
                    window.location.reload(); // Si hubo algún problema, recarga la página
                }
            },
            error: function (er) { // Función que se ejecuta si hay un error en la petición
                alert(er); // Muestra un mensaje de alerta con el error
            }
        });
    }
}

// Validar que los inputs del formulario estén diligenciados y enviar los datos
$("#btnSaveEmp").click(function () {
    var oForm = document.forms["EmployeeForm"]; // Obtiene el formulario
    if ($("#EmployeeForm").valid()) { // Verifica si el formulario es válido
        var ajaxConfig = {
            type: "POST", // Tipo de petición HTTP: POST
            url: oForm.action, // URL a la que se envía el formulario
            data: new FormData(oForm), // Datos del formulario que se enviarán
            success: function (data) { // Función que se ejecuta si la petición es exitosa
                if (data.success == true) { // Si la operación fue exitosa
                    if (data.Exceptions == "Exist") { // Si ya existe un empleado con ese nombre
                        $("#Nombre").val("").focus(); // Limpia el campo del nombre y le da foco
                        alert(data.message); // Muestra el mensaje de error
                    } else {
                        getEmployeeData(); // Vuelve a cargar los datos de la tabla
                        alert(data.message); // Muestra un mensaje indicando que la operación fue exitosa
                        $("#employeeModal").modal('hide'); // Oculta el modal
                    }
                } else {
                    alert(data.message); // Muestra un mensaje de error si la operación falló
                }
            },
            error: function (er) { // Función que se ejecuta si hay un error en la petición
                alert(er); // Muestra un mensaje de alerta con el error
            }
        };
        if ($("form").attr('enctype') == "multipart/form-data") { // Verifica si el formulario tiene archivos adjuntos
            ajaxConfig["contentType"] = false;
            ajaxConfig["processData"] = false; // Configura la petición para manejar archivos
        }
        $.ajax(ajaxConfig); // Envía la petición AJAX
        return false; // Evita que el formulario se envíe de manera tradicional
    }
});

// Función para mostrar el modal y el formulario para agregar un nuevo empleado
$("#AddNew").click(function () {
    $("#EmployeeForm")[0].reset(); // Resetea el formulario
    $("Emp_ID").val(0); // Resetea el ID del empleado en el formulario
    $("btnSaveEmp").val("Add Employee"); // Cambia el valor del botón a "Add Employee"
    $("#btnSaveEmp").removeClass("btn-warning"); // Elimina la clase de advertencia (amarillo) del botón
    $(".modal-title").text("Agregar Nuevo Empleado"); // Cambia el título del modal
    $("#employeeModal").modal('show'); // Muestra el modal
    $("#btnSaveEmp").val('Agregar Empleado'); // Cambia el valor del botón a "Agregar Empleado"
    $("#btnSaveEmp").addClass("btn-success"); // Agrega la clase de éxito (verde) al botón
});
