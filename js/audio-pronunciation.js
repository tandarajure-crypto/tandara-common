(() => {
"use strict";

const player =
document.getElementById("pronunciationPlayer");

const status =
document.getElementById("audioStatus");

const buttons = [
...document.querySelectorAll(
".audio-icon-button[data-audio-src]"
)
];

if (!player || !buttons.length) return;


/* =========================================================
   JEZIK
   ========================================================= */

const isEnglish =
(document.documentElement.lang || "")
.toLowerCase()
.startsWith("en");


const text = isEnglish
? {
    defaultLabel: "pronunciation",
    stopped: "Playback stopped.",
    playing: label => "Playing " + label + ".",
    playError:
      "The audio could not be played. Please try again.",
    loadError:
      "The audio could not be loaded. Please try again."
  }
: {
    defaultLabel: "izgovor",
    stopped: "Reprodukcija je zaustavljena.",
    playing: label => "Reproducira se " + label + ".",
    playError:
      "Zvuk se nije mogao pokrenuti. Pokušajte ponovno.",
    loadError:
      "Zvuk se nije mogao učitati. Pokušajte ponovno."
  };


let activeButton = null;


/* =========================================================
   STATUS
   ========================================================= */

const setStatus = message => {
if (status) {
status.textContent = message || "";
}
};


/* =========================================================
   GUMBI
   ========================================================= */

const resetButtons = () => {

buttons.forEach(button => {

button.classList.remove("playing");

button.setAttribute(
"aria-pressed",
"false"
);

});

activeButton = null;

};


/* =========================================================
   PLAYER
   ========================================================= */

const stopPlayer = () => {

player.pause();

try {
player.currentTime = 0;
} catch (_) {}

};


/* =========================================================
   REPRODUKCIJA
   ========================================================= */

const playButton = button => {

const src =
button.dataset.audioSrc || "";

const label =
button.dataset.audioLabel ||
text.defaultLabel;

if (!src) return;


if (
activeButton === button &&
!player.paused
) {

stopPlayer();
resetButtons();
setStatus(text.stopped);

return;
}


stopPlayer();
resetButtons();

player.src = src;


const playPromise =
player.play();


if (
playPromise &&
typeof playPromise.then === "function"
) {

playPromise

.then(() => {

activeButton = button;

button.classList.add("playing");

button.setAttribute(
"aria-pressed",
"true"
);

setStatus(
text.playing(label)
);

})

.catch(() => {

resetButtons();

setStatus(
text.playError
);

});

} else {

activeButton = button;

button.classList.add("playing");

button.setAttribute(
"aria-pressed",
"true"
);

setStatus(
text.playing(label)
);

}

};


/* =========================================================
   DOGAĐAJI
   ========================================================= */

buttons.forEach(button => {

button.addEventListener(
"click",
() => playButton(button)
);

});


player.addEventListener(
"ended",
() => {

resetButtons();
setStatus("");

}
);


player.addEventListener(
"error",
() => {

resetButtons();

setStatus(
text.loadError
);

}
);

})();
