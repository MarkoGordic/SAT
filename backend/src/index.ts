import express, { Express, Request, Response } from "express";
//import initializeSocketIO from './util/SocketIOServer';
const bodyParser = require("body-parser");
const cors = require("cors");
import path from "path";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 11000;

const httpServer = createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin: process.env.FRONTEND_URL || true,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from OTISAK api!");
});

import authRouter from './routes/auth';
app.use('/auth', authRouter);

//initializeSocketIO(httpServer);

httpServer.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});