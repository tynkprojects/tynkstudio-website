const NAV = [
  { href: "index.html", label: "Обзор" },
  { part: "Часть 1 · Apple" },
  { href: "apple.html", label: "Обзор части" },
  { href: "apple-1-1.html", label: "1.1 Создание записи приложения" },
  { href: "apple-1-2.html", label: "1.2 Сертификаты и profiles", soon: true },
  { href: "apple-1-3.html", label: "1.3 TestFlight", soon: true },
  { href: "apple-1-4.html", label: "1.4 Карточка приложения", soon: true },
  { href: "apple-1-5.html", label: "1.5 Submit for Review", soon: true },
  { part: "Часть 2 · Google" },
  { href: "google.html", label: "Обзор части", soon: true },
  { part: "Часть 3 · Meta" },
  { href: "meta.html", label: "Обзор части", soon: true },
];

(function () {
  const el = document.getElementById("sidebar");
  if (!el) return;
  const here = location.pathname.split("/").pop() || "index.html";
  let html = '<div class="brand">App Launch Playbook</div><div class="brand-sub">Внутренний документ</div><nav>';
  for (const item of NAV) {
    if (item.part) { html += `<div class="part-label">${item.part}</div>`; continue; }
    if (item.soon) { html += `<span class="nav-soon">${item.label} · скоро</span>`; continue; }
    const active = item.href === here ? ' class="active"' : "";
    html += `<a href="${item.href}"${active}>${item.label}</a>`;
  }
  html += '</nav><div class="private-note">Приватная страница: не в sitemap и не индексируется. Скрины реальные; ID, email и ключи на них заблюрены.</div>';
  el.innerHTML = html;
})();
