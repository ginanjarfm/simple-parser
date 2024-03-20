const net = require('net');
const { parseHexString } = require("./../server");

const server = net.createServer((socket) => {
  const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`Client connected: ${remoteAddress}`);

  socket.on('data', (data) => {
    const hexData = data.toString('hex');
    console.log(`[${remoteAddress}] Received data from ${remoteAddress}: ${hexData}`);

    if (hexData.substring(0, 4) === '0006') {
      const ack = Buffer.from([0x01]);
      console.log(`[${remoteAddress}] Sending ACK to ${remoteAddress}: 01`);
      socket.write(ack);
    } else {
      const parsedData = parseHexString(hexData);
      // console.log(JSON.stringify(parsedData, null, 2));
    }
  });

  socket.on('end', () => {
    console.log(`[${remoteAddress}] Client disconnected: ${remoteAddress}`);
  });

  socket.on('error', (err) => {
    console.error(`[${remoteAddress}] Socket error with client ${remoteAddress}:`, err);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});
