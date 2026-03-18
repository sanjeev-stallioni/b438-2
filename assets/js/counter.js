document.addEventListener("DOMContentLoaded", function () {
  var duration = 2000;

  function formatNumber(num, separator) {
    if (!separator) return num.toString();
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var separator = el.getAttribute("data-separator") || "";

    if (isNaN(target)) return;

    var startTime = performance.now();

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);

      el.textContent = formatNumber(current, separator) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target, separator) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".counter-number[data-count]").forEach(function (counter) {
    observer.observe(counter);
  });
});
