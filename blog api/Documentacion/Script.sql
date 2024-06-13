-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bd_blog
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema bd_blog
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bd_blog` DEFAULT CHARACTER SET utf8mb4 ;
USE `bd_blog` ;

-- -----------------------------------------------------
-- Table `bd_blog`.`entradas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_blog`.`entradas` (
  `idEntradas` INT(11) NOT NULL AUTO_INCREMENT,
  `Titulos` VARCHAR(200) NOT NULL,
  `Contenido` VARCHAR(150) NOT NULL,
  `fechaPublicacion` DATE NOT NULL,
  `imagen` VARCHAR(300) NOT NULL,
  PRIMARY KEY (`idEntradas`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bd_blog`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_blog`.`usuarios` (
  `idUsuarios` INT(11) NOT NULL AUTO_INCREMENT,
  `identificacion` VARCHAR(150) NOT NULL,
  `nombre` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(150) NOT NULL,
  `estado` ENUM('activo', 'inactivo') NULL DEFAULT 'activo',
  PRIMARY KEY (`idUsuarios`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `bd_blog`.`comentarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bd_blog`.`comentarios` (
  `idcomentarios` INT NOT NULL AUTO_INCREMENT,
  `contenido` VARCHAR(300) NULL,
  `FechaComentario` VARCHAR(300) NULL,
  `imagen` VARCHAR(300) NULL,
  `usuarios_idUsuarios` INT(11) NOT NULL,
  `entradas_idEntradas` INT(11) NOT NULL,
  PRIMARY KEY (`idcomentarios`, `usuarios_idUsuarios`, `entradas_idEntradas`),
  INDEX `fk_comentarios_usuarios_idx` (`usuarios_idUsuarios` ASC) VISIBLE,
  INDEX `fk_comentarios_entradas1_idx` (`entradas_idEntradas` ASC) VISIBLE,
  CONSTRAINT `fk_comentarios_usuarios`
    FOREIGN KEY (`usuarios_idUsuarios`)
    REFERENCES `bd_blog`.`usuarios` (`idUsuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comentarios_entradas1`
    FOREIGN KEY (`entradas_idEntradas`)
    REFERENCES `bd_blog`.`entradas` (`idEntradas`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
