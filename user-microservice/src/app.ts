import cors from "cors";
import express, { type Express, type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import createError, { type HttpError } from "http-errors";
import morgan from "morgan";
import path from "path";
import favicon from "serve-favicon";
import amqp  from "amqplib"
import "./v1/config/env.config";
import client from "prom-client";
import { authMiddleware } from "./v1/middlewares";
import { authRoutes,UserRoutes } from "./v1/routes";

import { monitoringMiddleware } from "./v1/metrics";
import { requestCountMiddleware } from "./v1/metrics/requestCount";
import { httpMicrosecond } from "./v1/metrics/activeRequests";

// RateLimitter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: createError.TooManyRequests().status,
    message: createError.TooManyRequests().message,
  },
});

const corsOption = {
  origin: [String(process.env.FRONTEND_URL)],
};

export const app: Express = express();

// Global variable appRoot with base dirname
global.appRoot = path.resolve(__dirname);

// Middlewares
app.use(helmet());
app.set("trust proxy", 1);
app.use(limiter);
app.use(cors(corsOption));
app.use(express.json());
//app.use(requestCountMiddleware)
app.use(httpMicrosecond)
app.use(monitoringMiddleware)
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
// app.use(authMiddleware);

// Welcome Route
app.all("/", (_req: Request, res: Response, _next: NextFunction) => {
  res.send({ message: "API is Up and Running 😎🚀" });
});

const apiVersion: string = "v1";

// Routes
app.use(`/${apiVersion}/auth`, authRoutes);
app.use(`/${apiVersion}/user`, UserRoutes);
app.get("/metrics",async(req,res)=>{
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})


// 404 Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError.NotFound());
});

// Error Handler
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

export async function publishEvent(event: any, eventType: string) {
    const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
    const channel = await connection.createChannel();
    
    const exchange = 'events_exchange'; // Define an exchange
    const routingKey = eventType; // Use the event type as the routing key

    await channel.assertExchange(exchange, 'direct', { durable: true });

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)));
    console.log(`Event published: ${eventType}`, event);

    await channel.close();
    await connection.close();
}

// Server Configs
const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`USER MICROSERVICE IS RUNNING ON PORT ${PORT}`);
});
