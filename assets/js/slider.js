document.addEventListener("DOMContentLoaded", function () {
  var track = document.querySelector(".mmn-slider-track");
  var prevBtn = document.querySelector(".mmn-slider-prev");
  var nextBtn = document.querySelector(".mmn-slider-next");

  if (!track || !prevBtn || !nextBtn) return;

  var origSlides = Array.from(track.querySelectorAll(".mmn-slider-slide"));
  var total = origSlides.length;
  var autoplayTimer;
  var isTransitioning = false;
  var gap = 20;

  function getVisible() {
    if (window.innerWidth <= 767) return 2;
    if (window.innerWidth <= 991) return 3;
    return 5;
  }

  // Clone enough slides at both ends for seamless wrapping
  var clonesBefore = [];
  var clonesAfter = [];
  for (var i = 0; i < total; i++) {
    var after = origSlides[i].cloneNode(true);
    after.setAttribute("aria-hidden", "true");
    clonesAfter.push(after);
    track.appendChild(after);
  }
  for (var j = total - 1; j >= 0; j--) {
    var before = origSlides[j].cloneNode(true);
    before.setAttribute("aria-hidden", "true");
    clonesBefore.unshift(before);
    track.insertBefore(before, track.firstChild);
  }

  // index 0 = first original slide; prepended clones are at negative indices
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
    // If we've scrolled past the original slides, jump seamlessly
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

  var wrapper = track.closest(".mmn-slider-wrapper");
  wrapper.addEventListener("mouseenter", function () {
    clearInterval(autoplayTimer);
  });
  wrapper.addEventListener("mouseleave", function () {
    startAutoplay();
  });

  window.addEventListener("resize", function () {
    setPosition(false);
  });

  // Initial position
  setPosition(false);
  startAutoplay();
});
