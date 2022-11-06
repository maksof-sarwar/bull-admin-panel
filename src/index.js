import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
const app = express();
const server = http.createServer(app);
import { Queue, Worker } from 'bullmq';
import BullAdminPanel from 'bull-admin-panel';
import IORedis from 'ioredis';

const redis = new IORedis(
	{
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		username: process.env.REDIS_USERNAME,
		password: process.env.REDIS_PWD,
	},
	{
		reconnectOnError: true,
		retryStrategy: 3,
	}
);
redis.on('connect', () => console.log(`Redis connected.`));
const queue = new Queue('events', { connection: redis });
const worker = new Worker(
	'events',
	async (job, error) => {
		await job.updateProgress(10);
		setTimeout(async () => {
			await job.updateProgress(10);
		}, 1000);
		setTimeout(async () => {
			await job.updateProgress(30);
		}, 2000);
		setTimeout(async () => {
			await job.updateProgress(50);
		}, 3000);
		setTimeout(async () => {
			await job.updateProgress(100);
		}, 6000);
		return 'succeess';
	},
	{
		lockDuration: 300000,
		connection: redis,
	}
);
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
const start = async () => {
	try {
		server.listen(process.env.PORT, () =>
			console.log(`[server] listening on port ${process.env.PORT}`)
		);

		const job = await queue.add('1st job', { id: '1' });

		worker.on('progress', (progress) => {
			console.log(progress.progress);
		});
	} catch (error) {
		console.log(error.message);
	}
};
start();
// async (job, error) => {
// 		await job.updateProgress(0);
// 		setTimeout(async () => {
// 			await job.updateProgress(55);
// 		}, 3000);
// 		setTimeout(async () => {
// 			await job.updateProgress(100);
// 		}, 6000);
// 	},
