"use client";

import * as THREE from "three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree, extend, useLoader } from "@react-three/fiber";
import {
   useNoise,
   useFluid,
   useCoverTexture,
} from "@/packages/use-shader-fx/src";
import { FxMaterial } from "./FxMaterial";
import { Float, OrbitControls, useVideoTexture } from "@react-three/drei";

/*===============================================
# webglooの設計
- useFxResolverでhookを切り替える
===============================================*/

extend({ FxMaterial });

// ここに渡すstateでレンダリングを切り替える
const useFxResolver = (test: boolean) => {
   if (test) {
      return useNoise;
   } else {
      return useFluid;
   }
};

// const hooks = [useNoise, useNoise];

export const Playground = () => {
   const { size } = useThree();

   const funkun_mov = useVideoTexture("/FT_Ch02-comp.mp4", {
      width: 1280,
      height: 720,
   });

   const [gear, smoke] = useLoader(THREE.TextureLoader, [
      "/stickers/webp/sticker17.webp",
      "smoke.png",
   ]);

   const noise = useNoise({
      size,
      dpr: 0.2,
      scale: 0.01,
      // mixSrc: gear,
      // mixSrcResolution: new THREE.Vector2(512, 512),
      // mixSrcUv: 0.9,
      // mixSrcAlpha: 1,
      mixDst: gear,
      mixDstResolution: new THREE.Vector2(512, 512),
      mixDstUv: 0.2,
      mixDstAlpha: 1,
      mixDstColor: 0.5,
   });

   // const cover = useCoverTexture({
   //    size,
   //    dpr: 1,
   //    src: funkun_mov,
   //    textureResolution: new THREE.Vector2(1280, 720),
   //    // mixSrc: smoke,
   //    mixSrcResolution: new THREE.Vector2(512, 512),
   //    mixSrcUv: 0.12,
   //    mixSrcAlpha: 0.2,
   // });

   useFrame((state) => {
      // cover.render(state);
      // fluid.render(state);
      noise.render(state);
      // material.color = new THREE.Color(
      //    Math.sin(state.clock.getElapsedTime()),
      //    1,
      //    1
      // );
      // mesh.current!.rotation.x += 0.01;
      // mesh.current!.rotation.y += 0.01;
   });

   return (
      <>
         <mesh>
            <planeGeometry args={[2, 2]} />
            <fxMaterial u_fx={noise.texture} key={FxMaterial.key} />
         </mesh>
      </>
   );
};
