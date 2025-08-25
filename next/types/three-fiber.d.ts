import * as THREE from 'three';
import { ReactThreeFiber } from '@react-three/fiber';
import ThreeGlobe from 'three-globe';

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    planeGeometry: ReactThreeFiber.Object3DNode<
      THREE.PlaneGeometry,
      typeof THREE.PlaneGeometry
    >;
    primitive: ReactThreeFiber.Object3DNode<
      THREE.Object3D,
      typeof THREE.Object3D
    > & { object: THREE.Object3D; attach?: string };
    threeGlobe: ReactThreeFiber.Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}
