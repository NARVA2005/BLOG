import { Entradas } from "../models/entradas.js";
import multer from "multer";
import fs from "fs";
import eliminarFile from "../models/configuracionFile.js";



/**
 * Configuración de `multer` para manejar cargas de imágenes.
 * 
 * El almacenamiento se configura para almacenar las imágenes en una carpeta específica
 * y generar nombres de archivos únicos basados en la fecha y el nombre original del archivo.
 * 
 * @constant
 * @type {multer.StorageEngine}
 */

const storage = multer.diskStorage({
      /**
     * Establece el destino donde se almacenarán los archivos.
     * 
     * @function
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} file - Objeto de archivo que contiene información sobre el archivo cargado.
     * @param {function} cb - Callback para indicar la finalización de la configuración del destino.
     */
    destination: (req, file, cb) => {
        const path = './upload/Publicacion/';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
      /**
     * Genera un nombre de archivo único basado en la fecha y el nombre original del archivo.
     * 
     * @function
     * @param {Object} req - Objeto de solicitud HTTP.
     * @param {Object} file - Objeto de archivo que contiene información sobre el archivo cargado.
     * @param {function} cb - Callback para indicar la finalización de la configuración del nombre del archivo.
     */ 
    filename: (req, file, cb) => {
    
        cb(null, Date.now() + '-' + file.originalname);
    }
});
/**
 * Configuración de `multer` para manejar un solo archivo de imagen.
 * 
 * @constant
 * @type {multer.Instance}
 */
const upload = multer({ storage: storage }).single('imagen'); //Un solo archivo


/**
 * Crea una nueva entrada o publicación.
 * 
 * @async
 * @function crearPublicacion
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la creación de la publicación.
 * 
 * @throws {Error} Si ocurre un error durante la carga del archivo o la creación de la publicación.
 */

export const crearPublicacion = async (req, res) => {
    upload(req, res, async (err) => {
        //Verificar que no hayan errores de multer en el sistema            
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(500).json({ message: 'Error al subir el archivo.', error: err.message });
        } else if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Error del servidor.', error: err.message });
        }

        try {
            // Validar y asignar el archivo
            if (req.file) {
                //Condicion para verificar que los archivos ingresados si sean los correctos en la base de datos del sistema
                const condicion = req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg";
                if (condicion) {
                    res.status(400).send({
                        message: ["El archivo ingresado no es el correcto (.png, .jpg o .jpeg)"],
                    });
                    //Se localiza el archivo y lo eliminamos
                 eliminarFile(req.file.filename, "Publicacion"); 
                    return;
                }
                req.body.imagen = req.file.filename;
            } else {
              delete req.body.imagen;
            }

            const { Titulos, Contenido, fechaPublicacion} = req.body;
            console.log(Titulos, Contenido, fechaPublicacion); 

            if (!Titulos || !Contenido || !fechaPublicacion) {
                res.status(400).send({
                    message: "Todos los campos son obligatorios",
                });
                if (req.file) {
                    eliminarFile(req.file.filename, "Publicacion");
                }
                return;
            }

            const nuevaPublicacion = await Entradas.create({
                Titulos,
                Contenido,
                fechaPublicacion:new Date().toISOString().split('T')[0],
                imagen: req.body.imagen,
    
            });

            // Devolver la publicación
        // Devolver la publicación
      res.status(200).json({ message: "Publicación creada correctamente", data: nuevaPublicacion });
        } catch (error) {
            if (req.file) {
                eliminarFile(req.file.filename, "Publicacion");
            }
            console.error('Error al crear la publicación:', error);
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                res.status(400).json({ message: validationErrors });
            } else {
                res.status(500).json({ message: [error.message] });
            }
        }
    });
};



/**
 * Edita una publicación existente.
 * 
 * @async
 * @function editarPublicacion
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.idEntradas - ID de la entrada a editar.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {string} req.body.Titulos - Título de la publicación.
 * @param {string} req.body.Contenido - Contenido de la publicación.
 * @param {string} req.body.fechaPublicacion - Fecha de la publicación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la edición de la publicación.
 * 
 * @throws {Error} Si ocurre un error durante la carga del archivo o la edición de la publicación.
 */

export const editarPublicacion = async (req, res) => {
    const { idEntradas } = req.params;
    upload(req, res, async (err) => {
        //Verificar que no hayan errores de multer en el sistema            
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(500).json({ message: 'Error al subir el archivo.', error: err.message });
        } else if (err) {
            console.error('Error:', err);
            return res.status(500).json({ message: 'Error del servidor.', error: err.message });
        }

        try {
            if (req.file) {
                const condicion = req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg";
                if (condicion) {
                    res.status(400).send({ message: ["El archivo ingresado no es el correcto (.png, .jpg o .jpeg)"] });
                    eliminarFile(req.file.filename, "Publicacion");
                    return;
                }
                req.body.imagen = req.file.filename;
            } else {
                req.body.imagen = "";
            }

            const { Titulos, Contenido, fechaPublicacion } = req.body;
         

            if (!Titulos || !Contenido || !fechaPublicacion) {
                res.status(400).send({ message: "Todos los campos son obligatorios" });
                if (req.file) {
                    eliminarFile(req.file.filename, "Publicacion");
                }
                return;
            }

            const actualizar = await Entradas.update({
                Titulos,
                Contenido,
                fechaPublicacion,
                imagen: req.body.imagen,
            }, {
                where: { idEntradas: idEntradas }
            });

            res.status(200).json({ message: "Publicación actualizada correctamente", data: actualizar });
        } catch (error) {
            if (req.file) {
                eliminarFile(req.file.filename, "Publicacion");
            }
            console.error('Error al actualizar la publicación:', error);
            if (error.name === "SequelizeValidationError") {
                const validationErrors = error.errors.map((err) => err.message);
                res.status(400).json({ message: validationErrors });
            } else {
                res.status(500).json({ message: [error.message] });
            }
        }
    });
};

/**
 * Desactiva una publicación existente.
 * 
 * @async
 * @function desactivarPublicacion
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.idEntradas - ID de la entrada a desactivar.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {boolean} req.body.estado - Nuevo estado de la publicación.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la desactivación de la publicación.
 * 
 * @throws {Error} Si ocurre un error durante la desactivación de la publicación.
 */

export const desactivarPublicacion= async(req, res)=>{
    try {
        const{idEntradas}=req.params;
        const{estado}=req.body;
    
        const [entradaDesabilitar] = await Entradas.update(
            {
            estado:estado
        },{     
            where:
            {idEntradas:idEntradas}
        });
        if(entradaDesabilitar){
    res.status(200).json({message: "Publicacion o entrada eliminada"});
        }else{
            res.status(401).json({message:"Publicacion no eliminada"});
        }
    } catch (error) {
        console.log(error,"publicacion no modificado, por el servidor");
    }
  
}

/**
 * Trae todas las publicaciones activas de la base de datos.
 * 
 * @async
 * @function TraerTodasEntradas
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con todas las publicaciones activas encontradas o un mensaje de error.
 * 
 * @throws {Error} Si ocurre un error al obtener las publicaciones de la base de datos.
 */

export const TraerTodasEntradas = async (req, res) => {
    try {
      const TraerTodos = await Entradas.findAll({
        where: {
          estado: 'activo'
        }
      });
  
      console.log('Entradas:', TraerTodos); // Agrega este log
  
      if (TraerTodos.length > 0) {
        res.status(200).json(TraerTodos);
      } else {
        res.status(400).json({ message: "No se encontraron datos" });
      }
    } catch (error) {
      console.log(error, "Error al traer todas las publicaciones");
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
/**
 * Trae todas las publicaciones con un ID específico.
 * 
 * @async
 * @function TraerTodasID
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.Titulos - ID de la entrada a buscar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con las publicaciones encontradas o un mensaje de error.
 * 
 * @throws {Error} Si ocurre un error al obtener las publicaciones de la base de datos.
 */

export const TraerPorTitulos = async (req, res) => {
    try {
      const { Titulos } = req.params;
      console.log('Titulos:', Titulos); // Verifica que el parámetro está siendo recibido
      const TraerTodosid = await Entradas.findAll({
        where: {
          Titulos: Titulos
        }
      });
  
      if (TraerTodosid.length > 0) {
        res.status(200).json(TraerTodosid);
      } else {
        res.status(200).json({ message: "No hay Publicaciones con ese Titulo" });
      }
  
    } catch (error) {
      console.log(error, "Error al traer todas las publicaciones");
      res.status(500).json({ message: "Error al traer las publicaciones" });
    }
  };


  export const TraerPorId = async (req, res) => {
    try {
      const { id } = req.params;
 
      const TraerTodosid = await Entradas.findAll({
        where: {
          idEntradas: id
        }
      });
  
      if (TraerTodosid.length > 0) {
        res.status(200).json(TraerTodosid);
      } else {
        res.status(200).json({ message: "No hay Publicaciones con ese id" });
      }
  
    } catch (error) {
      console.log(error, "Error al traer todas las publicaciones");
      res.status(500).json({ message: "Error al traer las publicaciones" });
    }
  };