//* IMPORTS
import { PerspectiveCamera, Vector3 } from "three";

export default class Camera extends PerspectiveCamera {
  constructor(fov, width, height) {
    //======INHARITANCE======//
    super(fov, width / height, 0.1, 10000);

    //======PROPS======//
    this.width = width;
    this.height = height;

    //======CAMERA POSITION======//
    this.position.set(0, 700, 0);
    this.lookAt(new Vector3(0, 0, 0));

    this.updateSize(); // resize
    window.addEventListener("resize", () => this.updateSize(), false);
  }

  updateSize() {
    this.aspect = this.width / this.height;
    this.updateProjectionMatrix();
  }
}
