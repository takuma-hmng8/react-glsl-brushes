import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { RootState, Size } from "@react-three/fiber";
import { useMesh } from "./useMesh";

import { useCamera } from "../../utils/useCamera";
import { useSingleFBO } from "../../utils/useSingleFBO";
import { useDoubleFBO } from "../../utils/useDoubleFBO";
import { setUniform } from "../../utils/setUniforms";
import { useParams } from "../../utils/useParams";

import type { HooksReturn } from "../types";

export type SimpleBlurParams = {
   /** Make this texture blur , Default:new THREE.Texture() */
   texture: THREE.Texture;
   /** blurSize, default:3 */
   blurSize: number;
   /** blurPower, affects performance default:5 */
   blurPower: number;
};

export type SimpleBlurObject = {
   scene: THREE.Scene;
   material: THREE.Material;
   camera: THREE.Camera;
   renderTarget: THREE.WebGLRenderTarget;
};

export const SIMPLEBLUR_PARAMS: SimpleBlurParams = {
   texture: new THREE.Texture(),
   blurSize: 3,
   blurPower: 5,
};

export const useSimpleBlur = ({
   size,
   dpr,
}: {
   size: Size;
   dpr: number;
}): HooksReturn<SimpleBlurParams, SimpleBlurObject> => {
   const scene = useMemo(() => new THREE.Scene(), []);
   const material = useMesh(scene);
   const camera = useCamera(size);

   const fboProps = useMemo(
      () => ({
         scene,
         camera,
         size,
         dpr,
      }),
      [scene, camera, size, dpr]
   );
   const [renderTarget, updateRenderTarget] = useSingleFBO(fboProps);
   const [tempTexture, updateTempTexture] = useDoubleFBO(fboProps);
   const [params, setParams] = useParams<SimpleBlurParams>(SIMPLEBLUR_PARAMS);

   const updateFx = useCallback(
      (props: RootState, updateParams?: SimpleBlurParams) => {
         const { gl } = props;

         updateParams && setParams(updateParams);

         setUniform(material, "uTexture", params.texture);
         setUniform(material, "uResolution", [
            params.texture.source.data.width,
            params.texture.source.data.height,
         ]);
         setUniform(material, "uBlurSize", params.blurSize);

         let _tempTexture: THREE.Texture = updateTempTexture(gl);

         const iterations = params.blurPower;
         for (let i = 0; i < iterations; i++) {
            setUniform(material, "uTexture", _tempTexture);
            _tempTexture = updateTempTexture(gl);
         }

         const outPutTexture = updateRenderTarget(gl);

         return outPutTexture;
      },
      [updateRenderTarget, updateTempTexture, material, setParams, params]
   );

   return [
      updateFx,
      setParams,
      {
         scene: scene,
         material: material,
         camera: camera,
         renderTarget: renderTarget,
      },
   ];
};
