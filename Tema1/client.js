const net = require('net');
const udp = require('dgram');

const tcpPort = 1234;
const udpPort = 1235;

const tcpClient = new net.Socket();
const udpClient = udp.createSocket('udp4');

const times = 10000 * 5;
const address = '127.0.0.1';

const pkgSize = 8192; // 8kb
const buff = Buffer.alloc(pkgSize);


const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

function tcpTest() {
  tcpClient.connect(tcpPort, address, async () => {
    console.log('TCP Start');

    let count = 0;

    while (count < times) {
      tcpClient.write(buff);
      count++;
    }
    console.log(`Tcp connection ended. Sent: ${count} Size: ${count * pkgSize}`);
    tcpClient.end();
  });

  tcpClient.on('close', async () => {
    console.log(`TCP end.`);
  });
}


async function udpTest() {
  console.log('UDP Start');
  const start = Date.now();
  let count = 0;

  udpSend('start');

  while (count < times) {
    udpSend(buff);
    count++;
  }
  console.log(`UDP connection ended. Sent: ${count} Size: ${count * pkgSize} Time: ${(Date.now() - start) / 1000}s`);
}


async function udpTestWait() {
  console.log('UDP Wait Start');
  const start = Date.now();
  let count = 0;

  udpSend('start');

  while (count < times) {
    if (count % 100 === 0) {
      await sleep(10);
    }
    udpSend(buff);
    count++;
  }
  console.log(`UDP connection ended. Sent: ${count} Size: ${count * pkgSize} Time: ${(Date.now() - start) / 1000}s`);
}


function udpSend(buffer) {
  udpClient.send(buffer, udpPort, address, (err) => {
    if (err) {
      udpClient.close();
    }
  });
}

(async () => {
  const arg = process.argv[2];
  if (arg === 'udp') {
    await udpTest();
  } else if (arg === 'udpWait') {
    await udpTestWait();
  } else if (arg === 'tcp') {
    await tcpTest();
  }
})();

