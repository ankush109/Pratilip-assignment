import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import createError, { type HttpError } from "http-errors";
import morgan from "morgan";
import path from "path";
import favicon from "serve-favicon";
import amqp from "amqplib";
import "./v1/config/env.config";
import client from "prom-client";
import { authRoutes, UserRoutes } from "./v1/routes";
import { httpMicrosecond } from "./v1/metrics/activeRequests";

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

client.collectDefaultMetrics({ register: client.register });

app.use(helmet());
app.set("trust proxy", 1);
app.use(limiter);
app.use(cors(corsOption));
app.use(express.json());
app.use(httpMicrosecond);
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.all("/", (_req: Request, res: Response) => {
  res.send({ message: "USER MICROSERVICE is Up and Running 😎🚀" });
});

const apiVersion: string = "v1";
app.use(`/${apiVersion}/auth`, authRoutes);
app.use(`/${apiVersion}/user`, UserRoutes);

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set('Content-Type', client.register.contentType);
  res.end(metrics);
});

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

app.use((err: HttpError, _req: Request, res: Response) => {
  res.status(err.status || 500).send({
    status: err.status || 500,
    message: err.message,
  });
});

export async function publishEvent(event: any, eventType: string) {
  const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'events_exchange';
  const routingKey = eventType;

  await channel.assertExchange(exchange, 'direct', { durable: true });
  channel.publish(exchange, routingKey, Buffer.from(JSON.stringify({ eventData: event, eventType })));
  console.log(`Event published: ${eventType}`, event);

  await channel.close();
  await connection.close();
}

const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`USER MICROSERVICE IS RUNNING ON PORT ${PORT}`);
});
