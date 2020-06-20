const ObjectID = require('mongodb').ObjectID;

const settings = require('./settings');
const lib = require('./lib');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function printBoard(size, board) {
  console.clear();
  for (let i = 0; i < size; i++) {
    let line = "";
    for (let j = 0; j < size; j++) {
      let c = board.charAt(size * i + j);
      // UNIX terminal protection
      if (c === settings.game.elements.BOOM) {
        c = '+';
      }
      line +=  c + ' ';
    }
    console.log(line)
  }
}


const run = async (player) => {
  const mongoClient = await lib.mongoClient();
  const db = mongoClient.db(settings.mongo.dbName);

  const cursor = await db.collection(player).find({});
  for await(const board of cursor) {
    printBoard(board.boardSize, lib.decode(board.board));
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

  console.log("ALL DONE", i);
  await mongoClient.close();
};

(async () => await run('p0p8n9fwffdxem12bje0'))();
