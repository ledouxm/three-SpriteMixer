import * as THREE from "three";
import { SpriteMixer } from "@three-sprite-mixer/core";

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

let renderer: THREE.Renderer = null;
let scene: THREE.Scene = null;
let camera: THREE.Camera = null;

let running: "right" | "left" = null;
let clock: THREE.Clock = null;

let spriteMixer: SpriteMixer<typeof actions> = null;

const actions = {
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
};

window.addEventListener("load", () => {
    init();
    loop();
});

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("green");

    camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 1, 50);
    camera.position.z = 10;
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#canvas"),
    });
    renderer.setSize(WIDTH, HEIGHT);

    clock = new THREE.Clock();

    var loader = new THREE.TextureLoader();

    // Load the spritesheet
    loader.load("./spritesheet_2x10.png", (texture) => {
        // spriteMixer is a THREE.Sprite, with an "api" property
        spriteMixer = new SpriteMixer(texture, 10, 2, actions);

        // You can listen to those events
        spriteMixer.on("finished", () => console.log("finished"));
        spriteMixer.on("loop", () => console.log("loop"));

        spriteMixer.scale.set(1.7, 2, 1);
        scene.add(spriteMixer);

        registerWindowFunctions();
    });
}

function loop() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);

    const delta = clock.getDelta();
    spriteMixer?.update(delta);
}

// Pass functions to window so they can be called from the DOM
function registerWindowFunctions() {
    window.onPlayOnce = () => {
        spriteMixer.api.runLeft.playOnce();
    };

    window.onPlayLoop = () => {
        spriteMixer.api.runLeft.playLoop();
    };

    window.onPauseNextEnd = () => {
        spriteMixer.api.runLeft.pauseNextEnd();
    };

    window.onPause = () => {
        spriteMixer.api.runLeft.pause();
    };

    window.onStop = () => {
        spriteMixer.api.runLeft.stop();
    };

    window.onResume = () => {
        spriteMixer.api.runLeft.resume();
    };

    window.runRight = () => {
        if (running != "right") {
            spriteMixer.api.runRight.playLoop();
            running = "right";
        }
    };

    window.runLeft = () => {
        if (running != "left") {
            spriteMixer.api.runLeft.playLoop();
            running = "left";
        }
    };

    window.stopRunning = () => {
        spriteMixer.api.runLeft.stop();

        if (running == "right") {
            spriteMixer.setFrame(9);
        } else {
            spriteMixer.setFrame(19);
        }

        running = undefined;
    };
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
