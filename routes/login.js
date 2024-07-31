import express from "express";
import { loginUsuario } from "../controllers/login.js";
const route=express.Router();

route.post('/', loginUsuario);

export default route;