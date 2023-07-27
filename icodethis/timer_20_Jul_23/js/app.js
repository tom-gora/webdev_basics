window.onload = () => {
  const timer = document.querySelector(".main-timer");
  const timerInputSection = document.querySelector(".timer-input");
  const numpadButtons = timer.querySelectorAll(".numpad-button");
  const controlsTimer = document.querySelector(".controls-timer");
  const startTimerBtn = document.querySelector(".controls-timer-start");
  const timerInputs = document.querySelectorAll(".timer-group input");
  const hoursTimerInput = document.querySelector(".timer-group #timer-hours");
  const minutesTimerInput = document.querySelector(
    ".timer-group #timer-minutes"
  );
  const secondsTimerInput = document.querySelector(
    ".timer-group #timer-seconds"
  );
  let secondsState = "unmodified";
  let minutesState = "unmodified";
  let hoursState = "unmodified";

  const numpadBack = document.querySelector(".numpad-button.numpad-back");
  const timeDisplay = document.querySelector(".countdown-container span");
  const countdownContainer = document.querySelector(".countdown-container");
  const countdownButtonPause = document.querySelector(
    ".controls-countdown-pause"
  );
  const countdownButtonStop = document.querySelector(
    ".controls-countdown-stop"
  );
  const remainingCircle = document.getElementById("countdown-path-remaining");
  const alert = document.querySelector(".alert");
  const flashingSvg = document.querySelector(".countdown-path-elapsed");

  const animatePopOut = (element) => {
    element.setAttribute("data-pop-out", "");
  };

  const animatePopIn = (element) => {
    element.setAttribute("data-pop-in", "");
  };

  const isInput = () => {
    let isNonZero = false;
    timerInputs.forEach((timerInput) => {
      if (timerInput.value !== "00") {
        isNonZero = true;
        return;
      }
    });
    if (isNonZero) {
      console.log("at least one value is not = 00");
      animatePopIn(startTimerBtn);
      startTimerBtn.removeAttribute("data-pop-out");
      startTimerBtn.style.display = "grid";
      console.log(startTimerBtn);
    } else {
      animatePopOut(startTimerBtn);
    }
  };

  const updateInput = (nextBtnPress) => {
    const currentSecondsValue = secondsTimerInput.value;
    const currentMinutesValue = minutesTimerInput.value;
    const currentHoursValue = hoursTimerInput.value;
    secondsState = secondsTimerInput.getAttribute("data-state");
    minutesState = minutesTimerInput.getAttribute("data-state");
    hoursState = hoursTimerInput.getAttribute("data-state");
    if (
      secondsState === "modified-two-digits" &&
      minutesState === "modified-two-digits" &&
      hoursState === "modified-two-digits"
    ) {
      hoursTimerInput.style.color = "var(--txt-color)";
    }
    // quickly handle the double-zero cases
    if (nextBtnPress === "00") {
      if (
        // seconds
        (secondsState === "unmodified" ||
          secondsState === "modified-one-digit") &&
        minutesState === "unmodified" &&
        hoursState === "unmodified"
      ) {
        secondsTimerInput.setAttribute("data-state", "modified-two-digits");
        secondsTimerInput.value = "00";
        secondsTimerInput.setSelectionRange(0, 2);
        secondsTimerInput.focus();
        isInput();
      } else if (
        // minutes
        secondsState === "modified-two-digits" &&
        minutesState === "unmodified" &&
        hoursState === "unmodified"
      ) {
        minutesTimerInput.setAttribute("data-state", "modified-two-digits");
        minutesTimerInput.value = "00";
        minutesTimerInput.setSelectionRange(0, 2);
        minutesTimerInput.focus();
        secondsTimerInput.style.color = "var(--txt-color)";
        isInput();
      } else {
        // hours in the remaining case
        hoursTimerInput.value = "00";
        minutesTimerInput.style.color = "var(--txt-color)";
        hoursTimerInput.setSelectionRange(0, 2);
        hoursTimerInput.focus();
        isInput();
      }
    } else {
      // if not double-zero
      if (
        // seconds
        secondsState === "unmodified" &&
        minutesState === "unmodified" &&
        hoursState === "unmodified"
      ) {
        secondsTimerInput.setAttribute("data-state", "modified-one-digit");
        secondsTimerInput.value = nextBtnPress.padStart(2, "0");
        secondsTimerInput.setSelectionRange(1, 2);
        secondsTimerInput.focus();
        isInput();
      } else if (
        secondsState === "modified-one-digit" &&
        minutesState === "unmodified" &&
        hoursState === "unmodified"
      ) {
        secondsTimerInput.setAttribute("data-state", "modified-two-digits");
        secondsTimerInput.value = `${currentSecondsValue.charAt(
          1
        )}${nextBtnPress}`;
        secondsTimerInput.setSelectionRange(0, 2);
        secondsTimerInput.focus();
        isInput();
      } else if (
        // minutes
        secondsState === "modified-two-digits" &&
        minutesState === "unmodified" &&
        hoursState === "unmodified"
      ) {
        minutesTimerInput.setAttribute("data-state", "modified-one-digit");
        minutesTimerInput.value = nextBtnPress.padStart(2, "0");
        minutesTimerInput.setSelectionRange(1, 2);
        minutesTimerInput.focus();
        secondsTimerInput.style.color = "var(--txt-color)";
        isInput();
      } else if (
        secondsState === "modified-two-digits" &&
        minutesState === "modified-one-digit" &&
        hoursState === "unmodified"
      ) {
        minutesTimerInput.setAttribute("data-state", "modified-two-digits");
        minutesTimerInput.value = `${currentMinutesValue.charAt(
          1
        )}${nextBtnPress}`;
        minutesTimerInput.setSelectionRange(0, 2);
        minutesTimerInput.focus();
        secondsTimerInput.style.color = "var(--txt-color)";
        isInput();
      } else if (
        // hours
        secondsState === "modified-two-digits" &&
        minutesState === "modified-two-digits" &&
        hoursState === "unmodified"
      ) {
        hoursTimerInput.setAttribute("data-state", "modified-one-digit");
        hoursTimerInput.value = nextBtnPress.padStart(2, "0");
        hoursTimerInput.setSelectionRange(1, 2);
        hoursTimerInput.focus();
        secondsTimerInput.style.color = "var(--txt-color)";
        minutesTimerInput.style.color = "var(--txt-color)";
        isInput();
      } else if (
        secondsState === "modified-two-digits" &&
        minutesState === "modified-two-digits" &&
        hoursState === "modified-one-digit"
      ) {
        hoursTimerInput.setAttribute("data-state", "modified-two-digits");
        hoursTimerInput.value = `${currentMinutesValue.charAt(
          1
        )}${nextBtnPress}`;
        hoursTimerInput.setSelectionRange(0, 2);
        hoursTimerInput.focus();
        secondsTimerInput.style.color = "var(--txt-color)";
        minutesTimerInput.style.color = "var(--txt-color)";
        isInput();
      }
    }
  };

  const handleBackspace = () => {
    const currentSecondsValue = secondsTimerInput.value;
    const currentMinutesValue = minutesTimerInput.value;
    const currentHoursValue = hoursTimerInput.value;
    let secondsState = secondsTimerInput.getAttribute("data-state");
    let minutesState = minutesTimerInput.getAttribute("data-state");
    let hoursState = hoursTimerInput.getAttribute("data-state");
    if (
      // seconds
      secondsState === "modified-one-digit" &&
      minutesState === "unmodified" &&
      hoursState === "unmodified"
    ) {
      secondsTimerInput.setAttribute("data-state", "unmodified");
      secondsTimerInput.value = "00";
      secondsTimerInput.style.color = "var(--txt-color-muted)";
      secondsTimerInput.setSelectionRange(0, 0);
      isInput();
    } else if (
      secondsState === "modified-two-digits" &&
      minutesState === "unmodified" &&
      hoursState === "unmodified"
    ) {
      secondsTimerInput.setAttribute("data-state", "modified-one-digit");
      secondsTimerInput.value = `${currentSecondsValue
        .charAt(0)
        .padStart("2", "0")}`;
      secondsTimerInput.style.color = "var(--txt-color-muted)";
      secondsTimerInput.setSelectionRange(1, 2);
      secondsTimerInput.focus();
    } else if (
      // minutes
      minutesState === "modified-one-digit" &&
      secondsState === "modified-two-digits" &&
      hoursState === "unmodified"
    ) {
      minutesTimerInput.setAttribute("data-state", "unmodified");
      minutesTimerInput.value = "00";
      minutesTimerInput.style.color = "var(--txt-color-muted)";
      minutesTimerInput.setSelectionRange(0, 0);
    } else if (
      minutesState === "modified-two-digits" &&
      secondsState === "modified-two-digits" &&
      hoursState === "unmodified"
    ) {
      minutesTimerInput.setAttribute("data-state", "modified-one-digit");
      minutesTimerInput.value = `${currentMinutesValue
        .charAt(0)
        .padStart("2", "0")}`;
      minutesTimerInput.style.color = "var(--txt-color-muted)";
      minutesTimerInput.setSelectionRange(1, 2);
      minutesTimerInput.focus();
    } else if (
      // hours
      hoursState === "modified-one-digit" &&
      secondsState === "modified-two-digits" &&
      minutesState === "modified-two-digits"
    ) {
      hoursTimerInput.setAttribute("data-state", "unmodified");
      hoursTimerInput.value = "00";
      hoursTimerInput.setSelectionRange(0, 0);
    } else if (
      hoursState === "modified-two-digits" &&
      secondsState === "modified-two-digits" &&
      minutesState === "modified-two-digits"
    ) {
      hoursTimerInput.setAttribute("data-state", "modified-one-digit");
      hoursTimerInput.value = `${currentHoursValue
        .charAt(0)
        .padStart("2", "0")}`;
      hoursTimerInput.style.color = "var(--txt-color-muted)";
      hoursTimerInput.setSelectionRange(1, 2);
      hoursTimerInput.focus();
    }
  };

  numpadButtons.forEach((button) => {
    button.onclick = () => {
      isInput();
      if (button === numpadBack) {
        handleBackspace();
      } else {
        updateInput(button.textContent);
      }
    };
  });

  //countdown

  let timeout = null;
  let paused = false;
  let timeRemaining = 0;
  let circleDashArray = 283;
  const fullDashArray = 283;
  let originalInitialSeconds = 0;
  let interval = null;

  const handleCountdown = (initalValue, initialSeconds) => {
    originalInitialSeconds;
    timeDisplay.innerHTML = initalValue;
    let timePassed = 0;
    timeRemaining = initialSeconds;

    const updateCountdown = () => {
      if (initialSeconds === timePassed || paused) {
        clearTimeout(timeout);
        return;
      }

      if (timeRemaining <= 5) {
        remainingCircle.style.stroke = "#c05de7";
        timeDisplay.style.color = "#c05de7";
      }

      if (timeRemaining <= 1) {
        setTimeout(() => {
          countdownButtonPause.style.display = "none";
          flashingSvg.setAttribute("data-flashing", "");
          remainingCircle.style.stroke = "transparent";
          alert.play();
          alert.loop = true;
        }, 1000);
      }

      timePassed += 1;
      timeRemaining = initialSeconds - timePassed;
      timeDisplay.innerHTML = countdownText(timeRemaining);
      circleDashArray = `${(
        (timeRemaining / originalInitialSeconds) *
        fullDashArray
      ).toFixed(0)} 283`;

      remainingCircle.setAttribute("stroke-dasharray", circleDashArray);
      timeout = setTimeout(updateCountdown, 1000);
    };
    timeout = setTimeout(updateCountdown, 1000);
  };

  countdownButtonPause.addEventListener("click", (e) => {
    e.preventDefault();
    paused = !paused;
    if (!paused) {
      handleCountdown(countdownText(timeRemaining), timeRemaining);
      countdownButtonPause.innerHTML =
        "<ion-icon name='pause-circle-outline'></ion-icon>";
    } else {
      countdownButtonPause.innerHTML =
        "<ion-icon name='play-circle-outline'></ion-icon>";
    }
  });

  countdownButtonStop.addEventListener("click", (e) => {
    e.preventDefault();
    remainingCircle.style.stroke = "#acfce8";
    timeDisplay.style.color = "#acfce8";
    flashingSvg.removeAttribute("data-flashing");
    clearInterval(interval);
    alert.pause();
    alert.currentTime = 0;
    secondsTimerInput.setAttribute("data-state", "unmodified");
    minutesTimerInput.setAttribute("data-state", "unmodified");
    hoursTimerInput.setAttribute("data-state", "unmodified");
    startTimerBtn.removeAttribute("data-pop-out");
    startTimerBtn.style.display = "none";
    secondsTimerInput.value = "00";
    minutesTimerInput.value = "00";
    hoursTimerInput.value = "00";
    timerInputSection.style.animation = "none";
    timerInputSection.style.display = "block";
    animatePopIn(timerInputSection);
    controlsTimer.style.display = "flex";
    animatePopIn(startTimerBtn);
    animatePopOut(countdownContainer);
    countdownButtonPause.style.display = "none";
    countdownButtonStop.style.display = "none";
    clearTimeout(timeout);
    remainingCircle.setAttribute("stroke-dasharray", "283 283");
  });

  const countdownText = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const hoursString = hours.toString().padStart(2, "0");
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const minutesString = minutes.toString().padStart(2, "0");
    const remainingSecondsAfterMinutes = remainingSeconds % 60;
    const secondsString = remainingSecondsAfterMinutes
      .toString()
      .padStart(2, "0");
    return `${hoursString}:${minutesString}:${secondsString}`;
  };

  startTimerBtn.onclick = (e) => {
    e.preventDefault();
    console.log(circleDashArray);
    let currentSecondsValue = secondsTimerInput.value;
    let currentMinutesValue = minutesTimerInput.value;
    let currentHoursValue = hoursTimerInput.value;
    let totalSeconds =
      parseInt(currentSecondsValue) +
      parseInt(currentMinutesValue) * 60 +
      parseInt(currentHoursValue) * 3600;
    timerInputSection.style.animation = "animate-pop-out 200ms forwards";
    animatePopOut(timerInputSection);
    controlsTimer.style.display = "none";
    animatePopIn(startTimerBtn);
    animatePopIn(countdownContainer);
    countdownButtonPause.style.display = "grid";
    countdownButtonStop.style.display = "grid";
    handleCountdown(countdownText(totalSeconds), totalSeconds);
    originalInitialSeconds = totalSeconds;
  };
};
