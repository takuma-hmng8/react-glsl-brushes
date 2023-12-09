import * as React from "react";
import * as THREE from "three";
import { useFrame, extend, useThree, useLoader } from "@react-three/fiber";
import {
   FxTextureMaterial,
   FxTextureMaterialProps,
} from "../../utils/fxTextureMaterial";
import { FxMaterial, FxMaterialProps } from "../../utils/fxMaterial";
import { CONSTANT } from "../constant";
import GUI from "lil-gui";
import { useGUI } from "../../utils/useGUI";
import { useFluid, useTransitionBg } from "../../packages/use-shader-fx/src";
import {
   FLUID_PARAMS,
   FluidParams,
} from "../../packages/use-shader-fx/src/hooks/useFluid";

extend({ FxMaterial, FxTextureMaterial });

const CONFIG: FluidParams = structuredClone(FLUID_PARAMS);
const setGUI = (gui: GUI) => {
   gui.add(CONFIG, "density_dissipation", 0, 1, 0.01);
   gui.add(CONFIG, "velocity_dissipation", 0, 1, 0.01);
   gui.add(CONFIG, "velocity_acceleration", 0, 100, 1);
   gui.add(CONFIG, "pressure_dissipation", 0, 1, 0.01);
   gui.add(CONFIG, "pressure_iterations", 0, 30, 1);
   gui.add(CONFIG, "curl_strength", 0, 100, 1);
   gui.add(CONFIG, "splat_radius", 0, 0.2, 0.001);
};
const setConfig = () => {
   return {
      density_dissipation: CONFIG.density_dissipation,
      velocity_dissipation: CONFIG.velocity_dissipation,
      velocity_acceleration: CONFIG.velocity_acceleration,
      pressure_dissipation: CONFIG.pressure_dissipation,
      pressure_iterations: CONFIG.pressure_iterations,
      curl_strength: CONFIG.curl_strength,
      splat_radius: CONFIG.splat_radius,
   } as FluidParams;
};

export const UseFluid = (args: FluidParams) => {
   const updateGUI = useGUI(setGUI);

   const fxRef = React.useRef<FxMaterialProps>();
   const size = useThree((state) => state.size);
   const dpr = useThree((state) => state.viewport.dpr);
   const [updateFluid] = useFluid({ size, dpr });

   useFrame((props) => {
      const fx = updateFluid(props, setConfig());
      fxRef.current!.u_fx = fx;
      updateGUI();
   });

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <fxMaterial key={FxMaterial.key} ref={fxRef} />
      </mesh>
   );
};

export const UseFluidWithTexture = (args: FluidParams) => {
   const updateGUI = useGUI(setGUI);
   const fxRef = React.useRef<FxTextureMaterialProps>();
   const size = useThree((state) => state.size);
   const dpr = useThree((state) => state.viewport.dpr);
   const [updateFluid] = useFluid({ size, dpr });

   const [bg] = useLoader(THREE.TextureLoader, ["thumbnail.jpg"]);
   const [updateTransitionBg] = useTransitionBg({ size, dpr });

   useFrame((props) => {
      const bgTexture = updateTransitionBg(props, {
         imageResolution: CONSTANT.imageResolution,
         texture0: bg,
      });

      const fx = updateFluid(props, setConfig());

      fxRef.current!.u_postFx = bgTexture;
      fxRef.current!.u_fx = fx;
      updateGUI();
   });

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <fxTextureMaterial key={FxTextureMaterial.key} ref={fxRef} />
      </mesh>
   );
};