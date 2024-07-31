import express from "express";

//importamos las funciones que hay desde los controladores
import { EliminarComentario, crearComentario, editarComentario,traerTodosComentario, traerTodosComentarioID } from "../controllers/comentarios.js";
const router = express.Router();

//Rutas del servidor
router.post("/",crearComentario);
router.post("/editarComentario/:idComentarios",editarComentario);
router.delete("/eliminarComentario/:idComentarios", EliminarComentario);
router.get("/TraerTodos", traerTodosComentario);
router.get("/TraerTodosID/:id", traerTodosComentarioID);

export default router;