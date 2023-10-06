import {
    ReactThreeFiber,
    extend,
    useFrame,
    useLoader,
} from "@react-three/fiber";
import { SpriteMixer, makeActions } from "@three-sprite-mixer/core";
import { useMemo, useRef } from "react";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import { button, useControls } from "leva";

export const Demo = () => {
    const texture = useLoader(TextureLoader as any, "/spritesheet_2x10.png");

    const actions = useMemo(
        () =>
            // Action definitions for type safety
            makeActions({
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
            }),
        []
    );

    // Type-safe api
    const ref = useRef<SpriteMixer<typeof actions>>();

    // UI
    useControls({
        playLoop: button(() => ref.current.api.runLeft.playLoop()),
        playOnce: button(() => ref.current.api.runLeft.playOnce()),
        pauseNextEnd: button(() => ref.current.api.runLeft.pauseNextEnd()),
        pause: button(() => ref.current.api.runLeft.pause()),
        stop: button(() => ref.current.api.runLeft.stop()),
        resume: button(() => ref.current.api.runLeft.resume()),
    });

    // Update the animation
    useFrame((_, delta) => ref.current?.update(delta));

    return <spriteMixer ref={ref} args={[texture, 10, 2, actions]} />;
};

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
