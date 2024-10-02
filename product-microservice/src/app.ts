import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import createError, { type HttpError } from "http-errors";
import morgan from "morgan";
import path from "path";
import favicon from "serve-favicon";
import "./v1/config/env.config";
import { ProductRoute } from "./v1/routes";
import { consumeEvent } from "./v1/consumers";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: createError.TooManyRequests().status,
    message: createError.TooManyRequests().message,
  },
});

const corsOption = {
  origin: [String(process.env.FRONTEND_URL)],
};

export const app: Express = express();
global.appRoot = path.resolve(__dirname);

app.use(helmet());
app.set("trust proxy", 1);
app.use(limiter);
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.all("/", (_req: Request, res: Response) => {
  res.send({ message: "PRODUCT MICROSERVICE is Up and Running 😎🚀" });
});

const apiVersion: string = "v1";
app.use(`/${apiVersion}/product`, ProductRoute);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

consumeEvent("order_placed");

app.use((err: HttpError, _req: Request, res: Response) => {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT: number = Number(process.env.PORT) || 6000;
app.listen(PORT, () => {
  console.log(`PRODUCT MICROSERVICE IS RUNNING ON PORT ${PORT}`);
});
