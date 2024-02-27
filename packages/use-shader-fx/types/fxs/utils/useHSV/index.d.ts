import * as THREE from "three";
import { HooksProps, HooksReturn } from "../../types";
export type HSVParams = {
    /** default:THREE.Texture() */
    texture?: THREE.Texture;
    /** default:1 */
    brightness?: number;
    /** default:1 */
    saturation?: number;
};
export type HSVObject = {
    scene: THREE.Scene;
    material: THREE.Material;
    camera: THREE.Camera;
    renderTarget: THREE.WebGLRenderTarget;
    output: THREE.Texture;
};
export declare const HSV_PARAMS: HSVParams;
/**
 * @link https://github.com/takuma-hmng8/use-shader-fx#usage
 */
export declare const useHSV: ({ size, dpr, samples, }: HooksProps) => HooksReturn<HSVParams, HSVObject>;
