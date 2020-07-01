const fs = require('fs').promises

const settings = require('./settings');
const lib = require('./lib');


const exportPlayer = async (db, player) => {
  const fd = await fs.open(player+'.raw', 'w');

  const cursor = await db.collection(player).find({});

  let i = 0;
  for await(const board of cursor) {
    i++;
    if (i % 1000 === 0) console.log(player, i);

    const data = lib.cleanBoard(board);
    await fs.writeFile(fd, JSON.stringify(data)+"\n");
  }
  await fd.close()
};


const run = async () => {
  const mongoClient = await lib.mongoClient();
  const db = mongoClient.db(settings.mongo.dbName);
  const collections = await db.collections();
  for (const i in collections) {
    const player = collections[i];
    if (player.collectionName === 'boards') continue;

    await exportPlayer(db, player.collectionName);
  }

  console.log("ALL DONE");
  await mongoClient.close();
};


(async () => await run())();
