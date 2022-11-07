import IORedis from 'ioredis';
const redis = new IORedis(process.env.REDIS_URL, {
	maxRetriesPerRequest: null,
});
redis.on('connect', () => console.log(`Redis connected.`));
redis.on('error', (err) => console.log(err.message));

export default redis;
