//======styles import======//
import "/src/styles/style.scss";

import board from "/src/images/board.jpg";
import tileColor from "/src/images/tileColor.png";
import warrior2 from "/src/images/warrior2.png";

import Main from "./components/Main";

function init() {
  //div
  const container = document.getElementById("root");
  //main class object
  new Main(container);
}

init();
