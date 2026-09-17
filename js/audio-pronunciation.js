
/* =========================================================
   TANDARA — AUDIO PRONUNCIATION

   Jedan zajednički audio player.
   Nema dvostrukih <audio> elemenata.
   MP3 se učitava tek nakon klika.
   ========================================================= */

(() => {
  "use strict";


  const player =
    document.getElementById(
      "pronunciationPlayer"
    );


  const status =
    document.getElementById(
      "audioStatus"
    );


  const buttons =
    Array.from(
      document.querySelectorAll(
        ".audio-icon-button[data-audio-src]"
      )
    );


  if (
    !player ||
    !buttons.length
  ) {
    return;
  }


  let activeButton = null;


  const setStatus = (message) => {

    if (status) {
      status.textContent =
        message || "";
    }

  };


  const resetButtons = () => {

    buttons.forEach((button) => {

      button.classList.remove(
        "playing"
      );


      button.setAttribute(
        "aria-pressed",
        "false"
      );

    });


    activeButton = null;

  };


  const stopPlayer = () => {

    player.pause();


    try {

      player.currentTime = 0;

    } catch (error) {

      /* bez dodatne radnje */

    }

  };


  const playButton = (button) => {

    const src =
      button.dataset.audioSrc || "";


    const label =
      button.dataset.audioLabel ||
      "izgovor";


    if (!src) {
      return;
    }


    const sameButtonPlaying =
      activeButton === button &&
      !player.paused;


    if (sameButtonPlaying) {

      stopPlayer();

      resetButtons();


      setStatus(
        "Reprodukcija je zaustavljena."
      );


      return;
    }


    stopPlayer();

    resetButtons();


    player.src = src;


    const playPromise =
      player.play();


    if (
      playPromise &&
      typeof playPromise.then ===
        "function"
    ) {

      playPromise

        .then(() => {

          activeButton =
            button;


          button.classList.add(
            "playing"
          );


          button.setAttribute(
            "aria-pressed",
            "true"
          );


          setStatus(
            "Reproducira se " +
            label +
            "."
          );

        })


        .catch(() => {

          resetButtons();


          setStatus(
            "Zvuk se nije mogao pokrenuti. Pokušajte ponovno."
          );

        });

    } else {

      activeButton =
        button;


      button.classList.add(
        "playing"
      );


      button.setAttribute(
        "aria-pressed",
        "true"
      );


      setStatus(
        "Reproducira se " +
        label +
        "."
      );

    }

  };


  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        playButton(
          button
        );

      }
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
        "Zvuk se nije mogao učitati. Pokušajte ponovno."
      );

    }
  );

})();
