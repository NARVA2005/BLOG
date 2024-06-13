import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();
// Crear una instancia de Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
    }
  );
  
// Autenticar la conexión
sequelize.authenticate()
    .then(() => {
        console.log("Conexión exitosa a la base de datos");
    })
    .catch((error) => {
        console.error("Error al conectar con la base de datos:", error);
    });

    export { sequelize };
 