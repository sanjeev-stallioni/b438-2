// Modal open/close helper
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Open modals via data-modal attribute (event delegation)
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-modal]");
  if (trigger) {
    e.preventDefault();
    openModal(trigger.getAttribute("data-modal"));
  }
});

// Close buttons
document.querySelectorAll("[data-modal-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const overlay = btn.closest(".modal-overlay");
    if (overlay) closeModal(overlay);
  });
});

// Close on overlay click
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal(overlay);
  });
});

// Close on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const active = document.querySelector(".modal-overlay.active");
    if (active) closeModal(active);
  }
});
