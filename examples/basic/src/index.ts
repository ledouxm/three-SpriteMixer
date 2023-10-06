import * as THREE from "three";
import { makeActions, ActionSprite } from "@three-sprite-mixer/core";

const store: {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  clock: THREE.Clock;
  delta: number;
  actionSprite: ActionSprite<AppActions>;
  running: string;
  actions: { [key: string]: any };
} = {
  actions: {},
} as any;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

window.addEventListener("load", () => {
  init();
  loop();
});

const actions = makeActions({
  runLeft: {
    indexEnd: 18,
    indexStart: 10,
    tileDisplayDuration: 40,
    mustLoop: true,
    clampWhenFinished: false,
    hideWhenFinished: false,
  },
  runRight: {
    indexEnd: 8,
    indexStart: 0,
    tileDisplayDuration: 40,
    mustLoop: true,
  },
});
type AppActions = typeof actions;

function init() {
  store.scene = new THREE.Scene();
  store.scene.background = new THREE.Color("green");

  store.camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 50);
  store.camera.position.z = 10;
  store.camera.lookAt(0, 0, 0);

  store.renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
  });
  store.renderer.setSize(WIDTH, HEIGHT);

  store.clock = new THREE.Clock();

  var loader = new THREE.TextureLoader();

  loader.load("./spritesheet_2x10.png", (texture) => {
    store.actionSprite = new ActionSprite(texture, 10, 2, actions);
    store.actionSprite.on("finished", () => console.log("finished"));
    store.actionSprite.on("loop", () => console.log("loop"));

    store.actionSprite.scale.set(1.7, 2, 1);
    registerWindowFunctions();
    store.scene.add(store.actionSprite);
  });
}

function loop() {
  requestAnimationFrame(loop);
  store.renderer.render(store.scene, store.camera);

  store.delta = store.clock.getDelta();
  store.actionSprite?.update(store.delta);
}

declare global {
  interface Window {
    onPlayOnce: () => void;
    onPlayLoop: () => void;
    onPauseNextEnd: () => void;

    onPause: () => void;
    onStop: () => void;
    onResume: () => void;

    runRight: () => void;
    runLeft: () => void;
    stopRunning: () => void;
  }
}

function registerWindowFunctions() {
  window.onPlayOnce = () => {
    store.actionSprite.api.runLeft.playOnce();
  };

  window.onPlayLoop = () => {
    store.actionSprite.api.runLeft.playLoop();
  };

  window.onPauseNextEnd = () => {
    store.actionSprite.api.runLeft.pauseNextEnd();
  };

  window.onPause = () => {
    store.actionSprite.api.runLeft.pause();
  };

  window.onStop = () => {
    store.actionSprite.api.runLeft.stop();
  };

  window.onResume = () => {
    store.actionSprite.api.runLeft.resume();
  };

  window.runRight = () => {
    if (store.running != "right") {
      store.actionSprite.api.runRight.playLoop();
      store.running = "right";
    }
  };

  window.runLeft = () => {
    if (store.running != "left") {
      store.actionSprite.api.runLeft.playLoop();
      store.running = "left";
    }
  };

  window.stopRunning = () => {
    store.actionSprite.api.runLeft.stop();

    if (store.running == "right") {
      store.actionSprite.setFrame(9);
    } else {
      store.actionSprite.setFrame(19);
    }

    store.running = undefined;
  };
}
