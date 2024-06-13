import { Entradas } from "../models/entradas.js";
import multer from "multer";
import fs from "fs";
import eliminarFile from "../models/configuracionFile.js";

// Configuración del multer para manejar cargas de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = './upload/Publicacion/';
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: (req, file, cb) => {
    
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('imagen'); //Un solo archivo

// Crear las entradas o publicaciones
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

            const { Titulos, Contenido, fechaPublicacion } = req.body;
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
                fechaPublicacion,
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


// Editar la publicación
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

//Eliminamos la publicacion


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

//Trae todas las publicaciones

export const TraerTodasEntradas=async(req, res)=>{
try {
 
    const TraerTodos=await Entradas.findAll({
where:{
    estado:'activo'
}
    })
/* console.log(TraerTodos); */

if(TraerTodos.length>0){
    res.status(200).json(TraerTodos);
}else{
res.status(400).json({message:"No se encontraron comentarios datos"});
}
} catch (error) {
    console.log(error, "Error al traer todas las publicaciones")
}
}
//Trae todas las publicaciones

export const TraerTodasID=async(req, res)=>{
    try {
        const{idEntradas}=req.params;
     
        const TraerTodosid=await Entradas.findAll({
    where:{
        idEntradas:idEntradas
    }
        })
        if(TraerTodosid.length>0){
            res.status(200).json(TraerTodosid);
        }else{
            res.status(200).json({message:"No hay comentarios con ese id"});
        }
    /* console.log(TraerTodos); */
 
    
    } catch (error) {
        console.log(error, "Error al traer todas las publicaciones")
    }
    }