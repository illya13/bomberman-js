const player = 'rammffc1xl9980pn9z3o';

const settings = {
  server: {
    user: player,
    ws: 'wss://botchallenge.cloud.epam.com/codenjoy-contest/screen-ws?user=' + player,
    screen: '{"name":"getScreen","allPlayersScreen":true,"players":["' + player + '"],"gameName":"bomberman"}',
    intervals: {
      ping: 5000,
      heartbeat: 11000,
      round: 500
    }
  },

  game: {
    alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    sprites: [
      "bomberman", "bomb_bomberman", "dead_bomberman", "other_bomberman", "other_bomb_bomberman", "other_dead_bomberman", "bomb_timer_5", "bomb_timer_4", "bomb_timer_3", "bomb_timer_2", "bomb_timer_1", "boom", "wall", "destroyable_wall", "destroyed_wall", "meat_chopper", "dead_meat_chopper", "bomb_blast_radius_increase", "bomb_count_increase", "bomb_remote_control", "bomb_immune", "none"],
    elements: {
      /// This is your Bomberman
      BOMBERMAN: '☺',             // this is what he usually looks like
      BOMB_BOMBERMAN: '☻',        // this is if he is sitting on own bomb
      DEAD_BOMBERMAN: 'Ѡ',        // oops, your Bomberman is dead (don't worry, he will appear somewhere in next move)
                                  // you're getting -200 for each death

      /// this is other players Bombermans
      OTHER_BOMBERMAN: '♥',       // this is what other Bombermans looks like
      OTHER_BOMB_BOMBERMAN: '♠',  // this is if player just set the bomb
      OTHER_DEAD_BOMBERMAN: '♣',  // enemy corpse (it will disappear shortly, right on the next move)
                                  // if you've done it you'll get +1000

      /// the bombs
      BOMB_TIMER_5: '5',          // after bomberman set the bomb, the timer starts (5 tacts)
      BOMB_TIMER_4: '4',          // this will blow up after 4 tacts
      BOMB_TIMER_3: '3',          // this after 3
      BOMB_TIMER_2: '2',          // two
      BOMB_TIMER_1: '1',          // one
      BOOM: '҉',                  // Boom! this is what is bomb does, everything that is destroyable got destroyed

      /// walls
      WALL: '☼',                  // indestructible wall - it will not fall from bomb
      DESTROYABLE_WALL: '#',      // this wall could be blowed up
      DESTROYED_WALL: 'H',        // this is how broken wall looks like, it will dissapear on next move
                                  // if it's you did it - you'll get +10 points.

      /// meatchoppers
      MEAT_CHOPPER: '&',          // this guys runs over the board randomly and gets in the way all the time
                                  // if it will touch bomberman - it will die
                                  // you'd better kill this piece of ... meat, you'll get +100 point for it
      DEAD_MEAT_CHOPPER: 'x',     // this is chopper corpse

      /// perks
      BOMB_BLAST_RADIUS_INCREASE: '+', // Bomb blast radius increase. Applicable only to new bombs. The perk is temporary.
      BOMB_COUNT_INCREASE: 'c',   // Increase available bombs count. Number of extra bombs can be set in settings. Temporary.
      BOMB_REMOTE_CONTROL: 'r',   // Bomb blast not by timer but by second act. Number of RC triggers is limited and can be set in settings.
      BOMB_IMMUNE: 'i',

      /// a void
      NONE: ' '                  // this is the only place where you can move your Bomberman
    },
    settings: {
      '2020-06-15': {
        roundsPerMatch: 1,
        minTicksForWin: 1,
        perksDropRatio: 20,
        perksPickTimeout: 5,
        perksBombBlastRadiusIncrease: 2,
        perksBombCountIncrease: 3,
        perksBombCountEffectTimeout: 10,
        perksBombImmuneEffectTimeout: 10,
        perksNumberOfBombRemoteControl: 3,
        perksBombBlastRadiusIncreaseEffectTimeout: 10,
        roundsEnabled: true,
        semifinalTimeout: 900,
        semifinalPercentage: true,
        semifinalLimit: 50,
        semifinalEnabled: false,
        semifinalResetBoard: true,
        semifinalShuffleBoard: true,
        multiple: false,
        playersPerRoom: 5,
        killWallScore: 1,
        killMeatChopperScore: 3,
        killOtherHeroScore: 10,
        yourHeroesDeathPenalty: 2,
        winRoundScore: 15,
        bombsCount: 1,
        bombPower: 3,
        boardSize: 23,
        destoryWallCount: 52,
        meetChoppersCount: 5,
        timePerRound: 300,
        timeForWinner: 1,
        timeBeforeStartRound: 5
      },
      '2020-06-22': {
        roundsPerMatch: 1,
        minTicksForWin: 1,
        perksDropRatio: 20,
        perksPickTimeout: 5,
        perksBombBlastRadiusIncrease: 2,
        perksBombCountIncrease: 4,
        perksBombCountEffectTimeout: 30,
        perksBombImmuneEffectTimeout: 30,
        perksNumberOfBombRemoteControl: 3,
        perksBombBlastRadiusIncreaseEffectTimeout: 30,
        roundsEnabled: true,
        semifinalTimeout: 900,
        semifinalPercentage: true,
        semifinalLimit: 50,
        semifinalEnabled: false,
        semifinalResetBoard: true,
        semifinalShuffleBoard: true,
        multiple: false,
        playersPerRoom: 5,
        killWallScore: 1,
        killMeatChopperScore: 10,
        killOtherHeroScore: 20,
        yourHeroesDeathPenalty: 30,
        winRoundScore: 30,
        bombsCount: 1,
        bombPower: 3,
        boardSize: 23,
        destoryWallCount: 52,
        meetChoppersCount: 5,
        timePerRound: 200,
        timeForWinner: 1,
        timeBeforeStartRound: 5
      }
    }
  },

  mongo: {
    url: 'mongodb://localhost:27017',
    dbName: 'bomberman',
    insert: {
      w: 'majority',
      wtimeout: 500,
      serializeFunctions: true,
      forceServerObjectId: true
    }
  }
};

module.exports = settings;