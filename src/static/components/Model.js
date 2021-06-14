// import { AnimationMixer } from "three";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

// import model from "./models/dreyar_m_aure.fbx";

// export default class Model {
//   constructor(scene) {
//     this.scene = scene;
//   }
//   load() {
//     var mixer;
//     const loader = new FBXLoader();

//     loader.load(model, function (object) {
//     //   mixer = new AnimationMixer(object);
//     //   console.log("animacje modelu", object.animations);

//     //   const action = mixer.clipAction(object.animations[0]);
//     //   action.play();

//     //   object.traverse(function (child) {
//     //     // dla kazdego mesha w modelu
//     //     if (child.isMesh) {
//     //       console.log(child);
//     //     }
//     //   });
//     //   model = object;
//     //   this.scene.add(object);
//     // });

//     // // Instantiate a loader
//     // const loader = new GLTFLoader();
//     // // Optional: Provide a DRACOLoader instance to decode compressed mesh data
//     // // const dracoLoader = new DRACOLoader();
//     // // dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
//     // // loader.setDRACOLoader( dracoLoader );
//     // // Load a glTF resource
//     // loader.load(
//     //   // resource URL
//     //   "./models/dreyar_m_aure.fbx",
//     //   // called when the resource is loaded
//     //   function (gltf) {
//     //     this.scene.add(gltf.scene);
//     //     gltf.animations; // Array<THREE.AnimationClip>
//     //     gltf.scene; // THREE.Group
//     //     gltf.scenes; // Array<THREE.Group>
//     //     gltf.cameras; // Array<THREE.Camera>
//     //     gltf.asset; // Object
//     //   },
//     //   // called while loading is progressing
//     //   function (xhr) {
//     //     console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//     //   },
//     //   // called when loading has errors
//     //   function (error) {
//     //     console.log("An error happened");
//     //   }
//     // );
//   }
// }
