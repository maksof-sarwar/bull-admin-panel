require('dotenv/config');
const { QueueEvents } = require('bullmq');
const IORedis = require('ioredis');
const redis = new IORedis(process.env.REDIS_URL, {
	maxRetriesPerRequest: null,
});

const queueEvents = new QueueEvents('events', {
	connection: redis,
});

queueEvents.on('progress', ({ jobId, data }, timestamp) => {
	console.log(jobId, data, timestamp);
});
