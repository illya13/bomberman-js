# Bomberman JS
Set of utility scripts to collect and normalize Bomberman raw data.
Please check `src` folder for the details.

- [src/index.js](src/index.js) - collect raw data
- [src/normalize.js](src/normalize.js) - normalize the data for per-player format
- [src/replay.js](src/replay.js) - show game boards for a selected player
- [src/enrich.js](src/enrich.js) - enrich state with `action`, `reward`, `done` and `bombs`, `perks?`
- [src/export.js](src/export.js) - export data to a json
 
 
## Install and Run
 ```
npm install

node src/replay.js
```
Most original scripts do use `MongoDB`. So consider refactoring for your needs. 
 
 
## Raw screen data
[google drive](https://drive.google.com/drive/folders/1GBYH9hBdGEIpRlbTvMJnGYgd4E9KasqX?usp=sharing)
- boards.zip [boards.raw] - how the data was initially captured
- enriched.zip [<players>.raw] - enriched data, per player, enriched with the following: 
```javascript
{
  done, reward, action, step,
  bombs: {},
  perks: {
    'bomb_blast_radius_increase',
    'bomb_count_increase',
    'bomb_immune'
  }
}
```

More info:
- each row - another board data from the server with all rooms in `json`  
- The boards itself are in `screen`-format so has to be decoded. 
- Please check [lib.human](https://github.com/illya13/bomberman-js/blob/master/src/lib.js#L18), [src/settings.js](src/settings.js) and [src/lib.js](src/lib.js).
 
 
## Other bots repos
- [https://github.com/avida/bomberman](https://github.com/avida/bomberman)
- [https://github.com/SqrTT/bomber](https://github.com/SqrTT/bomber)
- [https://github.com/SashaPshenychniy/bomberman2020](https://github.com/SashaPshenychniy/bomberman2020)
 
 
## Original rules
... UKR, clickable

<img src="https://raw.githubusercontent.com/illya13/bomberman-js/master/rules_v4_2.png" alt="Rules" width="50"/>

