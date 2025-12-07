import * as THREE from 'three';

export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
  TEXT_SHAPE = 'TEXT_SHAPE'
}

export interface ParticleData {
  // Initial random position in space
  scatterPosition: THREE.Vector3;
  // Target position on the tree cone
  treePosition: THREE.Vector3;
  // Target position for text
  textPosition: THREE.Vector3;
  // Random rotation for variety
  rotation: THREE.Euler;
  // Slight scale variation
  scale: number;
  // Color variation
  color: THREE.Color;
  // Animation speed offset
  speedOffset: number;
  // Type of geometry (0 = Cube, 1 = Sphere)
  typeId: number; 
}