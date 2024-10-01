import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

declare global {
   namespace JSX {
      interface IntrinsicElements {
         fxMaterial: any;
      }
   }
}

export type FxMaterialProps = {
   u_blur: THREE.Texture;
   u_gooey: THREE.Texture;
   u_model: THREE.Texture;
   u_noise?: THREE.Texture;
   u_color0?: THREE.Color;
   u_color1?: THREE.Color;
};

export const FxMaterial = shaderMaterial(
   {
      u_blur: new THREE.Texture(),
      u_gooey: new THREE.Texture(),
      u_model: new THREE.Texture(),
      u_noise: new THREE.Texture(),
      u_color0: new THREE.Color(0x1974d2),
      u_color1: new THREE.Color(0xff1e90),
   },

   `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = vec4(position, 1.0);
		}
	`,
   `
		precision highp float;
		varying vec2 vUv;
		uniform sampler2D u_blur;
		uniform sampler2D u_gooey;
		uniform sampler2D u_model;
		uniform sampler2D u_noise;
		uniform vec3 u_color0;
		uniform vec3 u_color1;

		float vignetteStrength = 0.9; // 強度（0.0〜1.0）
		float vignetteRadius = 0.64;  // 効果が始まる半径（0.0〜1.0）

		float rand(vec2 n) { 
			return fract(sin(dot(n ,vec2(12.9898,78.233))) * 43758.5453);
		}

		void main() {
			vec2 uv = vUv;
			float grain = rand(uv); // -1.0〜1.0

			// ビネット
			vec2 position = uv - 0.5;
			float distance = length(position);
			float vignette = smoothstep(vignetteRadius, vignetteRadius - 0.5, distance);
			vignette = mix(1.0, vignette, vignetteStrength);
			
			// ノイズ
			vec4 noise = texture2D(u_noise, uv);
			vec3 noisedColor = mix(u_color0, u_color1, length(noise.rg * uv) + .1);
			noisedColor -= grain * .1;

			// ブラー
			vec4 blurColor = texture2D(u_blur,uv);
			blurColor.rgb+=grain * .3;
			blurColor.rgb+=noisedColor * 2.;

			// ブラーとノイズを混ぜる		
			vec3 mixedBlurColor = mix(noisedColor, blurColor.rgb, blurColor.a);
			
			// モデル
			vec4 modelColor = texture2D(u_model,uv);
			float gooeyAlpha = texture2D(u_gooey,uv).a;
			vec3 mixedModelColor = mix(mixedBlurColor, vec3(0.), clamp(gooeyAlpha * 80.0 - 20.0,0.,1.));

			vec3 finalColor = mixedModelColor * vignette;

			gl_FragColor = vec4(finalColor, 1.0);

		}
	`
);
