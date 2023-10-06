import { ActionSprite } from "./ActionSprite";
import type { Action, ActionNames, Actions } from "./types";

export const makeActions = <ActionDef extends Actions<any>>(
  e: ActionDef
): Actions<ActionDef> => {
  return e;
};

export const makeApi = <E>(
  action: Action,
  sprite: ActionSprite<E>,
  name: ActionNames<E>
) => {
  function playOnce() {
    action.mustLoop = false;
    sprite.currentAction = name;
    sprite.currentTile = action.indexStart;
    sprite.offsetTexture();
    sprite.paused = false;
    sprite.visible = true;
  }

  function resume() {
    if (
      sprite.currentTile > action.indexStart &&
      sprite.currentTile < action.indexEnd
    ) {
      sprite.currentTile = action.indexStart;
    }
    sprite.paused = false;
    sprite.visible = true;
  }

  function playLoop() {
    action.mustLoop = true;
    sprite.currentAction = name;
    sprite.currentTile = action.indexStart;
    sprite.offsetTexture();
    sprite.paused = false;
    sprite.visible = true;
  }

  function pauseNextEnd() {
    action.mustLoop = false;
  }

  function pause() {
    sprite.paused = true;
  }

  function stop() {
    sprite.currentDisplayTime = 0;
    sprite.currentTile = action.indexStart;
    sprite.paused = true;
    if (action.hideWhenFinished == true) {
      sprite.visible = false;
    }
    sprite.offsetTexture();
  }

  return {
    playOnce,
    playLoop,
    pauseNextEnd,
    pause,
    stop,
    resume,
  };
};
