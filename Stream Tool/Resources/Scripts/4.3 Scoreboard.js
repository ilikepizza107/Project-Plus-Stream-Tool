import { bestOf } from "./Scoreboard/BestOf.mjs";
import { gamemode } from "./Scoreboard/Gamemode Change.mjs";
import { scoreboardIntro } from "./Scoreboard/Intro.mjs";
import { players } from "./Scoreboard/Player/Players.mjs";
import { round } from "./Scoreboard/Round.mjs";
import { casters } from "./Scoreboard/Caster/Casters.mjs";
import { introDelaySc, fadeInTimeSc, fadeOutTimeSc } from "./Scoreboard/ScGlobals.mjs";
import { teams } from "./Scoreboard/Team/Teams.mjs";
import { current} from "./Utils/Globals.mjs";
import { initOnBrowserActive, isBrowserActive } from "./Utils/On Transition Event.mjs";
import { initWebsocket } from "./Utils/WebSocket.mjs";
import { fadeIn } from "./Utils/Fade In.mjs";
import { fadeOut } from "./Utils/Fade Out.mjs";

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

	// if this isnt a singles match, rearrange stuff
	gamemode.update(data.gamemode);

	// some score stuff will change depending on Best Of
	bestOf.update(data.bestOf);

	// update players (names, info, characters)
	players.update(data.player);

	// update team info (names, topbar, colors, scores)
	teams.update(data.teamName, data.wl, data.color, data.score);

	// and update the round text
	round.update(data.round);

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

// listen to obs transition / tab active states
initOnBrowserActive(() => hideElements(), () => showElements());

document.addEventListener('DOMContentLoaded', () => {
	const logos = [
		'./Resources/Overlay/Scoreboard/Sponsors/ALStateGames.png',
		'./Resources/Overlay/Scoreboard/Sponsors/IMG_1052.png',
		'./Resources/Overlay/Scoreboard/Sponsors/JuveeLogo.png',
		'./Resources/Overlay/Scoreboard/Sponsors/Nouns_Esports_allmode.png',
		'./Resources/Overlay/Scoreboard/Sponsors/rocketown-logo-main.png',
		'./Resources/Overlay/Scoreboard/Sponsors/Titans Tourneys.png',
		'./Resources/Overlay/Scoreboard/Sponsors/TNSLOGO_UPSparody.png'
	];

	let currentIndex = 0;
	const logoElement = document.getElementById('sponsor-logo');

    async function showNextLogo() {
        // Fade out the current logo
        await fadeOut(logoElement, fadeOutTimeSc);

        // Update the logo source
        logoElement.src = logos[currentIndex];
        currentIndex = (currentIndex + 1) % logos.length;

        // Fade in the new logo
        fadeIn(logoElement, fadeInTimeSc);
    }

    // Initial setup
    logoElement.src = logos[currentIndex];
    fadeIn(logoElement, fadeInTimeSc);

    // Set interval to change logos
    setInterval(showNextLogo, 7000);
});

// now, this is a workaround to force CSS reflow, and we need any existing element
const randomEl = document.getElementById("roundDiv"); // can be anything

/** Hides elements that are animated when browser becomes active */
function hideElements() {
	
	current.startup = true;

	// reset animation states for the intro
	scoreboardIntro.reset();

	// hide some stuff so we save on some resources
	teams.hide();
	round.hide();

	// trigger CSS reflow
	randomEl.offsetWidth;

}

/** Shows elements to be animated when browser becomes active */
function showElements() {

	// on Chromium (OBS browsers run on it), hide() won't be done until
	// the user tabs back, displaying everything for around 1 frame
	
	setTimeout(() => { // i absolutely hate Chromium

		// play that sexy intro
		if (scoreboardIntro.isAllowed()) {
			scoreboardIntro.play();
		}

		// display and animate hidden stuff
		players.show();
		teams.show();
		round.show();

	}, 0);
	
	current.startup = false;

}