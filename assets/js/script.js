document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".nav-menu");

  // Hamburger toggle
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    menu.classList.toggle("open");
  });

  // Inject dropdown toggle buttons for mobile
  document.querySelectorAll(".has-dropdown").forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "dropdown-toggle";
    btn.setAttribute("aria-label", "Toggle dropdown");
    btn.innerHTML =
      '<svg class="chevron-icon" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // Insert toggle button after the nav-link
    const navLink = item.querySelector(".nav-link");
    navLink.after(btn);

    // Click the arrow button to toggle dropdown on mobile
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close other open dropdowns
      document.querySelectorAll(".has-dropdown.open").forEach((other) => {
        if (other !== item) other.classList.remove("open");
      });
      item.classList.toggle("open");
    });
  });

  // Sticky header on scroll
  const header = document.querySelector(".site-header");
  const headerHeight = header.offsetHeight;

  window.addEventListener("scroll", () => {
    if (window.scrollY > headerHeight) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 1024 &&
      !menu.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      menu.classList.remove("open");
      toggle.classList.remove("active");
      document.querySelectorAll(".has-dropdown.open").forEach((item) => {
        item.classList.remove("open");
      });
    }
  });
});
