//======styles import======//

import "/src/styles/game.css";

import board from "/src/images/board.jpg";
import tileColor from "/src/images/tileColor.png";
import warrior2 from "/src/images/warrior2.png";

import LoaderFBX from "./components/LoaderFBX";

import Main from "./components/Main";

async function init() {
  const container = document.getElementById("root");
  document.getElementById("rightscore").style.display = "none";
  let loaderFBX = new LoaderFBX();
  console.log(`Przed await`);
  await loaderFBX.loadModel();
  document.getElementById("loadingScreen").remove();
  let timeout = setTimeout(() => {
    document.getElementById("rightscore").style.display = "block";
  }, 1000);
  await timeout;
  console.log(`Po awaicie`);
  //main class object
  new Main(container, loaderFBX.model);
}

init();
