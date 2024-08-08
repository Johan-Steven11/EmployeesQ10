using EmployeeManagement.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EmployeeManagement.Controllers
{
    public class EmployeeController : Controller
    {
        // Conexión a la base de datos utilizando el contexto de la entidad EmployeesEntities
        EmployeesEntities entities = new EmployeesEntities();

        // Método para listar todos los empleados de la base de datos
        public ActionResult GetEmp()
        {
            entities.Configuration.ProxyCreationEnabled = false;  // Deshabilita la creación de proxies para evitar problemas de serialización

            var getInfo = (from q in entities.Employees select q).ToList();  // Consulta para obtener todos los empleados
            if (getInfo.Count > 0)
            {
                return Json(new { success = true, getInfo }, JsonRequestBehavior.AllowGet);  // Retorna los empleados si existen
            }
            else
            {
                return Json(new { success = true, message = "No se encontraron Datos" }, JsonRequestBehavior.AllowGet);  // Mensaje si no se encuentran empleados
            }
        }

        [HttpGet]
        public ActionResult AddOrEdit(int id = 0)
        {
            return View();  // Retorna la vista para agregar o editar un empleado (formulario vacío o precargado)
        }

        // Método para agregar o editar empleados
        [HttpPost]
        public ActionResult AddOrEdit(Employees model)
        {
            entities.Configuration.ProxyCreationEnabled = false;  // Deshabilita la creación de proxies
            string message = string.Empty;

            if (ModelState.IsValid)
            {
                // Verifica si el empleado ya existe en la base de datos
                var check = (from q in entities.Employees where q.ID == model.ID select q).FirstOrDefault();
                if (check != null)
                {
                    // Si el empleado existe, se actualizan sus datos
                    check.Nombre = model.Nombre;
                    check.Position = model.Position;
                    check.Office = model.Office;
                    check.Salary = model.Salary;
                    entities.Entry(check).State = EntityState.Modified;
                    entities.SaveChanges();

                    return Json(new { Exceptions = "Update", success = true, message = "Se actualizó un empleado" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    // Si el empleado no existe, se agrega uno nuevo
                    Employees obj = new Employees();
                    obj = model;
                    entities.Employees.Add(obj);
                    entities.SaveChanges();
                    return Json(new { Exceptions = "Add", success = true, message = "Empleado Agregado" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json(new { success = false, message = "Por favor llena todos los espacios" }, JsonRequestBehavior.AllowGet);  // Mensaje de error si la validación del modelo falla
        }

        // Método para obtener la información de un empleado por su ID
        public ActionResult GetEmployeeById(int Emp_id = 0)
        {
            entities.Configuration.ProxyCreationEnabled = false;  // Deshabilita la creación de proxies
            var checkExist = (from q in entities.Employees where q.ID == Emp_id select q).FirstOrDefault();
            if (checkExist != null)
            {
                return Json(checkExist, JsonRequestBehavior.AllowGet);  // Retorna los datos del empleado si existe
            }
            else
            {
                return Json("No se encontraron datos", JsonRequestBehavior.AllowGet);  // Mensaje si no se encuentra el empleado
            }
        }

        // Método para eliminar un empleado por su ID
        public ActionResult DeleteEmployee(int empID)
        {
            var checkInfo = (from q in entities.Employees where q.ID == empID select q).FirstOrDefault();

            if (checkInfo != null)
            {
                // Intenta eliminar el empleado
                try
                {
                    entities.Entry(checkInfo).State = EntityState.Deleted;
                    entities.SaveChanges();
                    return Json(new { success = true, message = "Un empleado fue eliminado" }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception e)
                {
                    return Json(new { Exceptions = "Error", success = true, message = "Error: " + e.Message }, JsonRequestBehavior.AllowGet);  // Retorna un mensaje de error si la eliminación falla
                }
            }
            else
            {
                return Json(new { Exceptions = "Error", success = false, message = "Error" }, JsonRequestBehavior.AllowGet);  // Mensaje si no se encuentra el empleado a eliminar
            }
        }

        // Método de acción para mostrar la vista principal
        public ActionResult Index()
        {
            return View();  // Retorna la vista de índice
        }
    }
}
