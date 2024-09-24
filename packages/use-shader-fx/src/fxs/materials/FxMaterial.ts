import * as THREE from "three";
import { resolveIncludes } from "../../libs/shaders/resolveShaders";

export type DefaultUniforms = {
   resolution: { value: THREE.Vector2 };
   texelSize: { value: THREE.Vector2 };
   aspectRatio: { value: number };
   maxAspect: { value: THREE.Vector2 };
};

export class FxMaterial extends THREE.ShaderMaterial {
   constructor(parameters = {}) {
      super();

      this.uniforms = {
         resolution: { value: new THREE.Vector2() },
         texelSize: { value: new THREE.Vector2() },
         aspectRatio: { value: 0 },
         maxAspect: { value: new THREE.Vector2() },
      } as DefaultUniforms;

      this.setValues(parameters);
   }

   updateResolution(resolution: THREE.Vector2) {
      const { width, height } = resolution;
      const maxAspect = Math.max(width, height);
      this.uniforms.resolution.value.set(width, height);
      this.uniforms.texelSize.value.set(1 / width, 1 / height);
      this.uniforms.aspectRatio.value = width / height;
      this.uniforms.maxAspect.value.set(maxAspect / width, maxAspect / height);
   }

   resolveDefaultShaders(vertexShader: string, fragmentShader: string) {
      this.vertexShader = resolveIncludes(vertexShader);
      this.fragmentShader = resolveIncludes(fragmentShader);
   }

   setUniformValues(values: any) {
      if (values === undefined) return;

      for (const key in values) {
         const newValue = values[key];

         if (newValue === undefined) {
            console.warn(
               `use-shader-fx: parameter '${key}' has value of undefined.`
            );
            continue;
         }

         const curretUniform = this.uniforms[key];

         if (curretUniform === undefined) {
            console.warn(
               `use-shader-fx: '${key}' is not a uniform property of ${this.type}.`
            );
            return;
         }

         curretUniform.value = newValue;
      }
   }
}
