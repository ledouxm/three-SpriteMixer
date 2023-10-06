import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Demo } from "./Demo";
import { Suspense } from "react";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
    <>
        <Leva />
        <Canvas
            shadows
            orthographic
            camera={{
                zoom: 100,
            }}
        >
            <Suspense fallback={null}>
                <Demo />
            </Suspense>
        </Canvas>
    </>
);
