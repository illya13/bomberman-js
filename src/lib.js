const MongoClient = require('mongodb').MongoClient;

const settings = require('./settings');


const mapping = {};
for (let i = 0; i < settings.game.alphabet.length; i++) {
  const sprite = settings.game.sprites[i];
  if (settings.game.sprites[i]) {
    mapping[settings.game.alphabet.charAt(i)] = settings.game.elements[sprite.toUpperCase()];
  }
}


function decode(board) {
  return Array.from(board).map(c => mapping[c]).join("");
}


async function mongoClient() {
  const client = new MongoClient(settings.mongo.url, { useUnifiedTopology: true });
  await client.connect();
  return client;
}


module.exports = {decode, mongoClient};