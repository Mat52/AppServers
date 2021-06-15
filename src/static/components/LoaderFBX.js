import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { AnimationMixer } from "three";
import waitingAnim from "./models/waiting.fbx";
import kickAnim from "./models/kick.fbx";
import sadAnim from "./models/sad.fbx";

export default class LoaderFBX {
  constructor() {
    this.path = "./models/ninja.fbx";
    this.loader = new FBXLoader();
    // console.log(loader);
    this.model = undefined;
    this.mixer;

    this.animations = [waitingAnim, kickAnim, sadAnim];
  }
  async loadModel() {
    // var mixer;
    return new Promise((resolve) => {
      this.loader.load(this.path, (object) => {
        this.model = object;
        this.model.fbx = this;
        this.mixer = new AnimationMixer(object);
        console.log("animacje modelu", object.animations);
        // console.log(waitingAnim);
        // this.animations.forEach((animation) => {
        new FBXLoader().load(this.animations[0], (object) => {
          let anim = object.animations[0];
          anim.name = "wait";
          this.model.animations.push(anim);

          // this.playAnim("wait");
        });
        new FBXLoader().load(this.animations[1], (object) => {
          let anim = object.animations[0];
          anim.name = "kick";
          this.model.animations.push(anim);

          // this.playAnim("kick");
        });
        new FBXLoader().load(this.animations[2], (object) => {
          let anim = object.animations[0];
          anim.name = "sad";
          this.model.animations.push(anim);

          // this.playAnim("kick");
        });
        // });

        resolve();
      });
    });
  }
  playAnim(animName) {
    this.animName = animName;
    new FBXLoader().load(this.animations[0], (object) => {
      let anim = object.animations[0];
      anim.name = "wait";
      this.model.animations.push(anim);

      // this.playAnim("wait");
      this.mixer.uncacheRoot(this.model);
      this.mixer.clipAction(this.animName).play();
    });
  }
  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }
}