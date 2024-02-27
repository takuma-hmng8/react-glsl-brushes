import * as THREE from "three";
export declare class SplatMaterial extends THREE.ShaderMaterial {
    uniforms: {
        uTarget: {
            value: THREE.Texture;
        };
        aspectRatio: {
            value: number;
        };
        color: {
            value: THREE.Vector3 | THREE.Color;
        };
        point: {
            value: THREE.Vector2;
        };
        radius: {
            value: number;
        };
        texelSize: {
            value: THREE.Vector2;
        };
    };
}
export declare const useSplateMaterial: () => SplatMaterial;
