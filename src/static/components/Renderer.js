//*IMPORTS
import { WebGLRenderer } from "three";

export default class Renderer extends WebGLRenderer {
  constructor(container) {
    //======INHARITANCE======//
    super({ antialias: true });

    //======PROPS======//
    this.container = container;
    this.container.appendChild(this.domElement); // resize

    //======UPDATE RENDERER SIZE======//
    this.updateSize();
    document.addEventListener(
      "DOMContentLoaded",
      () => this.updateSize(),
      false
    );
    window.addEventListener("resize", () => this.updateSize(), false);
  }

  updateSize() {
    this.setSize(window.innerWidth, window.innerHeight);
  }
}
