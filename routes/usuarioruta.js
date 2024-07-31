import express from "express";

//importamos las funciones que hay desde los controladores
import { crearUsuario, desactivarUsuario, editarUsuario, TraerUsuarios, TraerUsuarioID} from "../controllers/usuarios.js";
const router = express.Router();

//Rutas del servidor
router.post("/",crearUsuario);
router.put("/:identificacion",editarUsuario);
router.put("/editarEstado/:identificacion",desactivarUsuario);
router.get("/traerTodos",TraerUsuarios);
router.get("/traerUsuarioId/:idUsuarios",TraerUsuarioID);


export default router;