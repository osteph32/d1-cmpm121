# Minecraft XP Clicker

A Minecraft-themed incremental game built with TypeScript and Vite for CMPM 121’s D1 project. Click a grass block to earn XP, upgrade your pickaxe, and purchase farms that generate XP automatically.

**[Play the game](https://osteph32.github.io/d1-cmpm121/)**

Team: [osteph32](https://github.com/osteph32) and [1cyy21](https://github.com/1cyy21).

## How to play

- Click the grass block to earn XP.
- Spend XP on pickaxe upgrades to increase your XP per click.
- Purchase farms to earn XP without clicking.

| Farm          | Unlock requirement | Starting price | Production per farm | Price after purchase |
| ------------- | ------------------ | -------------- | ------------------- | -------------------- |
| Villager Farm | 150 lifetime XP    | 150 XP         | 1 XP/sec            | Increases by 50%     |
| Spawner Farm  | 3,000 lifetime XP  | 3,000 XP       | 5 XP/sec            | Doubles              |

Progress is not saved between sessions. Refreshing the page starts a new game.

## Run locally

Install Git and Deno 2.9.7, then run:

```sh
git clone https://github.com/osteph32/d1-cmpm121.git
cd d1-cmpm121
deno task setup
deno task dev
```

Open the local address printed in the terminal. The development server normally uses port 3000.

## Check, build, and preview

```sh
deno task fmt
deno task ci
deno task preview
```

- `deno task fmt` formats the project.
- `deno task ci` checks formatting, lint, and TypeScript.
- `deno task preview` serves the most recent production build locally.

Preview does not rebuild or publish the game. Use the printed preview address. GitHub Actions runs checks and deploys the production build to GitHub Pages when changes are pushed to `main`.

## Code organization

| File                                                                                | Responsibility                                                                                     |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [src/main.ts](https://github.com/osteph32/d1-cmpm121/blob/main/src/main.ts)         | Game state, input handlers, purchases, production loop, sound playback, and interface construction |
| [src/pickaxes.ts](https://github.com/osteph32/d1-cmpm121/blob/main/src/pickaxes.ts) | Pickaxe definitions: names, prices, click strength, images, and cursor images                      |
| [src/farms.ts](https://github.com/osteph32/d1-cmpm121/blob/main/src/farms.ts)       | Farm definitions: names, prices, production rates, images, and quantities                          |
| [src/style.css](https://github.com/osteph32/d1-cmpm121/blob/main/src/style.css)     | Layout, panels, and button styling                                                                 |
| [src/assets](https://github.com/osteph32/d1-cmpm121/tree/main/src/assets)           | Images, cursor images, and sound effects                                                           |

## Meaningful design revision

The original pickaxe implementation used a `stoneOwned` flag, a separate stone price, and conditional choices for the pickaxe name, image, cursor, and click strength. We replaced those item choices with a `Pickaxe` array and a `currentPickaxeIndex`. It now reads the current and next entries to handle clicking, purchasing, and display updates.

- [Refactor: separate pickaxe data and use shared progression logic](https://github.com/osteph32/d1-cmpm121/commit/3d3cb3e7a8583c341ef3050a76aa8cc6cd852008)

## Credits

- Minecraft PNG assets were downloaded from [Minecraft Wiki](https://minecraft.wiki/).
- XP chime, villager, zombie, spider, and skeleton sound effects were downloaded from [Myinstants](https://www.myinstants.com/en/index/us/).
- Starter code provided from [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da)