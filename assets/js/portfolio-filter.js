(function () {
  var filters = document.querySelectorAll(".portfolio-filter");
  var items = document.querySelectorAll(".portfolio-item");
  if (!filters.length || !items.length) return;

  function applyFilter(filter) {
    // Update active button
    filters.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-filter") === filter);
    });

    items.forEach(function (item) {
      var cats = item.getAttribute("data-categories");
      var shouldShow = filter === "all" || cats.indexOf(filter) !== -1;

      if (shouldShow) {
        if (item.classList.contains("hidden")) {
          item.classList.remove("hidden");
          void item.offsetHeight;
        }
        item.classList.remove("fade-out");
      } else {
        item.classList.add("fade-out");
        item.addEventListener("transitionend", function handler() {
          item.removeEventListener("transitionend", handler);
          if (item.classList.contains("fade-out")) {
            item.classList.add("hidden");
          }
        });
      }
    });
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      applyFilter(filter);
    });
  });

  // Apply filter from URL hash on page load
  var hash = window.location.hash.replace("#", "");
  if (hash) {
    applyFilter(hash);
  }
})();
