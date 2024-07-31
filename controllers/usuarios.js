import { Usuarios } from "../models/usuarios.js";
import bcrypt from "bcrypt";


/**
 * Crea un nuevo usuario en la base de datos.
 * 
 * @async
 * @function crearUsuario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {string} req.body.identificacion - Identificación del usuario.
 * @param {string} req.body.nombre - Nombre del usuario.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {boolean} req.body.estado - Estado del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la creación del usuario.
 * 
 * @throws {Error} Si ocurre un error durante la creación del usuario.
 */

export const crearUsuario = async (req, res) => {
    try {
        const { identificacion, nombre, email, password } = req.body;

        if (!identificacion || !nombre || !email || !password) {
            return res.status(400).json({ error: "Faltan campos por llenar" });
        }

        // Verificar si el correo electrónico o la identificación ya existen en la base de datos
        const usuarioExistente = await Usuarios.findOne({ where: { email } });
        const identificacionExistente = await Usuarios.findOne({ where: { identificacion } });

        if (usuarioExistente) {
            return res.status(400).json({ error: "El correo electrónico ya está registrado" });
        }

        if (identificacionExistente) {
            return res.status(400).json({ error: "La identificación ya está registrada" });
        }

        // Encriptar la contraseña con una sal única
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Crear el nuevo usuario en la base de datos
        const nuevoUsuario = await Usuarios.create({
            identificacion,
            nombre,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error al insertar en la base de datos", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

/**
 * Edita un usuario existente.
 * 
 * @async
 * @function editarUsuario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.identificacion - Identificación del usuario a editar.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {string} req.body.nombre - Nuevo nombre del usuario.
 * @param {string} req.body.email - Nuevo correo electrónico del usuario.
 * @param {string} req.body.password - Nueva contraseña del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la edición del usuario.
 * 
 * @throws {Error} Si ocurre un error durante la edición del usuario.
 */

export const editarUsuario = async (req, res) => {
    try {
        const { identificacion } = req.params;
        const { nombre, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        // Validar que todos los campos requeridos están presentes
        if ( !nombre || !email || !password) {
            return res.status(400).json({ error: "Ingrese todos los campos" });
  
        }

        // Actualizar el usuario con el identificador proporcionado
        const [updated] = await Usuarios.update(
            {
                nombre,
                email,
                password:hashedPassword,
            },
            {
                where: {
                    idUsuarios: identificacion
                }
            }
        );

        // Verificar si el usuario fue actualizado
        if (updated) {
            res.status(200).json({ message: "Usuario editado correctamente" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Usuario no editado correctamente", error);
        res.status(500).json({ error: "Error del servidor" });
    }
};

/**
 * Desactiva un usuario cambiando su estado.
 * 
 * @async
 * @function desactivarUsuario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.identificacion - Identificación del usuario a desactivar.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {boolean} req.body.estado - Nuevo estado del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado de la desactivación del usuario.
 * 
 * @throws {Error} Si ocurre un error durante la actualización del estado del usuario.
 */

export const desactivarUsuario=async(req, res)=>{
    try {
        const {identificacion}=req.params;
        const {estado}=req.body;
        const [UsuarioDelete]=await Usuarios.update(
            {
estado:estado
},{

    where:{
        identificacion:identificacion
                    }
                
}
       
        );
        if(UsuarioDelete){
res.status(200).json({message:"Usuario desactivado"});
        }else{

            res.status(400).json({error:"Error al actualzar el estado"});
        }
    } catch (error) {
        console.error("Usuario no modificado correctamente", error);
        res.status(500).json({ error: "Error del servidor" });

    }
}


/**
 * Trae todos los usuarios almacenados en la base de datos.
 * 
 * @async
 * @function TraerUsuarios
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con todos los usuarios encontrados o un mensaje de error si no hay usuarios.
 * 
 * @throws {Error} Si ocurre un error al obtener los usuarios de la base de datos.
 */

export const TraerUsuarios=async(req, res)=>{
    try {
        const TraerTodos=await Usuarios.findAll();
        if(TraerTodos.length>0){
            res.status(200).json(TraerTodos);
        }else{
            res.status(400).json('No hay Usuarios en la base de datos');
        }
    } catch (error) {
        console.error("Usuario no modificado correctamente", error);
        res.status(500).json({ error: "Error del servidor" });
    }
}


/**
 * Trae un usuario por su ID desde la base de datos.
 * 
 * @async
 * @function TraerUsuarioID
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.params - Parámetros de la solicitud.
 * @param {string} req.params.idUsuarios - ID del usuario a buscar.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el usuario encontrado o un mensaje indicando que no se encontró el usuario.
 * 
 * @throws {Error} Si ocurre un error al obtener el usuario de la base de datos.
 */

export const TraerUsuarioID=async(req, res)=>{
    try {
        const{idUsuarios}=req.params;
        const TraerId=await Usuarios.findAll({
            where:{
                idUsuarios:idUsuarios
            }
        });
        if(TraerId.length>0){
            res.status(200).json(TraerId);
        }else{
res.status().json({message: "No se encontro el usuario con ese ID."})
        }
    } catch (error) {
        console.error("Usuario no encontrado correctamente", error);
        res.status(500).json({ error: "Error del servidor" });
    }
}