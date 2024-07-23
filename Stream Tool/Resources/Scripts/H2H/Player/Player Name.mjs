import { fadeIn } from "../../Utils/Fade In.mjs";
import { fadeOut } from "../../Utils/Fade Out.mjs";
import { current } from "../../Utils/Globals.mjs";
import { resizeText } from "../../Utils/Resize Text.mjs";
import { gamemode } from "../Gamemode Change.mjs";
import { fadeInTimeVs, fadeOutTimeVs, introDelayVs } from "../H2HGlobals.mjs";

const playerSize = 50;
const tagSize = 25;
const playerSizeDubs = 45;
const tagSizeDubs = 25;

export class PlayerName {

    #name = "";
    #tag = "";
    #state = "";

    #nameEl;
    #tagEl;
    #wrapperEl;

    #stateImg;
    #imgSrc;

    #id = 0;

    /**
     * Controls the player's name and tags + state
     * @param {HTMLElement} nameEl - Name element
     * @param {HTMLElement} tagEl - Tag element
     * @param {HTMLElement} stateImg - state image element
     * @param {Number} id - Player Slot
     */
    constructor(nameEl, tagEl, stateImg, id) {
        this.#nameEl = nameEl;
        this.#tagEl = tagEl;
        this.#stateImg = stateImg;
        this.#wrapperEl = nameEl.parentElement;
        this.#id = id;
    }

    getName() {
        return this.#name;
    }
    #setName(name) {

        this.#name = name;

        // set the displayed text
        this.#nameEl.innerHTML = name;

        // resize it depending on the gamemode
        if (gamemode.getGm() == 1) {
            this.#nameEl.style.fontSize = playerSize + "px";
        } else {
            this.#nameEl.style.fontSize = playerSizeDubs + "px";
        }

    }

    getTag() {
        return this.#tag;
    }
    #setTag(tag) {

        this.#tag = tag;

        // set the displayed text
        this.#tagEl.innerHTML = tag;

        // resize it depending on the gamemode
        if (gamemode.getGm() == 1) {
            this.#tagEl.style.fontSize = tagSize + "px";
        } else {
            this.#tagEl.style.fontSize = tagSizeDubs + "px";
        }

    }

    getState() {
        return this.#state;
    }

    /**
     * Update player name and tag, fading them out and in
     * @param {String} name - Name of the player
     * @param {String} tag - Tag of the player
     * @param {String} state - The player's state
     */
    async update(name, tag, state) {

        this.#state = state;

        // if the image to show changed
        if (this.#imgSrc != `Resources/SVGs/Flags/${state}.svg`) {

            // store for later
            this.#imgSrc = `Resources/SVGs/Flags/${state}.svg`;
        }
        

        let delayTime = introDelayVs + .3;

        // if not loading up
        if (!current.startup) {

            // we wont need delay
            delayTime = 0;
            // wait for the fadeout to proceed
            await fadeOut(this.#wrapperEl, fadeOutTimeVs);
            await fadeOut(this.#stateImg,  fadeOutTimeVs);

        }

        // update them texts
        this.#setName(name);
        this.#setTag(tag);
        this.#stateImg.src = this.#imgSrc;
        resizeText(this.#wrapperEl);

        // and fade everything in!
        if (this.getName() || this.getTag() || this.getState()) { // only if theres content
            fadeIn(this.#wrapperEl, fadeInTimeVs, delayTime);
            fadeIn(this.#stateImg, fadeInTimeVs, delayTime);
        }

        if (state) {
            this.#stateImg.style.display = "inline";
          } else {
            this.#stateImg.style.display = "none";
          }

    }

    /**
     * Adapts the text elements depending on the gamemode
     * @param {Number} gamemode - Gamemode to change to
     */
    changeGm(gamemode) {

        if (gamemode == 2) { // doubles
            
            // remove and add doubles classes
            this.#wrapperEl.classList.remove("wrappersSingles", "p"+(this.#id)+"WSingles");
			this.#wrapperEl.classList.add("wrappersDoubles", "p"+(this.#id)+"WDub");
			// update the text size and resize it if it overflows
			this.#nameEl.style.fontSize = playerSizeDubs + "px";
			this.#tagEl.style.fontSize = tagSizeDubs + "px";
            // and, of course, resize it
			resizeText(this.#wrapperEl);

        } else { // singles
            
            // same as doubles, but for singles
            this.#wrapperEl.classList.remove("wrappersDoubles", "p"+(this.#id)+"WDub");
			this.#wrapperEl.classList.add("wrappersSingles", "p"+(this.#id)+"WSingles");
            this.#nameEl.style.fontSize = playerSize + "px";
			this.#tagEl.style.fontSize = tagSize + "px";
            resizeText(this.#wrapperEl);

        }

    }

    /** Hides the text wrapper */
    hide() {
        this.#wrapperEl.style.display = "none";
    }

    /** Displays the text wrapper, fading it in */
    show() {
        fadeIn(this.#wrapperEl, fadeInTimeVs, introDelayVs + .3);
        fadeIn(this.#stateImg, fadeInTimeVs, introDelayVs + .3);
        this.#wrapperEl.style.display = "block";
    }

}