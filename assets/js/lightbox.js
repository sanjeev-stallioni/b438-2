(function () {
  var lightbox = document.getElementById("blogLightbox");
  if (!lightbox) return;

  var img = lightbox.querySelector(".lightbox-img");
  var btnClose = lightbox.querySelector(".lightbox-close");
  var btnPrev = lightbox.querySelector(".lightbox-prev");
  var btnNext = lightbox.querySelector(".lightbox-next");

  var images = [];
  var currentIndex = 0;

  // Collect all lightbox-trigger images on the page
  function collectImages() {
    images = [];
    var triggers = document.querySelectorAll(".lightbox-trigger");
    triggers.forEach(function (trigger) {
      var src = trigger.getAttribute("data-image");
      if (src) images.push(src);
    });
  }

  function open(index) {
    collectImages();
    if (images.length === 0) return;
    currentIndex = index;
    img.src = images[currentIndex];
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
    updateNav();
  }

  function close() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    img.src = "";
  }

  function prev() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    img.src = images[currentIndex];
    updateNav();
  }

  function next() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    img.src = images[currentIndex];
    updateNav();
  }

  function updateNav() {
    var hide = images.length <= 1;
    btnPrev.style.display = hide ? "none" : "";
    btnNext.style.display = hide ? "none" : "";
  }

  // Bind trigger buttons
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".lightbox-trigger");
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      var allTriggers = Array.from(
        document.querySelectorAll(".lightbox-trigger")
      );
      var idx = allTriggers.indexOf(trigger);
      open(idx >= 0 ? idx : 0);
    }
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", prev);
  btnNext.addEventListener("click", next);

  // Close on backdrop click
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) close();
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });
})();
