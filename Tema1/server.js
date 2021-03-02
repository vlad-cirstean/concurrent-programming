const net = require('net');
const udp = require('dgram');

const udpServer = udp.createSocket('udp4');

const tcpWaitPort = 1233;
const tcpPort = 1234;
const udpPort = 1235;

let tcpSize, tcpCount, udpCount = 0, udpSize = 0;
let startUdp, lastUdp, udpTransmissionSize;
let tcpManual = false;

const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

const server = net.createServer(async (socket) => {
  console.log('TCP Start');
  tcpSize = 0;
  tcpCount = 0;
  tcpManual = false;
  socket.setKeepAlive(true);
  socket.setNoDelay(false);

  const start = Date.now();
  socket.on('data', (chunk) => {
    if (chunk.toString() === 'wait') {
      tcpManual = true;
      socket.setNoDelay(true);
    }
    tcpCount++;
    tcpSize += chunk.length;
    if (tcpManual) {
      socket.write('ack', (err)=>console.log(err));
    }
  });

  socket.on('end', () => {
    console.log(`TCP ${tcpManual ? 'Wait' : 'Stream'} end. Received: ${tcpCount} Size: ${tcpSize} Time: ${(Date.now() - start) / 1000}s`);
  });
});

server.listen(tcpPort, '0.0.0.0');


udpServer.on('error', (error) => {
  console.log('Error: ' + error);
  udpServer.close();
});

let udpAnswer = true;
// emits on new datagram msg
udpServer.on('message', (chunk, info) => {
  const length = chunk.length;
  if (length < 64) {
    const str = chunk.toString();
    if (str.includes('start')) {
      udpCount = 0;
      udpSize = 0;
      startUdp = Date.now();
      udpAnswer = false;
    }

    if (str === 'start wait') {
      udpAnswer = true;
    }

  } else {
    udpCount++;
    udpSize += length;
    lastUdp = Date.now();
  }

  if (udpAnswer) {
    udpServer.send('ack', info.port, info.address, function (error) {
      if (error) {
        udpServer.close();
      }
    });
  }
});

function printUdpResults() {
  console.log(`UDP connection ended. Received: ${udpCount} Size: ${udpSize} Time: ${(lastUdp - startUdp) / 1000}s`);
}

setInterval(printUdpResults, 5 * 1000);
udpServer.bind(udpPort);
