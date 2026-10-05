// App Launch Playbook — pin/popover interaction

// Copy button on every command block.
document.querySelectorAll(".code-block").forEach((block) => {
  const btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Скопировать");
  btn.textContent = "⧉";
  btn.addEventListener("click", () => {
    const code = block.querySelector("pre").textContent;
    navigator.clipboard.writeText(code).then(() => {
      btn.classList.add("copied");
      btn.textContent = "✓";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "⧉";
      }, 1200);
    });
  });
  block.appendChild(btn);
});

// Legend above every screenshot; the blur row appears only where the screenshot has blur markers.
document.querySelectorAll(".mockup-wrap").forEach((wrap) => {
  const legend = document.createElement("div");
  legend.className = "pin-legend";
  legend.innerHTML =
    '<div class="row"><span class="pin sample"></span>' +
    '<span data-i18n="common_legend_pin">Нажми на значок «i» на скрине — откроется пояснение: что это за элемент, зачем он нужен, и ссылка на документацию.</span></div>';
  if (wrap.querySelector(".pin.blur-marker")) {
    legend.innerHTML +=
      '<div class="row"><span class="pin sample blur-marker"></span>' +
      '<span data-i18n="common_legend_blur">Фиолетовый значок — здесь данные скрыты (ID, email, ключ). Нажми — узнаешь, что именно скрыто и где это взять в своём аккаунте.</span></div>';
  }
  wrap.before(legend);
});

// One glyph for every pin (ring + "i"), drawn as exact geometry so it is identical on every screenshot.
const PIN_SVG =
  '<svg viewBox="0 0 16 16" aria-hidden="true">' +
  '<circle class="ring" cx="8" cy="8" r="7.15"/>' +
  '<circle class="glyph" cx="8" cy="5" r="1.15"/>' +
  '<rect class="glyph" x="7.1" y="7" width="1.8" height="5.2" rx="0.7"/>' +
  "</svg>";
document.querySelectorAll(".pin").forEach((pin) => {
  pin.innerHTML = PIN_SVG;
  if (!pin.classList.contains("sample")) pin.setAttribute("aria-label", "Пояснение");
});

// Callout icons: the bulb and the warning triangle are drawn, the rest stay emoji.
const BULB_SVG =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><g stroke="#16a34a" stroke-width="1.8" stroke-linecap="round">' +
  '<line x1="12" y1="0" x2="12" y2="2.5"/><line x1="3.5" y1="3.5" x2="5.3" y2="5.3"/><line x1="20.5" y1="3.5" x2="18.7" y2="5.3"/>' +
  '<line x1="1" y1="11" x2="3.5" y2="11"/><line x1="20.5" y1="11" x2="23" y2="11"/></g>' +
  '<path fill="#22c55e" d="M12 4a6.5 6.5 0 0 0-3.8 11.8c.5.36.8.95.8 1.57V18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.63c0-.62.3-1.2.8-1.57A6.5 6.5 0 0 0 12 4z"/>' +
  '<rect x="10" y="20" width="4" height="1.6" rx="0.8" fill="#16a34a"/></svg>';
const WARN_SVG =
  '<svg class="warn-ic" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="warnGrad" x1="0" y1="0" x2="0" y2="1">' +
  '<stop offset="0" stop-color="#FFC800"/><stop offset="1" stop-color="#FF8A00"/></linearGradient></defs>' +
  '<path d="M12 2.6L22.2 20.6H1.8L12 2.6Z" fill="url(#warnGrad)" stroke="url(#warnGrad)" stroke-width="2.6" stroke-linejoin="round"/>' +
  '<path d="M12 2.6L22.2 20.6H1.8L12 2.6Z" fill="none" stroke="#D96A00" stroke-width="0.7" stroke-linejoin="round" opacity="0.55"/>' +
  '<rect x="10.6" y="8" width="2.8" height="7.6" rx="1.4" fill="#1a1a1a"/><circle cx="12" cy="17.9" r="1.55" fill="#1a1a1a"/></svg>';
document.querySelectorAll(".callout-box .icon").forEach((icon) => {
  const t = icon.textContent.trim();
  if (t === "💡") icon.innerHTML = BULB_SVG;
  else if (t === "⚠️" || t === "⚠") icon.innerHTML = WARN_SVG;
});

// #pincheck: geometry report used by the render checks (overlaps, pins outside the photo).
if (location.hash === "#pincheck") {
  const report = [];
  document.querySelectorAll(".mockup").forEach((m, mi) => {
    const mr = m.getBoundingClientRect();
    const pins = [...m.querySelectorAll(".pin")].map((p) => {
      const r = p.getBoundingClientRect();
      return { id: p.dataset.id, cx: r.left + r.width / 2, cy: r.top + r.height / 2, r };
    });
    pins.forEach((p, i) => {
      const out = p.r.left < mr.left - 11 || p.r.right > mr.right + 11 || p.r.top < mr.top - 11 || p.r.bottom > mr.bottom + 11;
      if (out) report.push(`mockup${mi} ${p.id}: outside photo`);
      for (let j = i + 1; j < pins.length; j++) {
        const q = pins[j];
        const d = Math.hypot(p.cx - q.cx, p.cy - q.cy);
        if (d < 18) report.push(`mockup${mi} ${p.id}~${q.id}: ${d.toFixed(1)}px apart`);
      }
    });
  });
  const pre = document.createElement("pre");
  pre.id = "pincheck-out";
  pre.textContent = "PINCHECK " + (report.length ? report.join(" | ") : "OK") + " :: pins=" + document.querySelectorAll(".mockup .pin").length;
  document.body.appendChild(pre);
}

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
