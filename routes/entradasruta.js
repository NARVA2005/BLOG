import express from 'express';
//importamos las funciones que hay desde los controladores
import { crearPublicacion,editarPublicacion, desactivarPublicacion, TraerTodasEntradas, TraerPorTitulos} from '../controllers/entradas.js';
const router =express.Router();

//Rutas del servidor
router.post('/', crearPublicacion);
router.put('/editar/:idEntradas', editarPublicacion);
router.put('/editarEstado/:idEntradas', desactivarPublicacion);
router.get('/TraerTodos', TraerTodasEntradas);
router.get('/TraerEntradaTitulo/:Titulos', TraerPorTitulos);

export default router;