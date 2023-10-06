# three-SpriteMixer

Example : https://felixmariotto.github.io/from_indexed_texture

### Mixing table to play sprite animations in Three.js

The aim is to make 2D animations in Three.js simple : load the texture including the frames of your animation, give the animation's parameters, and you get an extended THREE.Sprite object, that you can use as a normal Sprite object, but also animate with SpriteMixer's functions.

# How to use

### Create an SpriteMixer and some actions :

```typescript
import { makeActions, SpriteMixer } from "@three-sprite-mixer";

// Declare actions for type-safety
const actions = makeActions({
    runLeft: {
        indexStart: 10,
        indexEnd: 18,
        tileDisplayDuration: 40,
        mustLoop: true,
        // If set to true, animation will stop on last frame
        // else animation will stop on first frame
        clampWhenFinished: false,
        // If set to true, sprite visibility will be set to false
        hideWhenFinished: false,
    },
    runRight: {
        indexStart: 0,
        indexEnd: 8,
        tileDisplayDuration: 40,
        mustLoop: true,
    },
});

new THREE.TextureLoader().load("./spritesheet_2x10.png", (texture) => {
    spriteMixer = new SpriteMixer(texture, 10, 2, actions);

    scene.add(spriteMixer);
});
```

### Update in your animation loop:

```typescript
function loop() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);

    const delta = clock.getDelta();

    spriteMixer.update(delta);
}
```

### Animate your Actions :

```typescript
// Make the sprite visible and play the action once
spriteMixer.api.runLeft.playOnce();

// Make the sprite visible and play the sprite animation in a loop
spriteMixer.api.runLeft.playLoop();

// stop the action and reset
spriteMixer.api.runLeft.stop();

// pause the action without reset
spriteMixer.api.runLeft.pause();

// let the action finish its current loop, then stop it
spriteMixer.api.runLeft.pauseNextEnd();

// resume the action if it was paused before its end
spriteMixer.api.runLeft.resume();
```

### Listen for animation events :

```javascript
spriteMixer.on("finished", function (action) {
    console.log("finished", action);
});

spriteMixer.on("loop", function (action) {
    console.log("loop", action);
});
```

### Set a frame manually (so you can use spriteMixer as a table of indexed textures) :

```typescript
spriteMixer.setFrame(index);
```

Set manually a frame of the animation. Frame indexing starts at 0.

### The texture including tiles must be in this format :

-   Frames go from left ro right and top to bottom
-   One texture can contain tiles for several actions
-   Some tiles can be empty
-   Each side of the texture must be power of 2, or browsers will resize it
    ![exemple of tiles texture](https://felixmariotto.s3.eu-west-3.amazonaws.com/character2.png)
