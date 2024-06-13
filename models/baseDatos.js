/* import { Sequelize } from "sequelize"; */
const mysql=require('mysql2');
/* export const sequelize = new Sequelize("bd_blog", "root", "",{
    host:"localhost",
    dialect:"mysql"
}); */
const conexion=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    databases:process.env.DB_NAME,
})
conexion.connect((error)=>{
    if(error){
console.log(error);
    }else{
console.log('Conexion exitosa de la base de datos');
    }
})
/* sequelize.authenticate().
then(()=>{
    console.log("Conexion exitosa de la base de datos");
})
.catch((error)=>{
console.log("Error al conectar con la base de datos", error);
}); */