const fs = require('fs').promises

const settings = require('./settings');
const lib = require('./lib');

const run = async (player) => {
  const mongoClient = await lib.mongoClient();
  const db = mongoClient.db(settings.mongo.dbName);
  const fd = await fs.open(player+'.json', 'w');

  const cursor = await db.collection(player).find({});
  for await(const boards of cursor) {
    const data = lib.cleanAllBoards(boards);
    await fs.writeFile(fd, JSON.stringify(data)+"\n");
  }
  await fd.close()

  await mongoClient.close();
};

(async () => await run('boards'))();
