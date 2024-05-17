/// <reference types="react" />
import * as THREE from "three";
import { DomSyncerParams } from "..";
import { Size } from "@react-three/fiber";
import { CustomParams } from "../../../utils/setUniforms";
type UpdateDomRect = ({ params, customParams, size, resolutionRef, scene, isIntersectingRef, }: {
    params: DomSyncerParams;
    customParams?: CustomParams;
    size: Size;
    resolutionRef: React.MutableRefObject<THREE.Vector2>;
    scene: THREE.Scene;
    isIntersectingRef: React.MutableRefObject<boolean[]>;
}) => void;
type UseUpdateDomRectReturn = [DOMRect[], UpdateDomRect];
export declare const useUpdateDomRect: () => UseUpdateDomRectReturn;
export {};