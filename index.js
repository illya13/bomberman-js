const MongoClient = require('mongodb').MongoClient;
const WebSocket = require('ws');


const url = 'mongodb://localhost:27017';
const dbName = 'bomberman';
const collection = 'boards';


let db, ws, idPing, idHeartbeat, idRound;
let isAlive = false;


const heartbeat = () => {
  if (!isAlive) {
    console.log(new Date(), 'HEARTBEAT');
    reconect();
  }
  isAlive = false;
};


const ping = () => {
  ws.ping('{}');
};


const round = () => {
  ws.send('{"name":"getScreen","allPlayersScreen":true,"players":["1mwsmmf8emx2yi94ho4y"],"gameName":"bomberman"}');
};


const init = () => {
  ws = new WebSocket('wss://botchallenge.cloud.epam.com/codenjoy-contest/screen-ws?user=1mwsmmf8emx2yi94ho4y');

  ws.on('open', () => { 
    idPing = setInterval(ping, 5000);
    idHeartbeat = setInterval(heartbeat, 11000);
    idRound = setInterval(round, 500);
  });

  ws.on('message', async (raw) => {
    const data = JSON.parse(raw);
    const r = await db.collection(collection).insertOne(data, {w: 'majority', wtimeout: 500, serializeFunctions: true, forceServerObjectId: true});
  });

  ws.on('error', (e) => {
    console.log(new Date(), 'ERROR');
    console.log(e);
    reconect();
  });

  ws.on('pong', () => {
    isAlive = true;
  });
};


const reconect = () => {
  console.log(new Date(), "RECONNECT");
  if (idPing) clearInterval(idPing);
  if (idHeartbeat) clearInterval(idHeartbeat);
  if (idRound) clearInterval(idRound);
  ws.close();
  init();
};


(async function() {
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
})();

init();
