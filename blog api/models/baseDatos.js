import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("bd_blog", "root", "",{
    host:"localhost",
    dialect:"mysql"
});

sequelize.authenticate().
then(()=>{
    console.log("Conexion exitosa de la base de datos");
})
.catch((error)=>{
console.log("Error al conectar con la base de datos", error);
});