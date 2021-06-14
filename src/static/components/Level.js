import {} from "three";

import Grid from "./Grid";
import Tile from "./Tile";

export default class Level {
  constructor(scene, data) {
    this.scene = scene;
    this.data = data;
    this.tiles = [];
    this.generate();
  }
  generate() {
    // this.scene.children = [];

    //======GRID======//
    // this.scene.add(new Grid());

    console.log(this.data.schema);
    this.data.schema.forEach((element, index) => {
      console.log(element);

      let tile1 = new Tile(
        [this.data.types[index][0], this.data.types[index][1]],
        [element[0][0], element[0][1], element[0][2]]
      );
      this.scene.add(tile1);

      let tile2 = new Tile(
        [this.data.types[index][0], this.data.types[index][1]],
        [element[1][0], element[1][1], element[1][2]]
      );
      this.scene.add(tile2);
      console.log(tile2.id);

      this.tiles.push(tile1);
      this.tiles.push(tile2);
    });
    console.log(this.tiles);
  }
}