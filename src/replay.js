const ObjectID = require('mongodb').ObjectID;

const settings = require('./settings');
const lib = require('./lib');


const run = async (player) => {
  const mongoClient = await lib.mongoClient();
  const db = mongoClient.db(settings.mongo.dbName);

  const cursor = await db.collection(player).find({});
  for await(const board of cursor) {
    console.clear();
    lib.printBoard(board.boardSize, lib.human(board.board));
    console.log(board.info);
    console.log();

    console.log(board.done, board.step, board.action, board.reward);
    console.log();

    console.log(board.bombs);
    console.log(board.perks);
    console.log();

    console.log('scores:');
    console.log('\t', player, board.scores[player]);
    for (const other of Object.keys(board.scores)) {
      if (other === player) continue;
      console.log('\t\t', other, board.scores[other]);
    }

    console.log();
    console.log('UTC:', new ObjectID(board['_id']).getTimestamp());
    await lib.sleep(100);
  }

  console.log("NO MORE SCREENS");
  await mongoClient.close();
};

(async () => await run('_p0p8n9fwffdxem12bje0'))();
