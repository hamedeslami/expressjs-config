import { createClient } from 'redis';

const redis = createClient();
  redis.on('error', err => console.log('Redis Client Error', err?.message));
  redis.on('connect', () => console.log('Connect to Redis Successfully.'))
  redis.connect();


export default redis;