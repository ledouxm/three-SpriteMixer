import * as THREE from "three";
import { EventEmitter } from "./eventEmitter";
import { makeApi } from "./actions";
import type { ActionNames, Actions, Action, ActionApi } from "./types";

export class ActionSprite<E> extends THREE.Sprite {
    currentTile = 0;
    paused = true;
    currentDisplayTime = 0;
    currentAction: ActionNames<E> = null;
    api: {
        [key in keyof E]: ActionApi;
    };

    clock = new THREE.Clock();
    eventEmitter = new EventEmitter();

    constructor(
        texture: THREE.Texture,
        public columns: number,
        public rows: number,
        public actions: Actions<E>
    ) {
        super(new THREE.SpriteMaterial({ map: texture, color: "#FFF" }));
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1 / columns, 1 / rows);

        this.api = Object.keys(actions).reduce((acc, key, index) => {
            return {
                ...acc,
                [key]: makeApi(
                    actions[key as keyof Actions<E>],
                    this,
                    key as keyof Actions<E>
                ),
            };
        }, {} as any);
    }

    on(type: "loop" | "finished", listener: (action: Action) => void) {
        this.eventEmitter.on(type, listener);

        return () => this.eventEmitter.off(type, listener);
    }

    update(delta: number) {
        const action = this.actions[this.currentAction];
        if (!action) return;
        if (this.paused) return;

        this.currentDisplayTime += delta * 1000;

        if (this.currentDisplayTime > action.tileDisplayDuration) {
            this.currentDisplayTime = 0;
            this.currentTile++;
            if (this.currentTile > action.indexEnd) {
                if (action.mustLoop) {
                    this.currentTile = action.indexStart;

                    this.eventEmitter.dispatch("loop", { action });
                } else {
                    this.currentTile = action.clampWhenFinished
                        ? action.indexEnd
                        : action.indexStart;

                    if (action.hideWhenFinished) this.visible = false;
                    this.paused = true;

                    this.eventEmitter.dispatch("finished", { action });
                }
            }
        }

        this.offsetTexture();
    }

    offsetTexture() {
        this.material.map!.offset.x = this.getColumn() / this.columns;
        this.material.map!.offset.y =
            (this.rows - this.getRow() - 1) / this.rows;
    }

    setFrame(frameID: number) {
        this.paused = true;
        this.currentTile = frameID;
        this.offsetTexture();
    }

    getRow() {
        return Math.floor(this.currentTile / this.columns);
    }

    getColumn() {
        return this.currentTile % this.columns;
    }
}
