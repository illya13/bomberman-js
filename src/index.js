const WebSocket = require('ws');

const settings = require('./settings');
const lib = require('./lib');


let ws, idPing, idHeartbeat, idRound;
let isAlive = false;


const heartbeat = async () => {
  if (!isAlive) {
    console.log(new Date(), 'HEARTBEAT');
    await reconnect();
  }
  isAlive = false;
};


const ping = () => {
  ws.ping('{}');
};


const round = () => {
  ws.send(settings.server.screen);
};


const run = async () => {
  const mongoClient = await lib.mongoClient();
  const db = mongoClient.db(settings.mongo.dbName);

  ws = new WebSocket(settings.server.ws);

  ws.on('open', async () => {
    idPing = setInterval(ping, settings.server.intervals.ping);
    idHeartbeat = setInterval(await heartbeat, settings.server.intervals.heartbeat);
    idRound = setInterval(round, settings.server.intervals.round);
  });

  ws.on('message', async (raw) => {
    const data = JSON.parse(raw);
    await db.collection('boards').insertOne(data, settings.mongo.insert);
  });

  ws.on('error', async (e) => {
    console.log(new Date(), 'ERROR');
    console.log(e);
    await reconnect();
  });

  ws.on('pong', () => {
    isAlive = true;
  });
};


const reconnect = async() => {
  console.log(new Date(), "RECONNECT");
  if (idPing) clearInterval(idPing);
  if (idHeartbeat) clearInterval(idHeartbeat);
  if (idRound) clearInterval(idRound);
  ws.close();
  await run();
};

(async () => await run())();
