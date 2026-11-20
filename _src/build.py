#!/usr/bin/env python3
"""Сборка tynkstudio.dev: из шаблона _src/index.html – отдельная страница на каждый язык,
весь текст сразу в HTML (видят поисковики и ИИ без выполнения скриптов).

  /usr/bin/python3 _src/build.py
  -> index.html (en, x-default), ru/ de/ fr/ es/ pt/index.html, sitemap.xml

Тексты правим в шаблоне: объект T (переводы) и META ниже. Папка _src на сайт не публикуется.
"""
import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://tynkstudio.dev"
LANGS = ["en", "ru", "de", "fr", "es", "pt"]          # первый – корень сайта
LOCALE = {"en": "en_US", "ru": "ru_RU", "de": "de_DE", "fr": "fr_FR", "es": "es_ES", "pt": "pt_PT"}

META = {
    "en": ("Tynk Studio – Mobile App & Software Development",
           "Mobile apps for iOS and Android, web apps and business software. In-house design and development team, no middlemen. MVP from €3,000, websites from €500. 7+ years of experience. Free consultation.",
           "Product studio building mobile apps, web services and business software. No middlemen: design, development and product in one team."),
    "ru": ("Tynk Studio – разработка мобильных приложений и ПО",
           "Разработка мобильных приложений iOS и Android с гарантией качества. Своя команда дизайнеров и разработчиков, без посредников. От 3000€ за MVP. 7+ лет опыта. Бесплатная консультация.",
           "Продуктовая студия по разработке мобильных приложений, веб-сервисов и коммерческого ПО. Работаем без посредников – дизайн, разработка и продукт внутри одной команды."),
    "de": ("Tynk Studio – App- und Softwareentwicklung",
           "Mobile Apps für iOS und Android, Web-Apps und Unternehmenssoftware. Eigenes Design- und Entwicklerteam, ohne Vermittler. MVP ab 3.000 €, Websites ab 500 €. Über 7 Jahre Erfahrung. Kostenlose Beratung.",
           "Produktstudio für mobile Apps, Webdienste und Unternehmenssoftware. Ohne Vermittler: Design, Entwicklung und Produkt in einem Team."),
    "fr": ("Tynk Studio – Développement d'applications mobiles et de logiciels",
           "Applications mobiles iOS et Android, applications web et logiciels d'entreprise. Équipe design et développement interne, sans intermédiaires. MVP dès 3 000 €, sites dès 500 €. Plus de 7 ans d'expérience. Consultation gratuite.",
           "Studio produit qui développe des applications mobiles, des services web et des logiciels d'entreprise. Sans intermédiaires : design, développement et produit dans une seule équipe."),
    "es": ("Tynk Studio – Desarrollo de apps móviles y software",
           "Apps móviles para iOS y Android, aplicaciones web y software empresarial. Equipo propio de diseño y desarrollo, sin intermediarios. MVP desde 3.000 €, webs desde 500 €. Más de 7 años de experiencia. Consulta gratuita.",
           "Estudio de producto que desarrolla apps móviles, servicios web y software empresarial. Sin intermediarios: diseño, desarrollo y producto en un mismo equipo."),
    "pt": ("Tynk Studio – Desenvolvimento de apps móveis e software",
           "Apps móveis para iOS e Android, aplicações web e software empresarial. Equipa própria de design e desenvolvimento, sem intermediários. MVP desde 3000 €, sites desde 500 €. Mais de 7 anos de experiência. Consulta gratuita.",
           "Estúdio de produto que desenvolve apps móveis, serviços web e software empresarial. Sem intermediários: design, desenvolvimento e produto na mesma equipa."),
}
ONLY_RU_LD = ('"ItemList"', '"FAQPage"')   # эти блоки разметки пока только на русском


def url(lang):
    return f"{SITE}/" if lang == LANGS[0] else f"{SITE}/{lang}/"


def translations(t):
    body = re.search(r"const T = \{(.*?)\n\};", t, re.S).group(1)
    out = {}
    for m in re.finditer(r"^\s{2}(\w\w):\{(.*)\},?\s*$", body, re.M):
        out[m.group(1)] = {k: v.replace('\\"', '"') for k, v in re.findall(r'(\w+):"((?:[^"\\]|\\.)*)"', m.group(2))}
    return out


def attr(s):
    return s.replace("&", "&amp;").replace('"', "&quot;")


def build(tpl, lang, tr):
    t = tpl
    d = tr[lang]
    t = re.sub(r'(<(\w+)\b[^>]*\bdata-i18n="(\w+)"[^>]*>)(.*?)(</\2>)',
               lambda m: m.group(1) + d.get(m.group(3), m.group(4)) + m.group(5), t, flags=re.S)
    t = t.replace('<html lang="ru">', f'<html lang="{lang}">', 1)
    title, desc, org = META[lang]
    t = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", t, 1)
    t = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{attr(desc)}">', t, 1)
    links = "\n".join(f'<link rel="alternate" hreflang="{l}" href="{url(l)}">' for l in LANGS)
    links += f'\n<link rel="alternate" hreflang="x-default" href="{url(LANGS[0])}">'
    t = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url(lang)}">\n{links}', t, 1)
    for prop, val in (("og:url", url(lang)), ("og:title", title), ("og:description", desc), ("og:locale", LOCALE[lang])):
        t = re.sub(rf'<meta property="{prop}" content="[^"]*">', f'<meta property="{prop}" content="{attr(val)}">', t, 1)
    alts = "".join(f'<meta property="og:locale:alternate" content="{LOCALE[l]}">' for l in LANGS if l != lang)
    t = re.sub(r'<meta property="og:locale:alternate" content="[^"]*">', alts, t, 1)
    t = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{attr(title)}">', t, 1)
    t = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{attr(desc)}">', t, 1)
    t = re.sub(r'("@type": "Organization",[\s\S]*?"description": )"[^"]*"', lambda m: m.group(1) + json.dumps(org, ensure_ascii=False), t, 1)
    t = t.replace('"url": "https://tynkstudio.dev"', f'"url": "{SITE}/"')
    if lang != "ru":
        for block in re.findall(r'\n<!--[^\n]*-->\n<script type="application/ld\+json">.*?</script>\n', t, re.S):
            if any(k in block for k in ONLY_RU_LD):
                t = t.replace(block, "\n")
    if lang == LANGS[0]:
        # корень: первый визит с другим языком браузера – на страницу этого языка (Googlebot остаётся здесь)
        redirect = ("<script>(function(){var s=['ru','de','fr','es','pt'],l;try{l=localStorage.getItem('tynk_lang')}catch(e){}"
                    "if(!l){l=(navigator.language||'en').toLowerCase().split('-')[0]}"
                    "if(s.indexOf(l)>=0)location.replace('/'+l+'/'+location.hash)})()</script>\n")
        t = t.replace("<meta charset=\"UTF-8\">", "<meta charset=\"UTF-8\">\n" + redirect, 1)
    return t


def main():
    tpl = (ROOT / "_src/index.html").read_text(encoding="utf-8")
    tr = translations(tpl)
    for lang in LANGS:
        out = ROOT / ("index.html" if lang == LANGS[0] else f"{lang}/index.html")
        out.parent.mkdir(exist_ok=True)
        out.write_text(build(tpl, lang, tr), encoding="utf-8")
        print(out.relative_to(ROOT))
    alts = "".join(f'\n    <xhtml:link rel="alternate" hreflang="{l}" href="{url(l)}"/>' for l in LANGS)
    alts += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{url(LANGS[0])}"/>'
    urls = "".join(f"\n  <url>\n    <loc>{url(l)}</loc>\n    <lastmod>{date.today()}</lastmod>{alts}\n  </url>" for l in LANGS)
    (ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
                                      f'        xmlns:xhtml="http://www.w3.org/1999/xhtml">{urls}\n</urlset>\n', encoding="utf-8")
    print("sitemap.xml")


if __name__ == "__main__":
    main()
