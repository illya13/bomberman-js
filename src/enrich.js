const settings = require('./settings');
const lib = require('./lib');


const playerEnrich = async (db, player) => {
  const cursor = await db.collection(player).find({});

  let i = 0, prev = null;
  for await(const board of cursor) {
    i++;
    if (i % 1000 === 0) console.log(player, i);

    lib.enrichPlayer(player, board, prev);
    if (prev) await db.collection(player).replaceOne({_id: prev._id}, prev);
    await db.collection(player).replaceOne({_id: board._id}, board);
    prev = board;
  }
};

const run = async () => {
  const mongoClient = await lib.mongoClient();
  const db = mongoClient.db(settings.mongo.dbName);
  const collections = await db.collections();
  for (const i in collections) {
    const player = collections[i];
    if (player.collectionName === 'boards') continue;

    await playerEnrich(db, player.collectionName);
  }

  console.log("ALL DONE");
  await mongoClient.close();
};

(async () => await run())();
