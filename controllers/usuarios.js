import { Usuarios } from "../models/usuarios.js";
import bcrypt from "bcrypt";
//Crear Usuarios
export const crearUsuario = async (req, res) => {
    try {
        const { identificacion, nombre, email, password, estado} = req.body;

        // Encriptar la contraseña con una sal única
        const hashedPassword = bcrypt.hashSync(password, 10);

        if (!identificacion || !nombre || !email || !password || !estado) {
            return res.status(400).json({ error: "Faltan campos por llenar" });
        }

        // Crear el nuevo usuario en la base de datos
        const nuevoUsuario = await Usuarios.create({
            identificacion,
            nombre,
            email,
            password: hashedPassword,
            estado
        });

        return res.status(200).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        console.error("Error al insertar en la base de datos", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};


//Editamos el usaurio
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
                    identificacion: identificacion
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

//Editamos el estado
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

//Traer usuario por id
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