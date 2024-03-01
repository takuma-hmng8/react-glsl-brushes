import { useCallback, useMemo } from "react";
import * as THREE from "three";
import { DuoToneMaterial, useMesh } from "./useMesh";
import { useCamera } from "../../utils/useCamera";
import { RootState } from "@react-three/fiber";
import { useSingleFBO } from "../../utils/useSingleFBO";
import { setUniform } from "../../utils/setUniforms";
import { HooksProps, HooksReturn } from "../types";
import { useParams } from "../../utils/useParams";

export type DuoToneParams = {
   /** Make this texture duotone , Default:new THREE.Texture() */
   texture?: THREE.Texture;
   /** 1st color ,　Default:new THREE.Color(0xffffff) */
   color0?: THREE.Color;
   /** 2nd color , Default: new THREE.Color(0x000000) */
   color1?: THREE.Color;
};

export type DuoToneObject = {
   scene: THREE.Scene;
   material: DuoToneMaterial;
   camera: THREE.Camera;
   renderTarget: THREE.WebGLRenderTarget;
   output: THREE.Texture;
};

export const DUOTONE_PARAMS: DuoToneParams = {
   texture: new THREE.Texture(),
   color0: new THREE.Color(0xffffff),
   color1: new THREE.Color(0x000000),
};

/**
 * @link https://github.com/takuma-hmng8/use-shader-fx#usage
 */
export const useDuoTone = ({
   size,
   dpr,
   samples = 0,
}: HooksProps): HooksReturn<DuoToneParams, DuoToneObject> => {
   const scene = useMemo(() => new THREE.Scene(), []);
   const material = useMesh(scene);
   const camera = useCamera(size);
   const [renderTarget, updateRenderTarget] = useSingleFBO({
      scene,
      camera,
      size,
      dpr,
      samples,
   });

   const [params, setParams] = useParams<DuoToneParams>(DUOTONE_PARAMS);

   const updateFx = useCallback(
      (props: RootState, updateParams?: DuoToneParams) => {
         const { gl } = props;

         updateParams && setParams(updateParams);

         setUniform(material, "uTexture", params.texture!);
         setUniform(material, "uColor0", params.color0!);
         setUniform(material, "uColor1", params.color1!);

         return updateRenderTarget(gl);
      },
      [updateRenderTarget, material, setParams, params]
   );

   return [
      updateFx,
      setParams,
      {
         scene: scene,
         material: material,
         camera: camera,
         renderTarget: renderTarget,
         output: renderTarget.texture,
      },
   ];
};