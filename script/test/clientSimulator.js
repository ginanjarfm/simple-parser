const net = require('net');

let isLoggedIn = false;
let client = null;

const loginData = '0006333041454134303730443634';
const sampleData = '00000000000000247e010000018e3d452df5000000040002004701004801000200490002004a00020000000000000100008612';

function reconnect() {
  client = net.createConnection({ host: '127.0.0.1', port: 3000 }, () => {
    console.log('Connected to server');
  });

  client.on('data', (data) => {
    console.log('Received from server:', data);
    if (data.length === 1 && data.readUInt8(0) === 1) {
      isLoggedIn = true;
    }
  });

  client.on('end', () => {
    isLoggedIn = false;
    console.log('Disconnected from server');
  });

  client.on('error', (err) => {
    isLoggedIn = false;
    console.error('Connection error:', err);
  });
}

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function login() {
  console.log('Sending login data', loginData);
  client.write(Buffer.from(loginData, 'hex'), (err) => {
    if (err) {
      console.error('Error sending login data:', err);
    }
  });
}

function isConnected() {
  return client && !client.destroyed && client.writable;
}

function sendDataToServer(data) {
  console.log('Sending sensor data', Buffer.from(data, 'hex'));
  client.write(Buffer.from(data, 'hex'), (err) => {
    if (err) {
      console.error('Error sending data to server:', err);
    }
  });
}

async function loop() {
  if (!isConnected()) {
    reconnect();
    console.log('Client is not connected');
  } else {
    console.log('Client is connected');
    if (!isLoggedIn) {
      login();
    } else {
      sendDataToServer(sampleData);
    }
  }
}

(async () => {
  while(true) {
    await loop();
    await delay(5000);
  }
})();
