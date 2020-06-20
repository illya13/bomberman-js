const MongoClient = require('mongodb').MongoClient;

const settings = require('./settings');


const fromAlphabet = {};
const toAlphabet = {};
for (let i = 0; i < settings.game.alphabet.length; i++) {
  const sprite = settings.game.sprites[i];
  if (settings.game.sprites[i]) {
    fromAlphabet[settings.game.alphabet.charAt(i)] = settings.game.elements[sprite.toUpperCase()];
    toAlphabet[settings.game.elements[sprite.toUpperCase()]] = settings.game.alphabet.charAt(i);
  }
}


function human(board) {
  return Array.from(board).map(c => fromAlphabet[c]).join("");
}


function switchBoard(board, key, player) {
  let array = Array.from(board);

  let element = fromAlphabet[array[key]];
  if (settings.game.elements.BOMBERMAN === element) {
    array[key] = toAlphabet[settings.game.elements.OTHER_BOMBERMAN];
  } else if (settings.game.elements.BOMB_BOMBERMAN === element) {
    array[key] = toAlphabet[settings.game.elements.OTHER_BOMB_BOMBERMAN];
  } else if (settings.game.elements.DEAD_BOMBERMAN === element) {
    array[key] = toAlphabet[settings.game.elements.OTHER_DEAD_BOMBERMAN];
  } else {
    throw new Error("Can't map element" + element);
  }

  element = fromAlphabet[array[player]];
  if (settings.game.elements.OTHER_BOMBERMAN === element) {
    array[player] = toAlphabet[settings.game.elements.BOMBERMAN];
  } else if (settings.game.elements.OTHER_BOMB_BOMBERMAN === element) {
    array[player] = toAlphabet[settings.game.elements.BOMB_BOMBERMAN];
  } else if (settings.game.elements.OTHER_DEAD_BOMBERMAN === element) {
    array[player] = toAlphabet[settings.game.elements.DEAD_BOMBERMAN];
  } else {
    throw new Error("Can't map element" + element);
  }

  return array.join("");
}


function switchPlayers(key, player, board) {
  if (key === player) return board;

  let normalized = {};
  Object.assign(normalized, board);
  normalized.score = board.scores[player];
  normalized.board = switchBoard(
    normalized.board,
    coordinateToIndex(board.heroesData.coordinates[key].coordinate, board.boardSize),
    coordinateToIndex(board.heroesData.coordinates[player].coordinate, board.boardSize)
  );
  return normalized;
}


async function mongoClient() {
  const client = new MongoClient(settings.mongo.url, { useUnifiedTopology: true });
  await client.connect();
  return client;
}


function coordinateToIndex(coordinate, size) {
  return coordinate.x + size*(size - coordinate.y - 1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function printBoard(size, board) {
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


module.exports = {human, switchPlayers, mongoClient, sleep, printBoard};