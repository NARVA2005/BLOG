import { Comentarios } from "../models/comentarios.js";

// Crear comentario
export const crearComentario = async (req, res) => {
    try {
        const { Usuarios_idUsuarios } = req.params; // Asegúrate de que Usuarios_idUsuarios esté en los parámetros de la URL
        console.log(Usuarios_idUsuarios); // Para verificar que se obtiene correctamente

        const { Contenido, fechaComentario, Entradas_idEntradas } = req.body;
console.log(fechaComentario);
        if (!Contenido || !fechaComentario || !Entradas_idEntradas || !Usuarios_idUsuarios) {
            return res.status(400).json({ error: "Faltan campos por llenar" });
        }

        // Crear el nuevo comentario en la base de datos
        const nuevoComentario = await Comentarios.create({
            Contenido,
            fechaComentario,
            Usuarios_idUsuarios, // Asegúrate de incluir este campo
            Entradas_idEntradas
        });

        console.log('Comentario creado:', nuevoComentario);

        return res.status(200).json({ message: "Comentario creado correctamente" });
    } catch (error) {
        console.error("Error al insertar en la base de datos", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};


//Editamos el comentario 


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


//Eliminar comentario 
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

//Traer todos los comentarios

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
