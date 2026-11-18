"use strict";

const root = document.documentElement;
const dialog = document.querySelector(".site-dialog");
const search = dialog?.querySelector(".search-input");
let opener;

function fitDesktop() {
  root.style.setProperty("--canvas-zoom", Math.min(1, root.clientWidth / 1920));
}

function openSections(button, focusSearch, section) {
  if (!dialog) return;
  opener = button;
  opener.setAttribute("aria-expanded", "true");
  dialog.querySelectorAll("[data-section-panel]").forEach((panel) => {
    panel.hidden = Boolean(section && panel.dataset.sectionPanel !== section);
  });
  dialog.classList.toggle("single-section", Boolean(section));
  dialog.showModal();
  if (focusSearch) search?.focus();
}

function filterSections() {
  const query = search.value
    .trim()
    .toLocaleLowerCase("ru")
    .replaceAll("ё", "е");
  dialog.querySelectorAll(".page-list li").forEach((item) => {
    const title = item.textContent.toLocaleLowerCase("ru").replaceAll("ё", "е");
    item.hidden = !title.includes(query);
  });
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button?.dataset.action === "top")
    window.scrollTo({ top: 0, behavior: "smooth" });
  if (button?.dataset.action === "sections") openSections(button, false);
  if (button?.dataset.action === "section")
    openSections(button, false, button.dataset.section);
  if (button?.dataset.action === "search") openSections(button, true);
  if (event.target.closest(".dialog-close") || event.target === dialog)
    dialog?.close();
});

dialog?.addEventListener("close", () => {
  opener?.setAttribute("aria-expanded", "false");
  opener?.focus();
  if (search) {
    search.value = "";
    filterSections();
  }
});
search?.addEventListener("input", filterSections);

const question = document.querySelector("#question");
question?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!question.reportValidity()) return;
  let status = question.querySelector(".question-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "question-status";
    status.setAttribute("role", "status");
    question.append(status);
  }
  status.textContent = "Отправка пока недоступна.";
});

fitDesktop();
window.addEventListener("resize", fitDesktop);
