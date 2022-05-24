const express = require('express');
const http = require('http');
const BullAdminPanel = require('bull-admin-panel');
const Bull = require('bull')

// const server = http.createServer(app);
const { createBullBoard } = require('bull-board');
const { BullAdapter } = require('bull-board/bullAdapter');
const apiMontior = new Bull('Api Monitor', {
  redis: {
    host: 'localhost',
    port: 6379,
  },
});

const { router } = createBullBoard([new BullAdapter(apiMontior)])
const app = express();
app.use('/admin', router);
// app.use('/admin', new BullAdminPanel({
//   basePath: '/admin',
//   verifyClient: (info, callback) => {
//     // Do authorization for WebSocket.
//     // https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
//     callback(true);
//   },
//   queues: [apiMontior],
//   server: server
// }));
app.use((req, res, next) => {
  const data = {
    query: req.query,
    body: req.body,
    params : req.params
  }
  req.data = data;
  apiMontior.add(data)
  next()
})
apiMontior.process(test)

function test(data) {
  console.log(data)
}
app.get('/send', (req, res) => {
  test(req.data)
  res.status(200).send({ success : true, message : 'OK', data : req.data})
})



// Launch server
app.listen(8000, () => {
  // const {address, port} = app.;
  console.log(`Server listening at http://:${8000}`);
});