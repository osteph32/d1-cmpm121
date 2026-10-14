// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import grassBlockUrl from "./assets/grass-block.png?no-inline";
import xpIconUrl from "./assets/xp.png?no-inline";
import { pickaxes } from "./pickaxes.ts";
import { farms } from "./farms.ts";
import xpChimeUrl from "./assets/xp_chime.mp3?no-inline";
import villagerSoundUrl from "./assets/villager.mp3?no-inline";
import zombieSoundUrl from "./assets/zombie.mp3?no-inline";
import spiderSoundUrl from "./assets/spider.mp3?no-inline";
import skeletonSoundUrl from "./assets/skeleton.mp3?no-inline";
import grassSoundUrl from "./assets/grassSound.mp3?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");
heading.textContent = "Minecraft XP Clicker";

// Player XP and progression
let xp = 0;
let totalXp = 0;
let currentPickaxeIndex = 0;

const xpDisplay = document.createElement("p");
xpDisplay.textContent = `XP: ${xp}`;

const image = document.createElement("img");
image.src = grassBlockUrl;
image.alt = "Grass block";
image.width = 180;
image.height = 180;

const clickPowerDisplay = document.createElement("p");

// Buttons:
// Main button
const mineButton = document.createElement("button");
mineButton.type = "button";
mineButton.setAttribute("aria-label", "Mine grass block for XP");
mineButton.append(image);

// Upgrade Pickaxe
const upgradePickaxeButton = document.createElement("button");
upgradePickaxeButton.type = "button";

// Upgrade Villager Farm
const upgradeFarmVButton = document.createElement("button");
upgradeFarmVButton.type = "button";
upgradeFarmVButton.style.display = "none"; // Initially hidden

// Upgrade Spawner Farm
const upgradeFarmSButton = document.createElement("button");
upgradeFarmSButton.type = "button";
upgradeFarmSButton.style.display = "none"; // Initially hidden

//========//

function playSound(url: string) {
  const sound = new Audio(url);
  sound.volume = 0.5;

  void sound.play().catch((error) => {
    console.warn("Could not play sound:", error);
  });
}

function playSoundTwo(url: string) {
  const sound = new Audio(url);
  sound.volume = 0.02;

  void sound.play().catch((error) => {
    console.warn("Could not play sound:", error);
  });
}

const mobSoundUrls = [
  zombieSoundUrl,
  spiderSoundUrl,
  skeletonSoundUrl,
];

let nextMobSoundIndex = 0;

function playNextMobSound() {
  playSound(mobSoundUrls[nextMobSoundIndex]!);
  nextMobSoundIndex = (nextMobSoundIndex + 1) % mobSoundUrls.length;
}

//========//

const pickaxeImage = document.createElement("img");
pickaxeImage.width = 72;
pickaxeImage.height = 72;

const farmVContainer = document.createElement("div");
const farmSContainer = document.createElement("div");

function addFarmImage(container: HTMLDivElement, url: string, alt: string) {
  const farmImage = document.createElement("img");
  farmImage.src = url;
  farmImage.alt = alt;
  farmImage.width = 72;
  farmImage.height = 72;
  container.appendChild(farmImage);
}

const productionDisplay = document.createElement("p");
const farmVStats = document.createElement("p");
const farmSStats = document.createElement("p");

function updateDisplay() {
  const currentPickaxe = pickaxes[currentPickaxeIndex]!;
  const nextPickaxe = pickaxes[currentPickaxeIndex + 1];
  const farmV = farms[0];
  const farmS = farms[1];

  xpDisplay.textContent = `XP: ${Math.floor(xp)}`;

  clickPowerDisplay.textContent =
    `${currentPickaxe.name} | XP per click: ${currentPickaxe.xpPerClick}`;

  // Only change the image and cursor when the equipped pickaxe changes.
  if (pickaxeImage.getAttribute("src") !== currentPickaxe.imageUrl) {
    pickaxeImage.src = currentPickaxe.imageUrl;
    pickaxeImage.alt = currentPickaxe.name;
    mineButton.style.cursor =
      `url("${currentPickaxe.cursorUrl}") 16 16, pointer`;
  }

  upgradePickaxeButton.disabled = !nextPickaxe || xp < nextPickaxe.cost;
  upgradePickaxeButton.textContent = nextPickaxe
    ? `Buy ${nextPickaxe.name} - ${nextPickaxe.cost} XP`
    : "All pickaxes purchased";

  productionDisplay.textContent =
    `Automatic production: ${getXpPerSecond()} XP/sec`;

  const villagerUnlocked = totalXp >= 150;
  const spawnerUnlocked = totalXp >= 3000;

  farmVStats.textContent =
    `${farmV.name}: ${farmV.quantity} owned | ${farmV.xpPerSecond} XP/sec each`;

  farmSStats.textContent =
    `${farmS.name}: ${farmS.quantity} owned | ${farmS.xpPerSecond} XP/sec each`;

  upgradeFarmVButton.style.display = "block";
  upgradeFarmVButton.disabled = !villagerUnlocked || xp < farmV.cost;
  upgradeFarmVButton.textContent = villagerUnlocked
    ? `Buy ${farmV.name} | ${farmV.cost} XP`
    : "Locked";

  upgradeFarmSButton.style.display = "block";
  upgradeFarmSButton.disabled = !spawnerUnlocked || xp < farmS.cost;
  upgradeFarmSButton.textContent = spawnerUnlocked
    ? `Buy ${farmS.name} | ${farmS.cost} XP`
    : "Locked";
}

// ===== //

// Automatically earn XP from farms every second
function getXpPerSecond() {
  return farms.reduce(
    (total, farm) => total + farm.xpPerSecond * farm.quantity,
    0,
  );
}

let lastProductionTime = performance.now();

function updateProduction() {
  const now = performance.now();
  const elapsedSeconds = (now - lastProductionTime) / 1000;
  lastProductionTime = now;

  const gained = getXpPerSecond() * elapsedSeconds;
  xp += gained;
  totalXp += gained;
}

function updateGame() {
  updateProduction();
  updateDisplay();
  requestAnimationFrame(updateGame);
}

requestAnimationFrame(updateGame);

// ===== //

// Initial display update
updateDisplay();

// Set initial cursor for the mine button
mineButton.style.cursor = `url("${
  pickaxes[currentPickaxeIndex].cursorUrl
}") 16 16, pointer`;

// Earn XP and update display on button click
mineButton.addEventListener("click", () => {
  const currentPickaxe = pickaxes[currentPickaxeIndex]!;
  xp += currentPickaxe.xpPerClick;
  totalXp += currentPickaxe.xpPerClick;
  updateDisplay();
  playSoundTwo(grassSoundUrl);
});

// Upgrade pickaxe button click event
upgradePickaxeButton.addEventListener("click", () => {
  const nextPickaxe = pickaxes[currentPickaxeIndex + 1];

  if (!nextPickaxe || xp < nextPickaxe.cost) {
    return;
  }

  xp -= nextPickaxe.cost;
  currentPickaxeIndex += 1;
  playSound(xpChimeUrl);

  updateDisplay();
});

// Upgrade farm buttons click events
upgradeFarmVButton.addEventListener("click", () => {
  updateProduction();

  const farmV = farms[0];
  if (totalXp < 150 || xp < farmV.cost) {
    updateDisplay();
    return;
  }

  xp -= farmV.cost;
  farmV.quantity += 1;
  playSound(villagerSoundUrl);
  farmV.cost = Math.ceil(farmV.cost * 1.5);

  addFarmImage(farmVContainer, farmV.imageUrl, farmV.name);
  updateDisplay();
});

upgradeFarmSButton.addEventListener("click", () => {
  updateProduction();

  const farmS = farms[1];
  if (totalXp < 3000 || xp < farmS.cost) {
    updateDisplay();
    return;
  }

  xp -= farmS.cost;
  farmS.quantity += 1;
  playNextMobSound();
  farmS.cost = Math.ceil(farmS.cost * 2);

  addFarmImage(farmSContainer, farmS.imageUrl, farmS.name);
  updateDisplay();
});

// ===== //

// Layout and appearance
heading.className = "game-title";
pickaxeImage.className = "equipped-pickaxe";
pickaxeImage.draggable = false;

mineButton.className = "mine-button";
image.draggable = false;

xpDisplay.className = "xp-counter";
productionDisplay.className = "production-counter";
farmVContainer.className = "farm-icons";
farmSContainer.className = "farm-icons";

function createPanel(title: string) {
  const panel = document.createElement("section");
  panel.className = "panel";

  const panelHeading = document.createElement("h2");
  panelHeading.textContent = title;

  panel.append(panelHeading);
  return panel;
}

// XP Bottle
const xpIcon = document.createElement("img");
xpIcon.src = xpIconUrl;
xpIcon.alt = "";
xpIcon.width = 32;
xpIcon.height = 32;
xpIcon.draggable = false;

const xpRow = document.createElement("div");
xpRow.className = "xp-row";
xpRow.append(xpIcon, xpDisplay);

// Left: equipped pickaxe and player information
const pickaxePanel = createPanel("Your pickaxe");
pickaxePanel.classList.add("pickaxe-panel");
pickaxePanel.append(
  pickaxeImage,
  xpRow,
  clickPowerDisplay,
  upgradePickaxeButton,
);

// Center: the main clickable block
const miningArea = document.createElement("div");
miningArea.className = "mining-area";

const mineHint = document.createElement("p");
mineHint.className = "mine-hint";
mineHint.textContent = "Click the grass block to earn XP";

miningArea.append(mineButton, mineHint);

// Right: farm information and purchases
const farmGuide = createPanel("Farm Guide");
farmGuide.classList.add("farm-guide");

const villagerGuide = document.createElement("p");
villagerGuide.textContent = `${
  farms[0].name
}: unlocks at 150 lifetime XP. Each produces ${
  farms[0].xpPerSecond
} XP/sec. Prices rise by 50% after each purchase.`;

const spawnerGuide = document.createElement("p");
spawnerGuide.textContent = `${
  farms[1].name
}: unlocks at 3,000 lifetime XP. Each produces ${
  farms[1].xpPerSecond
} XP/sec. Prices double after each purchase.`;

const lifetimeHint = document.createElement("p");
lifetimeHint.textContent = "Spending XP does not reduce your lifetime XP.";

farmGuide.append(villagerGuide, spawnerGuide, lifetimeHint);

const farmShop = createPanel("Your farms");

const villagerCard = document.createElement("div");
villagerCard.className = "farm-card";
villagerCard.append(
  farmVStats,
  farmVContainer,
  upgradeFarmVButton,
);

const spawnerCard = document.createElement("div");
spawnerCard.className = "farm-card";
spawnerCard.append(
  farmSStats,
  farmSContainer,
  upgradeFarmSButton,
);

farmShop.append(productionDisplay, villagerCard, spawnerCard);

const farmColumn = document.createElement("div");
farmColumn.className = "farm-column";
farmColumn.append(farmShop);

// Assemble the three columns
const gameLayout = document.createElement("div");
gameLayout.className = "game-layout";
gameLayout.append(pickaxePanel, miningArea, farmColumn);

app.append(heading, gameLayout, farmGuide);
updateDisplay();
