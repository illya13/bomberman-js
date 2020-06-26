# Bomberman JS

Set of utility scripts to collect and normalize Bomberman raw data.
Please check `src` folder for the details.

- [src/index.js](src/index.js) - collect raw data
- [src/normalize.js](src/normalize.js) - normalize the data for per-player format
- [src/replay.js](src/replay.js) - show game boards for a selected players
- [src/export.js](src/export.js) - export data to a json
 
 ## Raw screen data
 [google drive](https://drive.google.com/drive/folders/1GBYH9hBdGEIpRlbTvMJnGYgd4E9KasqX?usp=sharing)
 
 - The boards itself are in `screen`-format so has to be decoded. 
 - Please check [lib.human](https://github.com/illya13/bomberman-js/blob/master/src/lib.js#L18), [src/settings.js](src/settings.js) and [src/lib.js](src/lib.js).
    