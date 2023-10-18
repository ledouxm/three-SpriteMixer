# three-sprite-mixer

This fork adds typesafety to SpriteMixer, along with an example of integration with R3F

### Mixing table to play sprite animations in Three.js

The aim is to make 2D animations in Three.js simple : load the texture including the frames of your animation, give the animation's parameters, and you get an extended THREE.Sprite object, that you can use as a normal Sprite object, but also animate with SpriteMixer's functions.

# Installation

```
pnpm install @three-sprite-mixer/core
```

# Usage

### Create an SpriteMixer and some actions :

```typescript
import { SpriteMixer } from "@three-sprite-mixer/core";

new THREE.TextureLoader().load("./spritesheet_2x10.png", (texture) => {
    spriteMixer = new SpriteMixer(texture, 10, 2, {
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

### Usage with React Three Fiber

#### Setup

```ts
import { SpriteMixer } from "@three-sprite-mixer/core";
import { extend } from "@react-three/fiber";

// Allow <spriteMixer /> to be used in JSX
extend({ SpriteMixer });

// Make typescript happy about it
declare global {
    namespace JSX {
        interface IntrinsicElements {
            spriteMixer: ReactThreeFiber.Object3DNode<
                SpriteMixer<any>,
                typeof SpriteMixer
            >;
        }
    }
}
```

#### Usage

```tsx
export const Demo = () => {
    const texture = useLoader(TextureLoader as any, "/spritesheet_2x10.png");

    // Type-safe api
    const ref = useRef<SpriteMixer<typeof actions>>();

    // Update the animation
    useFrame((_, delta) => ref.current?.update(delta));

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

    return <spriteMixer ref={ref} args={[texture, 10, 2, actions]} />;
};
```

### The texture including tiles must be in this format :

-   Frames go from left ro right and top to bottom
-   One texture can contain tiles for several actions
-   Some tiles can be empty
-   Each side of the texture must be power of 2, or browsers will resize it
    ![exemple of tiles texture](https://felixmariotto.s3.eu-west-3.amazonaws.com/character2.png)
