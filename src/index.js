import "./index.scss";

import { createButton, createElement } from "./utils/html-utils";
import { initGameData, newGame } from "./game-logic";
import { getTranslation, TranslationKey } from "./translations";
import { createDialog } from "./components/dialog";
import { PubSubEvent, pubSubService } from "./utils/pub-sub-service";
import { getRandomItem } from "./utils/array-utils";
import { splitEmojis } from "./utils/emojis/emoji-util";
import { phobias } from "./utils/emojis/sets";

let configDialog;

function onNewGameClick() {
  newGame();
  pubSubService.publish(PubSubEvent.NEW_GAME);
}

function openConfig() {
  if (!configDialog) {
    configDialog = createDialog(
      createElement({ text: "Config :-)" }),
      undefined,
      "Title :-)",
    );
  }

  configDialog.open();
}

function init() {
  initGameData();

  const header = createElement({
    tag: "header",
  });
  header.append(
    createButton({ text: "🔄", onClick: onNewGameClick, iconBtn: true }),
  );
  header.append(
    createElement({
      tag: "h1",
      text: `${getTranslation(TranslationKey.WELCOME)}`,
    }),
  );
  header.append(
    createButton({ text: "⚙️", onClick: openConfig, iconBtn: true }),
  );

  document.body.append(header);

  const gameField = createElement({
    cssClass: "game-field",
  });

  document.body.append(gameField);

  const gameFieldData = getGameFieldData();

  gameFieldData.forEach((row, i) => {
    const rowElem = createElement({
      cssClass: "row",
    });
    gameField.append(rowElem);

    row.forEach((cell, j) => {
      const cellElem = createElement({
        cssClass: "cell",
        text: cell,
        onClick: (event) => {
          event.target.classList.toggle("selected");
        },
      });
      rowElem.append(cellElem);
    });
  });
}

function getGameFieldData() {
  const gameField = [];
  const rows = 13;
  const cols = 13;
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(Math.random() > 0.5 ? getRandomEmoji() : "");
    }
    gameField.push(row);
  }

  return gameField;
}

function getRandomEmoji() {
  return getRandomItem(splitEmojis(phobias));
}

// INIT
init();
