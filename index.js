import express from 'express';
import cors from 'cors';
import { sequelize } from './models/baseDatos.js'; 
import usuarioruta from './routes/usuarioruta.js'; 
import comentarioruta from './routes/comentarioruta.js';
import entradasruta from "./routes/entradasruta.js";
import login from "./routes/login.js";
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Configura una ruta estática para servir archivos desde la carpeta 'upload/Publicacion'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicacionPath = path.resolve(__dirname, 'upload/Publicacion');
console.log('Ruta de publicaciones:', publicacionPath); // Para verificar la ruta

app.use('/img', express.static(publicacionPath));

// Rutas de los routes
app.use("/usuarios", usuarioruta);
app.use("/comentarios", comentarioruta);
app.use("/entradas", entradasruta);
app.use("/login", login);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Modelos sincronizados");
  })
  .catch((error) => {
    console.log("Error al sincronizar los modelos", error);
  });
