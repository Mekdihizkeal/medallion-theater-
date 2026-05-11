const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

document.querySelectorAll(".movie-overlay a").forEach((link) => {
  link.addEventListener("click", () => {
    showToast(`${link.closest(".movie-overlay").querySelector("h2").textContent} selected.`);
  });
});
