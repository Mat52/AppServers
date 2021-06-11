//* IMPORTS
import {
  AmbientLight,
  GridHelper,
  Raycaster,
  Scene,
  Vector2,
  LoadingManager,
  TextureLoader,
  PointLight,
} from "three";

//* MAIN THREE COMPONENTS
import Renderer from "./Renderer";
import Camera from "./Camera";
import Grid from "./Grid";
import LoaderFBX from "./LoaderFBX";

//* MESHES
import Tile from "./Tile";

import modelPath from "./models/model.fbx";

//ORBIT CONTROLS
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Model from "./Model";
import Level from "./Level";

export default class Main {
  constructor(container) {
    //======CONTAINER======//
    this.container = container;

    //======SCENE======//
    this.scene = new Scene();
    this.scene.background = new TextureLoader().load("/src/images/board.jpg");

    //======RENDERER======//
    this.renderer = new Renderer(container);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;

    //======CAMERA======//
    this.camera = new Camera(30, window.innerWidth, window.innerHeight);

    //======DATA======//
    const getData = async () => {
      let get = await fetch("http://localhost:3000/getLevel");
      let data = await get.json();
      this.level = new Level(this.scene, data);
    };

    getData();
    //======RAYCASTER======//
    this.raycaster = new Raycaster();
    this.mouseVector = new Vector2();
    this.intersects = [];
    this.tiles = [];
    this.clicked = [null, null];

    //======MOUSE EVENT======//
    document.addEventListener("click", (e) => {
      this.mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouseVector, this.camera);

      this.intersects = this.raycaster.intersectObjects(this.scene.children);
      if (this.intersects.length > 0 && this.intersects[0].object.name != "") {
        if (this.clicked[0] === null)
          this.clicked[0] = this.intersects[0].object;
        else if (
          this.clicked[1] === null &&
          this.clicked[0].uuid != this.intersects[0].object.uuid
        )
          this.clicked[1] = this.intersects[0].object;
        console.log(this.clicked);
      }
    });

    //======ORBIT CONTROLS======//
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //======TEST TILES======//
    // this.scene.add(new Tile(["craks", 1], [0, 1, -1]));
    // this.scene.add(new Tile(["flowers", 1], [1, 1, 1]));
    // this.scene.add(new Tile(["flowers", 1], [-1, 1, 1]));
    // this.scene.add(new Tile(["craks", 1], [1, 2, -1]));
    // this.scene.add(new Tile(["winds", 1], [4, 1, 1]));

    //======TEST MODEL======//

    // new LoaderFBX(this.scene, modelPath).load();

    //======LIGHT======//
    this.scene.add(new AmbientLight(0xffffff, 0.8));

    this.render();
  }

  render() {
    this.renderer.setViewport(0, 0, innerWidth, innerHeight);
    this.renderer.render(this.scene, this.camera);

    if (this.clicked[0])
      //zaznacz
      for (let tile of this.clicked) {
        if (tile) tile.update(tile);
      }
    if (this.clicked[1]) {
      //usuń
      if (this.clicked[0].name === this.clicked[1].name) {
        console.log("USUWAM!");
        this.scene.remove(this.clicked[0]);
        this.scene.remove(this.clicked[1]);
      }
      this.clicked = [null, null];
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
