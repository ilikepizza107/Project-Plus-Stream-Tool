import { scoreboardIntro } from "./Scoreboard/Intro.mjs";
import { casters } from "./Comms/Casters.mjs";
import { introDelaySc } from "./Scoreboard/ScGlobals.mjs";
import { current} from "./Utils/Globals.mjs";
import { isBrowserActive } from "./Utils/On Transition Event.mjs";
import { initWebsocket } from "./Utils/WebSocket.mjs";

// this is a weird way to have file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
})

// used to initialize some stuff just once
let firstUpdate = true;

// start the connection to the GUI so everything gets
// updated once the GUI sends back some data
initWebsocket("gameData", (data) => updateData(data));


/**
 * Updates all displayed data
 * @param {Object} data - All data related to the VS Screen
 */
async function updateData(data) {

		// there are some things that we want to happen only once
		if (firstUpdate) {

			// initialize the caster class
			casters.initCasters(data.socialNames);
	
		}

	// update intro data just in case we end up playing it
	scoreboardIntro.updateData(data);

	// determine startup delay
	if (data.allowIntro) {
		current.delay = introDelaySc + 2;
	} else {
		current.delay = introDelaySc;
	}

	// and finally, update commentators
	casters.update(data.caster);

	// many modules need to know if we are loading the view up or not
	if (current.startup) {
		current.startup = false;
	}

	// this is to prevent things not animating when browser loaded while not active
	if (firstUpdate) {
		if (!isBrowserActive()) {
			hideElements();
		}
		firstUpdate = false;
	}

}
