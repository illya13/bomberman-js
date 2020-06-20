const ObjectID = require('mongodb').ObjectID;

const settings = require('./settings');
const lib = require('./lib');


const run = async () => {
  const mongoClient = await lib.mongoClient();
  const db = mongoClient.db(settings.mongo.dbName);
  const cursor = await db.collection('boards').find({});

  let i = 0;
  for await(const boards of cursor) {
    i++;
    if (i % 100 === 0) console.log(i);

    const _id = new ObjectID(boards['_id']);
    for (const key of Object.keys(boards)) {
      if (key === '_id') continue;

      const board = boards[key];
      board['_id'] = _id;
      for (const player of Object.keys(board['scores'])) {
        await db.collection(player).insertOne(board, settings.mongo.insert);
      }
    }
  }

  console.log("ALL DONE", i);
  await mongoClient.close();
};


(async () => await run())();
