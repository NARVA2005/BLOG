import { Comentarios } from "../models/comentarios.js";
import { Usuarios } from "../models/usuarios.js";
/**
 * Crea un nuevo comentario en la base de datos.
 * 
 * @async
 * @function crearComentario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.Usuarios_idUsuarios - ID del usuario que realiza el comentario.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {string} req.body.Contenido - Contenido del comentario.
 * @param {string} req.body.fechaComentario - Fecha del comentario.
 * @param {string} req.body.Entradas_idEntradas - ID de la entrada a la que se refiere el comentario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la creación del comentario.
 * 
 * @throws {Error} Si ocurre un error al insertar en la base de datos.
 */

export const crearComentario = async (req, res) => {
    try {
        const { Contenido, fechaComentario, Usuarios_idUsuarios, Entradas_idEntradas } = req.body;

      
    console.log('Datos recibidos:', req.body); // Verifica los datos recibidos
        if (!Contenido || !fechaComentario || !Usuarios_idUsuarios || !Entradas_idEntradas) {
            return res.status(400).json({ error: "Faltan campos por llenar" });
        }

        // Agregar el comentario en la base de datos
        const nuevoComentario = await Comentarios.create({
            Contenido: Contenido,
            fechaComentario: new Date().toISOString().split('T')[0],
            Usuarios_idUsuarios,
            Entradas_idEntradas
        });

        return res.status(200).json({ message: "Comentario agregado correctamente" });
    } catch (error) {
        console.error("Error al agregar comentario:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};


/**
 * Edita un comentario existente en la base de datos.
 * 
 * @async
 * @function editarComentario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.idComentarios - ID del comentario a editar.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {string} req.body.Contenido - Contenido del comentario.
 * @param {string} req.body.fechaComentario - Fecha del comentario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la edición del comentario.
 * 
 * @throws {Error} Si ocurre un error al actualizar en la base de datos.
 */


export const editarComentario = async (req, res) => {
    try {
        const { idComentarios } = req.params;
        const { Contenido, fechaComentario} = req.body;
      
        if ( !Contenido || !fechaComentario) {
            return res.status(400).json({ error: "Ingrese todos los campos" });
  
        }

        // Actualizar el usuario con el identificador proporcionado
        const [updated] = await Comentarios.update(
            {
               Contenido,
               fechaComentario
            },
            {
                where: {
                    idComentarios: idComentarios
                }
            }
        );

        // Verificar si el usuario fue actualizado
        if (updated) {
            res.status(200).json({ message: "Comentario  editado correctamente" });
        } else {
            res.status(404).json({ error: "Comentario no encontrado" });
        }
    } catch (error) {
        console.error("Comentario no editado correctamente", error);
        res.status(500).json({ error: "Error del servidor" });
    }
};



/**
 * Elimina un comentario existente en la base de datos.
 * 
 * @async
 * @function EliminarComentario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.idComentarios - ID del comentario a eliminar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la eliminación del comentario.
 * 
 * @throws {Error} Si ocurre un error al eliminar en la base de datos.
 */

    export const EliminarComentario = async (req, res) => {
        try {
            const { idComentarios } = req.params;
        
        

            // Actualizar el usuario con el identificador proporcionado
            const filasEliminadas = await Comentarios.destroy(
            
                {
                    where: {
                        idComentarios: idComentarios
                    }
                }
            );

            // Verificar si el usuario fue actualizado
            if (filasEliminadas>0) {
                res.status(200).json({ message: "Comentario  eliminado correctamente" });
            } else {
                res.status(404).json({ error: "Comentario no encontrado" });
            }
        } catch (error) {
            console.error("Comentario no eliminado correctamente", error);
            res.status(500).json({ error: "Error del servidor" });
        }
    };

/**
 * Trae todos los comentarios de la base de datos.
 * 
 * @async
 * @function traerTodosComentario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con todos los comentarios encontrados o un mensaje de error.
 * 
 * @throws {Error} Si ocurre un error al obtener los comentarios de la base de datos.
 */

export const traerTodosComentario=async(req, res)=>{
    try {
        const traerTodo=await Comentarios.findAll()
        
            if(traerTodo.length>0){  
                 res.status(200).json(traerTodo);}
            else{
                res.status(400).json({message:"No se encontraron comentarios disponibles"});
            }
    } catch (error) {
        console.error("Comentario no eliminado correctamente", error);
        res.status(500).json({ error: "Error del servidor" });
    }
} 



/**
 * Trae todos los comentarios de la base de datos por id de entrada.
 * 
 * @async
 * @function traerTodosComentarioID
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con  los comentarios encontrados por entrada o un mensaje de error.
 * 
 * @throws {Error} Si ocurre un error al obtener los comentarios de la entrada en la base de datos.
 */

Comentarios.belongsTo(Usuarios, { foreignKey: 'Usuarios_idUsuarios' });

export const traerTodosComentarioID = async (req, res) => {
  const { id } = req.params;

  try {
    const traerTodo = await Comentarios.findAll({
      where: { Entradas_idEntradas: id },
      include: [{
        model: Usuarios,
        attributes: ['nombre'] // Solo traer el nombre del usuario
      }]
    });

    if (traerTodo.length > 0) {
      res.status(200).json(traerTodo);
    } else {
      res.status(400).json({ message: "No se encontraron comentarios disponibles" });
    }
  } catch (error) {
    console.error("Error al traer los comentarios", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
  