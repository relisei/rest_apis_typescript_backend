import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import router from "./router";
import db from "./config/db";

export const connectDB = async () => {
  try {
    await db.authenticate();
    db.sync();
    // console.log(colors.blue("Conexión exitosa a la DB"));
  } catch (error) {
    // console.log(error);
    console.log(colors.red("Hubo un error al conectar a la DB"));
  }
};

connectDB();

const server = express();

//Prmitir conexiones
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Error de Cors"));
    }
  },
};

server.use(cors(corsOptions));

//Leer datos de formulario
server.use(express.json());

server.use(morgan("dev"));

server.use("/api/products", router);

//Docs
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default server;
