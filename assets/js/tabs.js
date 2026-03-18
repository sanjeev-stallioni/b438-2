// Panel Tabs
document.querySelectorAll(".panel-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const container = tab.closest(".panel-tabs-section");
    container.querySelectorAll(".panel-tab").forEach((t) => t.classList.remove("active"));
    container.querySelectorAll(".panel-tab-pane").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const pane = container.querySelector("#tab-" + tab.getAttribute("data-tab"));
    if (pane) pane.classList.add("active");
  });
});
