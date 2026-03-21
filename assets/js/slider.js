document.addEventListener("DOMContentLoaded", function () {
  var wrappers = document.querySelectorAll(".mmn-slider-wrapper");

  wrappers.forEach(function (wrapper) {
    var track = wrapper.querySelector(".mmn-slider-track");
    var prevBtn = wrapper.querySelector(".mmn-slider-prev");
    var nextBtn = wrapper.querySelector(".mmn-slider-next");

    if (!track || !prevBtn || !nextBtn) return;

    var origSlides = Array.from(track.querySelectorAll(".mmn-slider-slide"));
    var total = origSlides.length;
    var autoplayTimer;
    var isTransitioning = false;
    var gap = 20;

    // Clone enough slides at both ends for seamless wrapping
    for (var i = 0; i < total; i++) {
      var after = origSlides[i].cloneNode(true);
      after.setAttribute("aria-hidden", "true");
      track.appendChild(after);
    }
    for (var j = total - 1; j >= 0; j--) {
      var before = origSlides[j].cloneNode(true);
      before.setAttribute("aria-hidden", "true");
      track.insertBefore(before, track.firstChild);
    }

    var index = 0;

    function getSlideWidth() {
      return track.querySelectorAll(".mmn-slider-slide")[0].offsetWidth + gap;
    }

    function setPosition(animate) {
      var offset = (index + total) * getSlideWidth();
      if (animate) {
        track.style.transition = "transform 0.8s ease";
      } else {
        track.style.transition = "none";
      }
      track.style.transform = "translateX(-" + offset + "px)";
    }

    function goTo(newIndex) {
      if (isTransitioning) return;
      isTransitioning = true;
      index = newIndex;
      setPosition(true);
    }

    track.addEventListener("transitionend", function () {
      isTransitioning = false;
      if (index >= total) {
        index = index - total;
        setPosition(false);
      } else if (index < 0) {
        index = index + total;
        setPosition(false);
      }
    });

    nextBtn.addEventListener("click", function () {
      goTo(index + 1);
      resetAutoplay();
    });

    prevBtn.addEventListener("click", function () {
      goTo(index - 1);
      resetAutoplay();
    });

    function startAutoplay() {
      autoplayTimer = setInterval(function () {
        goTo(index + 1);
      }, 3000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    wrapper.addEventListener("mouseenter", function () {
      clearInterval(autoplayTimer);
    });
    wrapper.addEventListener("mouseleave", function () {
      startAutoplay();
    });

    window.addEventListener("resize", function () {
      setPosition(false);
    });

    setPosition(false);
    startAutoplay();
  });
});
