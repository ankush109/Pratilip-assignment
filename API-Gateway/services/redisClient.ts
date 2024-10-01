import { RedisCache } from "apollo-server-cache-redis";
import Redis from "ioredis"


export const redisClient = new Redis({
  host: 'localhost', // Update if Redis runs on a different host
  port: 6379,        // Default Redis port
})

