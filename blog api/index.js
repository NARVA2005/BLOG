import express from 'express';
import cors from 'cors';
import { sequelize } from './models/baseDatos.js';
//Rutas
import usuarioruta from './routes/usuarioruta.js';
import comentarioruta from './routes/comentarioruta.js';
import entradasruta from "./routes/entradasruta.js";

const app = express();
require('dotenv').config()

app.use(cors());
app.use(express.json());

//aca van las rutas de los routes
app.use("/usuarios", usuarioruta);
app.use("/comentarios", comentarioruta);
app.use("/entradas", entradasruta);
const port =process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});

sequelize
.sync({ force:false})
.then(()=>{
    console.log("Modelos sincronizados");
})
.catch((error)=>{
    console.log("Error al sincronizar los modelos",error);
});