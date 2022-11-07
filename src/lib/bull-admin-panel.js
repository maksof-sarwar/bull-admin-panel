import { Queue, Worker } from 'bullmq';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import redis from './redis';
const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t * 1000));
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');
export const createQueue = (name) => new Queue(name, { connection: redis });
export const firstQueue = createQueue('events');
createBullBoard({
	queues: [new BullMQAdapter(firstQueue)],
	serverAdapter,
});
export async function setupProcessor(queueName, callback = null) {
	new Worker(
		queueName,
		async (job) => {
			if (callback) {
				callback(job);
				return;
			}
			for (let i = 0; i <= 100; i++) {
				await sleep(Math.random());
				await job.updateProgress(i);
				await job.log(`Processing job at interval ${i}`);
				if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
			}
			return { jobId: `This is the return value of job (${job.id})` };
		},
		{ connection: redis }
	);
}

const setupAdmin = async (app) => {
	app.use('/ui', serverAdapter.getRouter());
	await setupProcessor('events');
};
export default setupAdmin;
