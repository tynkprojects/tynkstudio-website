// App Launch Playbook — pin/popover interaction

// Legend above every screenshot; the blur row appears only where the screenshot has blur markers.
document.querySelectorAll(".mockup-wrap").forEach((wrap) => {
  const legend = document.createElement("div");
  legend.className = "pin-legend";
  legend.innerHTML =
    '<div class="row"><span class="pin sample">1</span>' +
    "<span>Нажми на цифру на скрине — откроется пояснение: что это за элемент, зачем он нужен, и ссылка на документацию.</span></div>";
  if (wrap.querySelector(".pin.blur-marker")) {
    legend.innerHTML +=
      '<div class="row"><span class="pin sample blur-marker">i</span>' +
      "<span>Здесь данные скрыты (ID, email, ключ). Нажми — узнаешь, что именно скрыто и где это взять в своём аккаунте.</span></div>";
  }
  wrap.before(legend);
});

// #open-p3 in the URL opens that popover on load (used to check popover placement in renders).
const openMatch = location.hash.match(/^#open-(.+)$/);
if (openMatch) {
  const pin = document.querySelector(`.pin[data-id="${openMatch[1]}"]`);
  const pop = pin && pin.closest(".mockup-wrap").querySelector(`.popover[data-for="${openMatch[1]}"]`);
  if (pop) {
    pop.classList.add("visible");
    pin.classList.add("open");
    pin.scrollIntoView({ block: "center" });
  }
}

document.addEventListener("click", (e) => {
  const pin = e.target.closest(".pin");
  document.querySelectorAll(".popover.visible").forEach((p) => {
    if (!pin || p.dataset.for !== pin.dataset.id) {
      p.classList.remove("visible");
    }
  });
  document.querySelectorAll(".pin.open").forEach((p) => {
    if (p !== pin) p.classList.remove("open");
  });
  if (pin) {
    const id = pin.dataset.id;
    const pop = pin.closest(".mockup-wrap").querySelector(`.popover[data-for="${id}"]`);
    if (pop) {
      pop.classList.toggle("visible");
      pin.classList.toggle("open");
    }
    e.stopPropagation();
  } else if (!e.target.closest(".popover")) {
    document.querySelectorAll(".popover.visible").forEach((p) => p.classList.remove("visible"));
  }
  if (e.target.closest(".close-x")) {
    const pop = e.target.closest(".popover");
    pop.classList.remove("visible");
    document.querySelectorAll(".pin.open").forEach((p) => p.classList.remove("open"));
  }
});
