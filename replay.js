const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const decode = require('./decode')

const url = 'mongodb://10.8.0.6:27017';
// const url = 'mongodb://localhost:27017';
const dbName = 'bomberman';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function out(size, board) {
  console.clear();
  for (let i=0; i<size; i++) {
    let line = "";
    for (let j=0; j<size; j++) {
      line += board.charAt(size*i+j) + ' ';
    }
    console.log(line)
  }
}

(async function() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);

  const player = 'p0p8n9fwffdxem12bje0';

  const cursor = await db.collection(player).find({});
  for await(const board of cursor) {
    out(board.boardSize, decode(board.board));
    console.log(board.info);
    console.log();

    console.log('scores:');
    console.log('\t', player, board.scores[player]);
    for (const other of Object.keys(board.scores)) {
      if (other === player) continue;
      console.log('\t\t', other, board.scores[other]);
    }

    console.log();
    console.log('UTC:', new ObjectID(board['_id']).getTimestamp());
    await sleep(1000);
  }
})();
