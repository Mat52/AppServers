import { Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export default class Grid extends Mesh {
  constructor() {
    let geometry = new PlaneGeometry(375, 280, 15, 8);
    let material = new MeshBasicMaterial({
      wireframe: true,
    });
    super(geometry, material);

    this.rotateX(Math.PI / 2);
  }
}
