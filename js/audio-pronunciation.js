/* =========================================================
   TANDARA — AUDIO PRONUNCIATION

   Jedan zajednički audio player.
   Zvuk se prije reprodukcije potpuno priprema
   kako početak riječi ne bi bio odrezan.
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

  let preparing = false;

  let requestNumber = 0;


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


  const markPlaying = (
    button,
    label
  ) => {

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

  };


  const startPreparedAudio = (
    button,
    label,
    thisRequest
  ) => {

    if (
      thisRequest !== requestNumber
    ) {
      return;
    }


    try {

      player.currentTime = 0;

    } catch (error) {

      /* player je već pripremljen */

    }


    /*
      Kratka sigurnosna stanka daje pregledniku
      vrijeme da aktivira audio izlaz prije početka
      prvoga glasa T / Ț.
    */

    window.setTimeout(
      () => {

        if (
          thisRequest !== requestNumber
        ) {
          return;
        }


        try {

          player.currentTime = 0;

        } catch (error) {

          /* bez dodatne radnje */

        }


        const playPromise =
          player.play();


        if (
          playPromise &&
          typeof playPromise.then ===
            "function"
        ) {

          playPromise

            .then(() => {

              if (
                thisRequest !==
                requestNumber
              ) {
                return;
              }


              preparing = false;


              markPlaying(
                button,
                label
              );

            })


            .catch(() => {

              preparing = false;

              resetButtons();


              setStatus(
                "Zvuk se nije mogao pokrenuti. Pokušajte ponovno."
              );

            });

        } else {

          preparing = false;


          markPlaying(
            button,
            label
          );

        }

      },
      120
    );

  };


  const prepareAndPlay = (
    button
  ) => {

    const src =
      button.dataset.audioSrc || "";


    const label =
      button.dataset.audioLabel ||
      "izgovor";


    if (!src) {
      return;
    }


    /*
      Ako je isti zvuk već pokrenut,
      klik ga zaustavlja.
    */

    if (
      activeButton === button &&
      !player.paused
    ) {

      requestNumber += 1;

      preparing = false;

      stopPlayer();

      resetButtons();


      setStatus(
        "Reprodukcija je zaustavljena."
      );


      return;
    }


    /*
      Svaki novi klik poništava eventualni
      prethodni zahtjev koji se još priprema.
    */

    requestNumber += 1;


    const thisRequest =
      requestNumber;


    preparing = true;


    stopPlayer();

    resetButtons();


    setStatus(
      "Priprema zvuka..."
    );


    const absoluteSrc =
      new URL(
        src,
        document.baseURI
      ).href;


    /*
      Ako je isti MP3 već učitan,
      nema potrebe ponovno ga dohvaćati.
    */

    if (
      player.currentSrc === absoluteSrc &&
      player.readyState >= 3
    ) {

      startPreparedAudio(
        button,
        label,
        thisRequest
      );


      return;
    }


    /*
      Novi MP3:
      prvo se dodijeli source,
      zatim se izričito učita.
    */

    player.src =
      absoluteSrc;


    player.preload =
      "auto";


    const onCanPlay = () => {

      player.removeEventListener(
        "canplay",
        onCanPlay
      );


      startPreparedAudio(
        button,
        label,
        thisRequest
      );

    };


    player.addEventListener(
      "canplay",
      onCanPlay,
      {
        once: true
      }
    );


    player.load();

  };


  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        prepareAndPlay(
          button
        );

      }
    );

  });


  player.addEventListener(
    "ended",
    () => {

      preparing = false;

      resetButtons();

      setStatus("");

    }
  );


  player.addEventListener(
    "error",
    () => {

      preparing = false;

      resetButtons();


      setStatus(
        "Zvuk se nije mogao učitati. Pokušajte ponovno."
      );

    }
  );

})();
