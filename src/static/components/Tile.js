import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
  MeshToonMaterial,
  MeshPhongMaterial,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
} from "three";

export default class Tile extends Mesh {
  constructor(type, coords) {
    //======VARIABLES======//
    let fullName = type[0];
    let prefix = fullName[0];
    let number = type[1];

    //======MATERIALS======//
    const materials = [
      new MeshPhongMaterial({
        color: 0xffffff,
        map: new TextureLoader().load("/src/images/tileColor.png"),
        emissive: 0x828500,
        emissiveIntensity: 0,
        shininess: coords[1] / 10,
      }),
      new MeshPhongMaterial({
        color: 0xffffff,
        map: new TextureLoader().load("/src/images/tileColor.png"),
        emissive: 0x828500,
        emissiveIntensity: 0,
        shininess: coords[1] / 10,
      }),
      new MeshPhongMaterial({
        color: 0xffffff,
        map: new TextureLoader().load(
          `/src/images/tiles/${fullName}/${prefix}${number}.png`
        ),
        emissive: 0x828500,
        emissiveIntensity: 0,
        shininess: coords[1] / 10,
      }),
      new MeshPhongMaterial({
        color: 0xffffff,
        map: new TextureLoader().load("/src/images/tileColor.png"),
        emissive: 0x828500,
        emissiveIntensity: 0,
        shininess: coords[1] / 10,
      }),
      new MeshPhongMaterial({
        color: 0xffffff,
        map: new TextureLoader().load("/src/images/tileColor.png"),
        emissive: 0x828500,
        emissiveIntensity: 0,
        shininess: coords[1] / 10,
      }),
      new MeshPhongMaterial({
        color: 0xffffff,
        map: new TextureLoader().load("/src/images/tileColor.png"),
        emissive: 0x828500,
        emissiveIntensity: 0,
        shininess: coords[1] / 10,
      }),
    ];

    //======INHARITANCE======//
    super(new BoxGeometry(25, 20, 35), materials);

    //======PROPS=======/
    this.type = type;

    //======TILE PROPS======//
    this.position.set(
      coords[0] * 25 - 7 * 25,
      coords[1] * 20,
      17.5 + coords[2] * 35 - 4 * 35
    );

    this.name = `${prefix}${number}`;

    this.receiveShadow = true;
    this.castShadow = true;

    const wireframeGeometry = new EdgesGeometry(this.geometry);
    const wireframeMaterial = new LineBasicMaterial({ color: 0x000000 });
    const wireframe = new LineSegments(wireframeGeometry, wireframeMaterial);
    this.add(wireframe);
  }
  update(tile) {
    for (let material of tile.material) material.emissiveIntensity = 1;
  }
  normalize(tile) {
    for (let material of tile.material) material.emissiveIntensity = 0;
  }
}