import { Usuarios } from "../models/usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Inicia sesión un usuario en la aplicación.
 * 
 * @async
 * @function loginUsuario
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - Cuerpo de la solicitud HTTP.
 * @param {string} req.body.email - Correo electrónico del usuario.
 * @param {string} req.body.password - Contraseña del usuario.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Retorna una respuesta HTTP con el estado del inicio de sesión o un mensaje de error.
 * 
 * @throws {Error} Si ocurre un error durante el inicio de sesión del usuario.
 */
export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son requeridos" });
        }

        // Buscar al usuario en la base de datos
        const usuario = await Usuarios.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar la contraseña proporcionada contra la contraseña almacenada
        const isMatch = bcrypt.compareSync(password, usuario.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Generar un token JWT para el usuario autenticado
        const token = jwt.sign(
            { id: usuario.idUsuarios, role: usuario.role }, // Incluye más datos en el token si lo deseas
            process.env.JWT_SECRET || 'NARVA123', // Clave secreta para firmar el token (debe estar en variables de entorno en producción)
            { expiresIn: '1h' } // Ajusta el tiempo de expiración según tus necesidades
        );

        // Enviar respuesta con token y userId
        res.status(200).json({
            token: token,
            userId: usuario.idUsuarios,
            userRole: usuario.role
        });
    } catch (error) {
        console.error("Error al iniciar sesión", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
