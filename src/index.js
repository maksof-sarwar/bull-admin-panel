import dotenv from 'dotenv/config';
import express from 'express';
import setupAdmin, { firstQueue } from './lib/bull-admin-panel';
const app = express();
app.use('/add/:name', async (req, res) => {
	try {
		const { name } = req.params;
		const opts = req.query.opts || {};
		if (opts.delay) {
			opts.delay = +opts.delay * 1000;
		}
		firstQueue.add(name, { title: req.query.title }, { ...opts });
		res.status(200).send(`Queue added successfully.`);
	} catch (err) {
		res.status(500).send({ statusCode: 500, message: err.message });
	}
});
const start = async () => {
	try {
		await setupAdmin(app);
		app.listen(process.env.PORT, () =>
			console.log(`[server] listening on port ${process.env.PORT}`)
		);
	} catch (error) {
		console.log(error.message);
	}
};
start();
