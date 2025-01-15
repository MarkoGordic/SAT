import express, { Express, Request, Response } from "express";
import setupSwagger from "./utils/swaggerSetup";
const bodyParser = require("body-parser");
const cors = require("cors");
import path from "path";
import { createServer } from "http";
import dotenv from "dotenv";
import { SocketIOService } from "./utils/socketIOServer";
import { logCode } from './utils/logger/otisakLogger';

dotenv.config();

const app: Express = express();
const swaggerApp: Express = express();
const port = process.env.PORT || 11000;
const swaggerPort = process.env.SWAGGER_PORT || 11002;

const httpServer = createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
  origin: process.env.FRONTEND_URL || true,
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));

const apiRouter = express.Router();

apiRouter.get("/", (req: Request, res: Response) => {
  res.send("Hello from SAT API!");
});

import authRouter from './routes/auth';
apiRouter.use('/auth', authRouter);
import userRouter from './routes/user';
import { LOG_CODE_LIBRARY } from "./utils/logger/logDefinitions";
apiRouter.use('/user', userRouter);

app.use('/api/v1', apiRouter);

swaggerApp.use("/", setupSwagger());

// SocketIO DEMO setup
SocketIOService.getInstance(httpServer);

httpServer.listen(port, () => {
  logCode(LOG_CODE_LIBRARY.INFO_API_START);
});

swaggerApp.listen(swaggerPort, () => {
  logCode(LOG_CODE_LIBRARY.INFO_SWAGGER_START);
});