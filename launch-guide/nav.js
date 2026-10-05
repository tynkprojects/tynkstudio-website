const NAV = [
  { href: "index.html", label: "Обзор" },
  { part: "Часть 1 · Apple" },
  { href: "apple.html", label: "Обзор части" },
  { href: "apple-1-1.html", label: "1.1 Создание записи приложения" },
  { href: "apple-1-2.html", label: "1.2 Сертификаты и profiles" },
  { href: "apple-1-3.html", label: "1.3 TestFlight" },
  { href: "apple-1-4.html", label: "1.4 Карточка приложения" },
  { href: "apple-1-5.html", label: "1.5 Submit for Review" },
  { part: "Часть 2 · Google" },
  { href: "google.html", label: "Обзор части" },
  { href: "google-2-1.html", label: "2.1 Панель управления" },
  { href: "google-2-2.html", label: "2.2 Тестирование и выпуск" },
  { href: "google-2-3.html", label: "2.3 Контент приложения" },
  { href: "google-2-4.html", label: "2.4 Безопасность данных" },
  { href: "google-2-5.html", label: "2.5 Реклама" },
  { href: "google-2-6.html", label: "2.6 Отправка на проверку" },
  { part: "Часть 3 · Meta" },
  { href: "meta.html", label: "Обзор части" },
  { href: "meta-3-1.html", label: "3.1 Business Manager" },
  { href: "meta-3-2.html", label: "3.2 Настройки приложения" },
  { href: "meta-3-3.html", label: "3.3 Платформа Android" },
  { href: "meta-3-4.html", label: "3.4 Events Manager" },
  { href: "meta-3-5.html", label: "3.5 Ads Manager" },
  { part: "Доп. интеграции" },
  { href: "integration-revenuecat.html", label: "RevenueCat" },
  { href: "integration-expo.html", label: "Expo" },
];

// data-i18n keys derived from href/position so this file stays the single
// source of truth for Russian labels; i18n.js only needs to supply translations.
function navKey(href) {
  return "nav_" + href.replace(".html", "").replace(/-/g, "_");
}

(function () {
  const el = document.getElementById("sidebar");
  if (!el) return;
  const here = location.pathname.split("/").pop() || "index.html";
  let html =
    '<div class="brand">App Launch Playbook</div>' +
    '<div class="brand-sub" data-i18n="nav_brand_sub">Внутренний документ</div><nav>';
  let partIndex = 0;
  for (const item of NAV) {
    if (item.part) {
      partIndex++;
      html += `<div class="part-label" data-i18n="nav_part_${partIndex}">${item.part}</div>`;
      continue;
    }
    const key = navKey(item.href);
    if (item.soon) {
      html += `<span class="nav-soon" data-i18n="${key}">${item.label} · скоро</span>`;
      continue;
    }
    const active = item.href === here ? ' class="active"' : "";
    html += `<a href="${item.href}"${active} data-i18n="${key}">${item.label}</a>`;
  }
  html +=
    '</nav><div class="private-note" data-i18n="nav_private_note">Приватная страница: не в sitemap и не индексируется. Скрины реальные; ID, email и ключи на них заблюрены.</div>';
  el.innerHTML = html;

  // Remember the sidebar's scroll position across full page navigations
  // (this is a static multi-page site, so every link click reloads the DOM
  // from scratch and would otherwise reset scroll to the top).
  const SCROLL_KEY = "sidebarScroll";
  try {
    const saved = parseInt(localStorage.getItem(SCROLL_KEY), 10);
    if (!Number.isNaN(saved)) el.scrollTop = saved;
  } catch (e) {
    /* storage blocked — just starts at the top, same as before */
  }
  let scrollSaveTimer = null;
  el.addEventListener("scroll", () => {
    clearTimeout(scrollSaveTimer);
    scrollSaveTimer = setTimeout(() => {
      try {
        localStorage.setItem(SCROLL_KEY, String(el.scrollTop));
      } catch (e) {
        /* storage blocked — position just won't persist */
      }
    }, 120);
  });
})();
