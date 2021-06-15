//======styles import======//

import "/src/styles/game.css";

import board from "/src/images/board.jpg";
import tileColor from "/src/images/tileColor.png";
import warrior2 from "/src/images/warrior2.png";
import LoaderFBX from "./components/LoaderFBX";
import Main from "./components/Main";

async function init() {
  const container = document.getElementById("root");
  let loaderFBX = new LoaderFBX();
  console.log(`Przed await`);
  await loaderFBX.loadModel();
  document.getElementById("loadingScreen").remove();
  console.log(`Po awaicie`);
  //main class object
  new Main(container, loaderFBX.model);
}

init();
