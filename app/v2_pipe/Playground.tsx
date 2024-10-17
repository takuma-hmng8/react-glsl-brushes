"use client";

import { useFrame, useThree, extend, createPortal } from "@react-three/fiber";
import {
   useNoise,
   createFxMaterialImpl,
   createBasicFxMaterialImpl,
   FxMaterialImplValues,
   BasicFxMaterialImplValues,
   useFluid,
   usePipeline,
} from "@/packages/use-shader-fx/src";
import { useEffect, useMemo, useState } from "react";
import { useTexture } from "@react-three/drei";

const FxMaterialImpl = createFxMaterialImpl();
const BasicFxMaterialImpl = createBasicFxMaterialImpl();

extend({ FxMaterialImpl, BasicFxMaterialImpl });

/*===============================================
reactive way
- fxの変更をtriggerにkeyを変更することで、reactiveにfxを変更することが可能
===============================================*/

// const Pipeline = ({
//    fxConfig,
//    pipelineConfig,
// }: {
//    fxConfig: FxConfig[];
//    pipelineConfig: PipelineConfig[];
// }) => {
//    const { texture, render, setPipeline } = usePipeline(...fxConfig);
//    setPipeline(...pipelineConfig);
//    useFrame((state) => render(state));
//    return <fxMaterialImpl key={FxMaterialImpl.key} src={texture} />;
// };

// export const Playground = () => {
//    const { size } = useThree();

//    const fxConfig = [
//       { fx: useFluid, size, dpr: 0.2 },
//       {
//          fx: useNoise,
//          size,
//          dpr: 0.1,
//          mixSrcColorFactor: 0.2,
//       },
//    ];

//    const pipelineConfig: PipelineConfig[] = [{}, { mixSrc: 0 }];

//    // keyを変更することで、fxの変更をreactiveにすることが可能
//    // UIではGUIの変更を検知して、keyを変更することで、reactiveに変更を反映するなどを想定
//    const [pipelineCache, setPipelineCache] = useState(fxConfig.length);
//    const [version, setVersion] = useState(0);
//    if (fxConfig.length !== pipelineCache) {
//       setPipelineCache(fxConfig.length);
//       setVersion(version + 1);
//    }

//    return (
//       <mesh>
//          <planeGeometry args={[2, 2]} />
//          <Pipeline
//             fxConfig={fxConfig}
//             pipelineConfig={pipelineConfig}
//             key={version}
//          />
//       </mesh>
//    );
// };

/*===============================================
non-reactive way
- resolutionはreactive
	- ただし他のhooksと同様、resolution以外はnon-reactive
===============================================*/
export const Playground = () => {
   const { size } = useThree();

   const [app] = useTexture(["/app-head.jpg"]);

   const { texture, render, setPipeline } = usePipeline(
      {
         fx: useFluid,
         size,
         dpr: 0.2,
      },
      {
         fx: useNoise,
         size,
         dpr: 0.1,
         mixDstUvFactor: 0.2,
         mixDstColorFactor: 0.2,
      }
   );

   setPipeline({}, { mixDst: 0 });

   useFrame((state) => render(state));

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <fxMaterialImpl key={FxMaterialImpl.key} src={texture} />
      </mesh>
   );
};

declare global {
   namespace JSX {
      interface IntrinsicElements {
         fxMaterialImpl: FxMaterialImplValues &
            JSX.IntrinsicElements["shaderMaterial"];
         BasicFxMaterialImpl: BasicFxMaterialImplValues &
            JSX.IntrinsicElements["shaderMaterial"];
      }
   }
}
