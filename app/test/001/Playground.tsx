"use client";

import * as THREE from "three";
import { useFrame, useThree, extend } from "@react-three/fiber";
import {
   createFxMaterialImpl,
   createBasicFxMaterialImpl,
   FxMaterialImplValues,
   BasicFxMaterialImplValues,
   useNoise
} from "@/packages/use-shader-fx/src";
import { useTexture } from "@react-three/drei";

const FxMaterialImpl = createFxMaterialImpl({
   fragmentShader: `
	uniform sampler2D src;
	void main() {      
		vec4 oC = texture2D(src, vUv);            
      gl_FragColor = oC;
	}
`,
});
const BasicFxMaterialImpl = createBasicFxMaterialImpl();

extend({ FxMaterialImpl, BasicFxMaterialImpl });

export const Playground = () => {
   const { size } = useThree();

   const [app] = useTexture(["/funkun.jpg"]);

   const noise = useNoise({
      size,
      dpr: 1,
      scale: 10.,
      timeStrength: .4,
      mixDst: {
         src: app,
         uvFactor: .1,
         alphaFactor: 1.,         
         fit: 'contain',         
      },
   })

   useFrame((state) => {         
      noise.render(state);
   });

   return (
      <mesh>
         <planeGeometry args={[2, 2]} />
         <fxMaterialImpl key={FxMaterialImpl.key} src={noise.texture} />
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
