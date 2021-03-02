const net = require('net');
const udp = require('dgram');

const tcpPort = 1234;
const udpPort = 1235;

const tcpClient = new net.Socket();
const udpClient = udp.createSocket('udp4');

const times = 10000 * 5;
const address = 'localhost';

const pkgSize = 81920; // 8kb
const buff = Buffer.alloc(pkgSize);

const tcpOpts = {
  times: 62520,
  pkgSize: 65515,
  buff: Buffer.alloc(6551)
};

let udpAck = 0;
let tcpAck = 0;


const sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

function tcpTest() {
  tcpClient.connect(tcpPort, address, async () => {
    console.log('TCP Start');

    let count = 0;

    while (count < tcpOpts.times) {
      tcpClient.write(tcpOpts.buff);
      count++;
    }
    console.log(`Tcp connection ended. Sent: ${count} Size: ${count * tcpOpts.pkgSize}`);
    tcpClient.end();
  });

  tcpClient.on('close', async () => {
    console.log(`TCP end.`);
  });
}

function tcpWaitTest() {
  tcpClient.connect(tcpPort, address, async () => {
    console.log('TCP Start');
    tcpClient.setNoDelay(true);
    tcpClient.setKeepAlive(true);
    tcpClient.write('wait');

    await sleep(500);
    let count = 0;

    while (count < tcpOpts.times) {
      await sleep(1);

      console.log(count);

      if (tcpAck > 0) {
        tcpAck -= 1;
        tcpClient.write(tcpOpts.buff);
        count++;
      }
    }
    console.log(`Tcp connection ended. Sent: ${count} Size: ${count * tcpOpts.pkgSize}`);
    tcpClient.end();
  });

  tcpClient.on('close', async () => {
    console.log(`TCP end.`);
  });


  tcpClient.on('data', function (data) {
    if (data.toString() === 'ack') {
      tcpAck += 1;
    }
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

  udpSend('start wait');

  while (count < times) {
    await sleep(1);
    if (udpAck > 0) {
      udpAck = 0;
      udpSend(buff);
      count++;
    }
  }
  console.log(`UDP connection ended. Sent: ${count} Size: ${count * pkgSize} Time: ${(Date.now() - start) / 1000}s`);
}


function udpSend(buffer) {
  udpClient.send(buffer, udpPort, address, (err) => {
    if (err) {
      udpClient.close();
      console.log(err);
    }
  });
}

udpClient.on('message', (chunk, info) => {
  udpAck += 1;
});


(async () => {
  const arg = process.argv[2];
  if (arg === 'udp') {
    await udpTest();
  } else if (arg === 'udpWait') {
    await udpTestWait();
  } else if (arg === 'tcp') {
    await tcpTest();
  } else if (arg === 'tcpWait') {
    await tcpWaitTest();
  }
})();

