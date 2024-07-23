import { current} from "./Utils/Globals.mjs";
import { initOnBrowserActive } from "./Utils/On Transition Event.mjs";

// this is a weird way to have file svg's that can be recolored by css
customElements.define("load-svg", class extends HTMLElement {
    async connectedCallback(
      shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
    ) {
      shadowRoot.innerHTML = await (await fetch(this.getAttribute("src"))).text()
    }
})

// listen to obs transition / tab active states
initOnBrowserActive(() => hideElements(), () => showElements());

document.addEventListener('DOMContentLoaded', () => {
    const logos = [
        './Resources/Overlay/BRB/Banners/Undertow.png',
        './Resources/Overlay/BRB/Banners/HeartbeatAD.png',
        './Resources/Overlay/BRB/Banners/TitansTourneys.jpg'
    ];

    let currentIndex = 0;
    let fadeInTime = 300; // in ms
    const logoElement = document.getElementById('sponsor-logo');
    const nextLogoElement = document.createElement('img');
    nextLogoElement.id = 'sponsor-logo-next';
    nextLogoElement.className = 'absol';
    document.querySelector('.sponsors').appendChild(nextLogoElement);

    function fadeIn(element) {
        element.classList.add('active');
    }

    function fadeOut(element) {
        element.classList.remove('active');
    }

    async function showNextLogo() {
        // Prepare the next logo
        currentIndex = (currentIndex + 1) % logos.length;
        nextLogoElement.src = logos[currentIndex];
        nextLogoElement.onload = () => {
            fadeIn(nextLogoElement);
            setTimeout(() => {
                fadeOut(logoElement);
                logoElement.src = nextLogoElement.src;
                logoElement.className = nextLogoElement.className;
                nextLogoElement.className = 'absol';
            }, fadeInTime);
        };
    }

    // Initial setup
    logoElement.src = logos[currentIndex];
    fadeIn(logoElement);

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