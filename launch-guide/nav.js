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

const APPLE_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>';
const GPLAY_SVG =
  '<svg viewBox="0 0 24 24" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M3.2 2.2L13 12L3.2 21.8Z" fill="#4285F4" stroke="#4285F4" stroke-width="0.6"/>' +
  '<path d="M3.2 2.2L16.6 9.6L13 12Z" fill="#34A853" stroke="#34A853" stroke-width="0.6"/>' +
  '<path d="M3.2 21.8L13 12L16.6 14.4Z" fill="#EA4335" stroke="#EA4335" stroke-width="0.6"/>' +
  '<path d="M16.6 9.6L21 12L16.6 14.4L13 12Z" fill="#FBBC04" stroke="#FBBC04" stroke-width="0.6"/></svg>';
const SIDE_FOOTER =
  '<div class="side-footer">' +
  '<div class="copyright"><svg class="copy-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="10" stroke-width="1.8"/><path d="M15.6 9.2A4.6 4.6 0 1 0 15.6 14.8" stroke-width="2"/></svg>' +
  "<span>2026 Tynk Studio</span></div>" +
  '<a class="copyright-link" href="https://tynkstudio.dev" target="_blank" rel="noopener">tynkstudio.dev</a>' +
  '<div class="app-links">' +
  '<div class="app-group"><span class="app-group-name">Pawnia</span><span class="app-group-badges">' +
  '<a href="https://apps.apple.com/us/app/pawnia/id6762463113" target="_blank" rel="noopener" title="Pawnia — App Store">' + APPLE_SVG + "</a>" +
  '<a href="https://play.google.com/store/apps/details?id=com.TynkStudio.Pawnia" target="_blank" rel="noopener" title="Pawnia — Google Play">' + GPLAY_SVG + "</a>" +
  "</span></div>" +
  '<div class="app-group"><span class="app-group-name">Реальный PM</span><span class="app-group-badges">' +
  '<a href="https://apps.apple.com/us/app/%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9-pm/id6809838216" target="_blank" rel="noopener" title="Реальный PM — App Store">' + APPLE_SVG + "</a>" +
  "</span></div>" +
  "</div></div>";

(function () {
  const el = document.getElementById("sidebar");
  if (!el) return;
  const here = location.pathname.split("/").pop() || "index.html";
  let html =
    '<div class="side-scroll">' +
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
    '</nav><div class="private-note" data-i18n="nav_private_note">Приватная страница: не в sitemap и не индексируется. Скрины реальные; ID, email и ключи на них заблюрены.</div>' +
    "</div>" +
    SIDE_FOOTER;
  el.innerHTML = html;

  // Remember the nav's scroll position across full page navigations
  // (this is a static multi-page site, so every link click reloads the DOM
  // from scratch and would otherwise reset scroll to the top).
  const scroller = el.querySelector(".side-scroll");
  const SCROLL_KEY = "sidebarScroll";
  try {
    const saved = parseInt(localStorage.getItem(SCROLL_KEY), 10);
    if (!Number.isNaN(saved)) scroller.scrollTop = saved;
  } catch (e) {
    /* storage blocked — just starts at the top, same as before */
  }
  let scrollSaveTimer = null;
  scroller.addEventListener("scroll", () => {
    clearTimeout(scrollSaveTimer);
    scrollSaveTimer = setTimeout(() => {
      try {
        localStorage.setItem(SCROLL_KEY, String(scroller.scrollTop));
      } catch (e) {
        /* storage blocked — position just won't persist */
      }
    }, 120);
  });
})();
