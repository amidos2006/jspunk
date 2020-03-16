import JSP from "./jsp/JSP.js";
import TestWorld from "./game/TestWorld.js";

function main() {
	JSP.init(320, 240, 2, false);
	JSP.loadGFX("logo", "assets/JSPunk.png");
	JSP.start();

	JSP.world = new TestWorld();
}
END_OF_MAIN(main);
