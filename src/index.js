import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
const app = express();
const server = http.createServer(app);
import { Queue, Worker } from 'bullmq';
import BullAdminPanel from 'bull-admin-panel';
import IORedis from 'ioredis';
const redis = new IORedis(process.env.REDIS_URL, {
	reconnectOnError: true,
	retryStrategy: 3,
});
redis.on('connect', () => console.log(`Redis connected.`));
const queue = new Queue('events', { connection: redis });

app.use(
	'/bull',
	new BullAdminPanel({
		basePath: '/bull',
		verifyClient: (info, callback) => {
			callback(true);
		},
		queues: [queue],
		server,
	})
);
const start = () => {
	try {
		server.listen(process.env.PORT, () =>
			console.log(`[server] listening on port ${process.env.PORT}`)
		);
		queue.add('test', { sarwar: '123' }).then((job) => {
			console.log(r.progress);
		});
	} catch (error) {
		console.log(error.message);
	}
};
start();
