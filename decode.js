const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const sprites = ["BOMBERMAN", "BOMB_BOMBERMAN", "DEAD_BOMBERMAN", "OTHER_BOMBERMAN", "OTHER_BOMB_BOMBERMAN", "OTHER_DEAD_BOMBERMAN", "BOMB_TIMER_5", "BOMB_TIMER_4", "BOMB_TIMER_3", "BOMB_TIMER_2", "BOMB_TIMER_1", "BOOM", "WALL", "DESTROYABLE_WALL", "DESTROYED_WALL", "MEAT_CHOPPER", "DEAD_MEAT_CHOPPER", "BOMB_BLAST_RADIUS_INCREASE", "BOMB_COUNT_INCREASE", "BOMB_REMOTE_CONTROL", "BOMB_IMMUNE", "NONE"];

const Element = {
  /// This is your Bomberman
  BOMBERMAN : '☺',             // this is what he usually looks like
  BOMB_BOMBERMAN : '☻',        // this is if he is sitting on own bomb
  DEAD_BOMBERMAN : 'Ѡ',        // oops, your Bomberman is dead (don't worry, he will appear somewhere in next move)
                               // you're getting -200 for each death

  /// this is other players Bombermans
  OTHER_BOMBERMAN : '♥',       // this is what other Bombermans looks like
  OTHER_BOMB_BOMBERMAN : '♠',  // this is if player just set the bomb
  OTHER_DEAD_BOMBERMAN : '♣',  // enemy corpse (it will disappear shortly, right on the next move)
                               // if you've done it you'll get +1000

  /// the bombs
  BOMB_TIMER_5 : '5',          // after bomberman set the bomb, the timer starts (5 tacts)
  BOMB_TIMER_4 : '4',          // this will blow up after 4 tacts
  BOMB_TIMER_3 : '3',          // this after 3
  BOMB_TIMER_2 : '2',          // two
  BOMB_TIMER_1 : '1',          // one
  BOOM : '҉',                  // Boom! this is what is bomb does, everything that is destroyable got destroyed

  /// walls
  WALL : '☼',                  // indestructible wall - it will not fall from bomb
  DESTROYABLE_WALL : '#',      // this wall could be blowed up
  DESTROYED_WALL : 'H',        // this is how broken wall looks like, it will dissapear on next move
                               // if it's you did it - you'll get +10 points.

  /// meatchoppers
  MEAT_CHOPPER : '&',          // this guys runs over the board randomly and gets in the way all the time
                               // if it will touch bomberman - it will die
                               // you'd better kill this piece of ... meat, you'll get +100 point for it
  DEAD_MEAT_CHOPPER : 'x',     // this is chopper corpse

  /// perks
  BOMB_BLAST_RADIUS_INCREASE : '+', // Bomb blast radius increase. Applicable only to new bombs. The perk is temporary.
  BOMB_COUNT_INCREASE : 'c',   // Increase available bombs count. Number of extra bombs can be set in settings. Temporary.
  BOMB_REMOTE_CONTROL : 'r',   // Bomb blast not by timer but by second act. Number of RC triggers is limited and can be set in settings.
  BOMB_IMMUNE : 'i',

  /// a void
  NONE : ' '                  // this is the only place where you can move your Bomberman
};

const mapping = {};
for (let i=0; i<alphabet.length; i++) {
  mapping[alphabet.charAt(i)] = Element[sprites[i]];
}

function decode(board) {
  return Array.from(board).map(c => mapping[c]).join("");
}

module.exports = decode