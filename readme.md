# Simple Dungeon Generator

A simple dungeon generator for javascript (typed) and the browser with only one dependency (for seeded random numbers).

Highly configurable, but with sensible defaults.

![GitHub release (with filter)](https://img.shields.io/github/v/release/Purukitto/simpleDungeonGenerator) ![GitHub issues](https://img.shields.io/github/issues/purukitto/simpleDungeonGenerator) ![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/purukitto/simpleDungeonGenerator/main.yml) [![npm](https://img.shields.io/npm/v/simpledungeongenerator)](https://www.npmjs.com/package/simpledungeongenerator) ![npm bundle size](https://img.shields.io/bundlephobia/min/simpledungeongenerator)

See the latest changelog [here](./CHANGELOG.md)

## Installation

### npm

```bash
npm install simpledungeongenerator
```

### bun

```bash
bun install simpledungeongenerator
```

### yarn

```bash
yarn add simpledungeongenerator
```

## Usage

### Javascript

```javascript
const { DungeonGenerator } = require("simpledungeongenerator");

const dungeon = new DungeonGenerator({
	width: 50,
	height: 50,
	minRoomSize: 5,
	maxRoomSize: 10,
	maxRooms: 10,
	seed: "MyProjectName",
});

dungeon.drawToConsole();
```

### Typescript

```typescript
import { DungeonGenerator } from "simpledungeongenerator";

const dungeon = new DungeonGenerator({
	width: 50,
	height: 50,
	minRoomSize: 5,
	maxRoomSize: 10,
	maxRooms: 10,
	seed: "MyProjectName",
});

dungeon.drawToConsole();
```

## Options

| Option         | Type   | Default      | Description                                               |
| -------------- | ------ | ------------ | --------------------------------------------------------- |
| seed           | string | "purukitto"  | Seed for the random number generator                      |
| maxH           | number | 50           | Maximum height of the dungeon                             |
| maxW           | number | 50           | Maximum width of the dungeon                              |
| type           | string | "Base"       | Type of the dungeon to generate (Currently has no effect) |
| roomTries      | number | 50           | Number of times to try to generate a room                 |
| extraRoomSize  | number | 0            | Extra size to add to the room                             |
| windingPercent | number | 0            | Percentage of the dungeon to be winding                   |
| tiles          | Object | defaultTiles | Tiles to use for the dungeon                              |
| startIndex     | number | 1            | Index to start the dungeon from                           |

## Properties

| Property | Type       | Description                              |
| -------- | ---------- | ---------------------------------------- |
| map      | string[][] | A 2D array representing the dungeon map. |
| rooms    | Room[]     | An array of rooms in the dungeon         |
| tiles    | Object     | The tiles used for the dungeon           |

## Methods

| Method          | Description                      |
| --------------- | -------------------------------- |
| drawToConsole() | Draws the dungeon to the console |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](./LICENSE.md)

## Acknowledgements

-   [seedrandom](https://github.com/davidbau/seedrandom) - Seedable random number generator
-   [Article](https://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/) - Fabulous article on dungeon generation
-   [changesets](https://github.com/changesets/changesets/tree/main) - Used for managing changelogs and releases
-   [tsup](https://github.com/egoist/tsup) - Used for bundling the library
