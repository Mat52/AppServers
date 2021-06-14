import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {} from "three";

export default class LoaderFBX {
  constructor(scene, path) {
    this.scene = scene;
    this.path = path;
    this.loader = new FBXLoader();
  }

  load() {
    this.loader.load(
      this.path,
      function (fbx) {
        this.scene.add(fbx);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }
}
