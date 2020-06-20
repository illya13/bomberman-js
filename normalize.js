const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// const url = 'mongodb://10.8.0.6:27017';
const url = 'mongodb://localhost:27017';
const dbName = 'bomberman';

(async function() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);

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
        await db.collection(player).insertOne(board, {
          w: 'majority',
          wtimeout: 500,
          serializeFunctions: true,
          forceServerObjectId: true
        });
      }
    }
  }
  console.log("ALL DONE", i);
  client.close();
})();
