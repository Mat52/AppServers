import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { LoadingManager } from "three";
// import modelPath from "./models/xbot.dae";

export default class LoaderDAE {
  constructor(scene, model) {
    this.scene = scene;
    this.model = model;

    // let model;

    this.loadingManager = new LoadingManager(function () {
      model.traverse(function (child) {
        // dla każdego mesha w modelu
        if (child.isMesh) {
          console.log(child);
        }
      });

      scene.add(model);
    });

    this.loader = new ColladaLoader(this.loadingManager);
    this.loader.load(this.model, function (collada) {
      model = collada.scene;
    });
  }
}
