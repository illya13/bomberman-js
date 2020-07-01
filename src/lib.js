const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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
  }

  element = fromAlphabet[array[player]];
  if (settings.game.elements.OTHER_BOMBERMAN === element) {
    array[player] = toAlphabet[settings.game.elements.BOMBERMAN];
  } else if (settings.game.elements.OTHER_BOMB_BOMBERMAN === element) {
    array[player] = toAlphabet[settings.game.elements.BOMB_BOMBERMAN];
  } else if (settings.game.elements.OTHER_DEAD_BOMBERMAN === element) {
    array[player] = toAlphabet[settings.game.elements.DEAD_BOMBERMAN];
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


function actionByDeltas(dx, dy) {
  if (dx === -1) {
    return "LEFT";
  } else if (dx === 1) {
    return "RIGHT";
  } else {
    if (dy === -1) {
      return "DOWN";
    } else if (dy === 1) {
      return "UP";
    }
  }
}


function playerIndexOnBoard(board, player) {
  return coordinateToIndex(board.heroesData.coordinates[player].coordinate, board.boardSize);
}


function playerElementOnBoard(board, player) {
  const index = playerIndexOnBoard(board, player);
  return fromAlphabet[board.board.charAt(index)];
}


function dx(player, board, prev) {
  return board.heroesData.coordinates[player].coordinate.x - prev.heroesData.coordinates[player].coordinate.x;
}


function dy(player, board, prev) {
  return board.heroesData.coordinates[player].coordinate.y - prev.heroesData.coordinates[player].coordinate.y;
}


function playerAction(player, board, prev) {
  let action = actionByDeltas(dx(player, board, prev), dy(player, board, prev));

  let index = playerIndexOnBoard(prev, player);
  let element = fromAlphabet[board.board.charAt(index)];
  if (settings.game.elements.BOMB_TIMER_4 === element) {
    return {action: ["ACT", action], bomb: {coordinate: prev.heroesData.coordinates[player].coordinate}};
  }

  element = playerElementOnBoard(board, player);
  if (settings.game.elements.BOMB_BOMBERMAN === element) {
    return {action: [action, "ACT"], bomb: {coordinate: board.heroesData.coordinates[player].coordinate}};
  }
  return {action: [action]};
}


function collectPerksIfAny(player, board, prev, perks) {
  let index = playerIndexOnBoard(board, player);
  let element = fromAlphabet[prev.board.charAt(index)];
  if (settings.game.elements.BOMB_BLAST_RADIUS_INCREASE === element) {
    perks['bomb_blast_radius_increase'] += settings.game.settings['2020-06-22'].perksBombBlastRadiusIncreaseEffectTimeout;
  } else if (settings.game.elements.BOMB_COUNT_INCREASE === element) {
    perks['bomb_count_increase'] += settings.game.settings['2020-06-22'].perksBombCountEffectTimeout;
  } else if (settings.game.elements.BOMB_IMMUNE === element) {
    perks['bomb_immune'] += settings.game.settings['2020-06-22'].perksBombImmuneEffectTimeout;
  }
}


function decreasePerksIfAny(perks) {
  if (perks['bomb_blast_radius_increase'] > 0) {
    perks['bomb_blast_radius_increase']--;
  }
  if (perks['bomb_count_increase'] > 0) {
    perks['bomb_count_increase']--;
  }
  if (perks['bomb_immune'] > 0) {
    perks['bomb_immune']--;
  }
}


function updateBombsIfAny(bombs, step) {
  for (const bomb of Object.keys(bombs)) {
    if (parseInt(bomb) + 5 < step) {
      delete bombs[bomb];
    }
  }
}


function enrichPrev(player, board, prev) {
  const prevAction = playerAction(player, board, prev);
  prev.action = prevAction.action.filter(a => a !== undefined);
  if (prevAction.bomb) {
    prev.bombs[prev.step] = prevAction.bomb;
  }
  return {step: prev.step, bombs: prev.bombs, perks: prev.perks};
}


function isDone(player, board) {
  const element = playerElementOnBoard(board, player);
  return (settings.game.elements.DEAD_BOMBERMAN === element);
}


function doStep(extra) {
  if (!extra.done) extra.step++;
  updateBombsIfAny(extra.bombs, extra.step);
  decreasePerksIfAny(extra.perks);
}


function enrichPlayer(player, board, prev) {
  let extra = {
    done: isDone(player, board), reward: 0, step: 0,
    bombs: {},
    perks: {
      'bomb_blast_radius_increase': 0,
      'bomb_count_increase': 0,
      'bomb_immune': 0
    }
  }
  if (prev) {
    Object.assign(extra, enrichPrev(player, board, prev));
    collectPerksIfAny(player, board, prev, extra.perks);
    extra.reward = board.scores[player] - prev.scores[player];
  }
  doStep(extra);
  Object.assign(board, extra);
}


function cleanBoard(board) {
  let data = {};
  Object.assign(data, board);
  delete data['gameName'];
  delete data['score'];
  delete data['heroesData'];

  data['_id'] = new ObjectID(board['_id']).getTimestamp();
  data['coordinates'] = {};
  for (const coordinate of Object.keys(board['heroesData']['coordinates'])) {
    data['coordinates'][coordinate] = board['heroesData']['coordinates'][coordinate]['coordinate'];
  }
  return data;
}


function cleanAllBoards(boards) {
  let data = {};
  const _id = new ObjectID(boards['_id']);
  data['_id'] = _id.getTimestamp();
  for (const key of Object.keys(boards)) {
    if (key === '_id') continue;

    const board = boards[key];
    board['_id'] = _id;
    data[key] = cleanBoard(board);
  }
  return data;
}


async function mongoClient() {
  const client = new MongoClient(settings.mongo.url, {useUnifiedTopology: true});
  await client.connect();
  return client;
}


function coordinateToIndex(coordinate, size) {
  return coordinate.x + size * (size - coordinate.y - 1);
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
        c = '*';
      }
      line += c + ' ';
    }
    console.log(line)
  }
}


module.exports = {human, switchPlayers, mongoClient, sleep, printBoard, cleanBoard, cleanAllBoards, enrichPlayer};
