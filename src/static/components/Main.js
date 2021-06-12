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

var socket = io();
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
    this.camera.position.set(0, 700, 0);
    this.camera.lookAt(0, 0, 0);

    //======DATA======//
    const UserData = async () => {
      let sesid = sessionStorage.getItem("sessionId");
      let nick = sessionStorage.getItem("nick");
      let userkey = sessionStorage.getItem("userkey");
      let room = sessionStorage.getItem("room");
      let data = {
        sesid: sesid,
        nick: nick,
        userkey: userkey,
        room: room,
      };
      socket.emit("connectgame", data);
    };

    UserData();
    const getData = async () => {
      let get = await fetch("http://localhost:3000/getLevel");
      let data = await get.json();
      this.level = new Level(this.scene, data);
      socket.on("opscore", (data1) => {
        // console.log(this.level.tiles);
        let tiles = this.level.tiles;
        let scene = this.level.scene;
        let tileToRmv1 = data1.data1.tile1;
        let tileToRmv2 = data1.data1.tile2;
        tiles.forEach(function (element, index) {
          // console.log(element.id);
          if (element.id == tileToRmv1 || element.id == tileToRmv2) {
            scene.remove(element);
          }
        });
      });
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

      //=======CHECKING IF CAN CLICK======//
      let coords = [
        this.intersects[0]?.object.position.x,
        this.intersects[0]?.object.position.y,
        this.intersects[0]?.object.position.z,
      ];
      let canClick = true;
      let onRight = null;
      let onLeft = null;
      let onTop = null;

      this.level.tiles.forEach((element, index) => {
        let elX = element?.position.x;
        let elY = element?.position.y;
        let elZ = element?.position.z;
        if (
          elX == coords[0] + 25 &&
          elY == coords[1] &&
          (elZ == coords[2] ||
            elZ == coords[2] + 17.5 ||
            elZ == coords[2] - 17.5)
        ) {
          onRight = element;
          // console.log(onRight);
        } else if (
          elX == coords[0] - 25 &&
          elY == coords[1] &&
          (elZ == coords[2] ||
            elZ == coords[2] + 17.5 ||
            elZ == coords[2] - 17.5)
        ) {
          onLeft = element;
          // console.log(onLeft);
        } else if (
          elY > coords[1] &&
          ((elX == coords[0] - 12.5 && elZ == coords[2] + 17.5) ||
            (elX == coords[0] + 12.5 && elZ == coords[2] + 17.5) ||
            (elX == coords[0] - 12.5 && elZ == coords[2] - 17.5) ||
            (elX == coords[0] + 12.5 && elZ == coords[2] - 17.5))
        ) {
          onTop = element;
          console.log(onTop);
        }
      });

      if ((onRight && onLeft) || onTop) canClick = false;

      //============================================================//

      if (this.intersects.length > 0 && this.intersects[0].object.name != "") {
        if (this.clicked[0] === null && canClick)
          this.clicked[0] = this.intersects[0].object;
        else if (
          this.clicked[1] === null &&
          this.clicked[0]?.uuid != this.intersects[0]?.object?.uuid &&
          canClick
        )
          this.clicked[1] = this.intersects[0].object;
        // console.log(this.clicked);
      }
    });

    //======ORBIT CONTROLS======//
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //======TEST MODEL======//

    // new LoaderFBX(this.scene, modelPath).load();

    //======LIGHT======//
    let point = new PointLight(0xffffff, 0.8);
    point.position.set(0, 700, 0);
    point.distance = 750;
    point.intensity = 5;
    this.scene.add(point);

    this.render();
  }

  render() {
    this.renderer.setViewport(0, 0, innerWidth, innerHeight);
    this.renderer.render(this.scene, this.camera);

    if (this.level?.tiles) {
      this.level.tiles.forEach((element, index) => {
        if (
          element &&
          this.clicked[0] != element &&
          this.clicked[1] != element
        ) {
          element.normalize(element);
        }
      });
    }

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
        this.level.tiles.forEach((element, index) => {
          if (element == this.clicked[0] || element == this.clicked[1]) {
            this.level.tiles[index] = null;
          }
        });

        let nick = sessionStorage.getItem("nick");
        let userkey = sessionStorage.getItem("userkey");
        let room = sessionStorage.getItem("room");
        let data = {
          tile1: this.clicked[0].id,
          tile2: this.clicked[1].id,
          nick: nick,
          userkey: userkey,
          room: room,
        };
        // console.log(data);
        socket.emit("hittile", data);
      }
      this.clicked = [null, null];
      // console.log(this.level.tiles);
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
