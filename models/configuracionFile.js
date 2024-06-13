import fs from 'fs';

const borrarArchivo = (nameFile, route) => {
  fs.unlink(`./upload/${route}/${nameFile}`, (error) => {
    if (error) {
      console.error(`Error al borrar el archivo: ${error.message}`);
    } else {
      console.log('Archivo borrado');
    }
  });
};

export default borrarArchivo;
