const net = require('net');
const udp = require('dgram');

const udpServer = udp.createSocket('udp4');

const tcpPort = 1234;
const udpPort = 1235;

let tcpSize, tcpCount, udpCount = 0, udpSize = 0;
let startUdp, lastUdp, udpTransmissionSize;


const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

const server = net.createServer(async (socket) => {
  console.log('TCP Start');
  tcpSize = 0;
  tcpCount = 0;
  const start = Date.now();
  socket.on('data', (chunk) => {
    tcpCount++;
    tcpSize += chunk.length;
  });

  socket.on('end', () => {
    console.log(`TCP end. Received: ${tcpCount} Size: ${tcpSize} Time: ${(Date.now() - start) / 1000}s\`)`);
  });
});

server.listen(tcpPort, '0.0.0.0');


udpServer.on('error', (error) => {
  console.log('Error: ' + error);
  udpServer.close();
});

// emits on new datagram msg
udpServer.on('message', (chunk) => {
  const length = chunk.length;
  if (length < 64) {
    const str = chunk.toString();
    if (str === 'start') {
      udpCount = 0;
      udpSize = 0;
      startUdp = Date.now();
    }
  } else {
    udpCount++;
    udpSize += length;
    lastUdp = Date.now();
  }
});

function printUdpResults() {
  console.log(`UDP connection ended. Received: ${udpCount} Size: ${udpSize} Time: ${(lastUdp - startUdp) / 1000}s`);
}

setInterval(printUdpResults, 5 * 1000);
udpServer.bind(udpPort);
