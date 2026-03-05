# Aurora Beads: Manuál pro správu e-shopu

Tento dokument slouží jako kompletní návod pro správu a aktualizaci Vašeho nového e-shopu. Systém je navržen tak, aby byl maximálně jednoduchý, rychlý a nevyžadoval žádné technické znalosti při běžném provozu.

## 🔗 Důležité odkazy
- **Web e-shopu:** [https://sofi-sari.pages.dev](https://sofi-sari.pages.dev)
- **Administrační panel:** [https://sofi-sari.pages.dev/admin](https://sofi-sari.pages.dev/admin)

---

## 📦 1. Správa produktů (Google Tabulka)
Veškerá data o produktech spravujete v přehledné Google Tabulce. Nemusíte se přihlašovat do žádného složitého systému.

**Jak přidat/upravit produkt:**
1. Otevřete svou Google Tabulku (eshop-koralky).
2. Upravte data v příslušných sloupcích:
   - **name:** Název produktu
   - **price:** Cena (pouze číslo)
   - **description:** Krátký popisek
   - **category:** Kategorie (např. Náramky, Náhrdelníky)
   - **imageUrl:** Odkaz na fotku produktu
   - **inStock:** `TRUE` (je skladem) nebo `FALSE` (není skladem)
3. Změny se v tabulce ukládají automaticky. 

*Poznámka: Změna v tabulce se na webu projeví až po provedení "Aktualizace webu" (viz bod 2).*

---

## 🚀 2. Aktualizace webu
Aby se změny z tabulky přenesly na web, je potřeba vyslat systému signál k přebudování stránek.

**Postup aktulizace:**
1. Jděte na adresu: [https://sofi-sari.pages.dev/admin](https://sofi-sari.pages.dev/admin)
2. **Zadejte heslo:** `NovaData1@`
3. Klikněte na tlačítko **"Aktualizovat web z Google Sheets"**.
4. Systém potvrdí odeslání signálu zelenou hláškou.

**Důležité:** Aktualizace webu trvá přibližně **1 až 2 minuty**. Během této doby se na pozadí připravuje nová verze stránek. Po uplynutí této doby stačí web v prohlížeči obnovit (F5) a uvidíte nové změny.

---

## � 3. Platební systém (Bankovní převod)
E-shop je v aktuální verzi nastaven na **platbu bankovním převodem**. Tento systém je pro začátek nejjednodušší na správu i poplatky.

**Jak probíhá objednávka:**
1. Zákazník vloží zboží do košíku a odešle objednávku přes pokladnu.
2. Vám (majiteli) přijde e-mail se všemi detaily objednávky a adresou zákazníka.
3. Zákazníkovi přijde potvrzovací e-mail s instrukcemi k platbě (číslo účtu, variabilní symbol - toto nastavíte v šabloně EmailJS).
4. Jakmile obdržíte platbu na účet, zboží odešlete.

---

## 📧 4. Nastavení e-mailů (EmailJS)
Aby e-maily odcházely, je potřeba v kódu (nebo přes nás) propojit službu [EmailJS.com](https://www.emailjs.com/). Tato služba je v základu zdarma (do 200 e-mailů/měsíc).

**Co je potřeba nastavit:**
1. Vytvořit si účet na EmailJS.
2. Propojit svůj e-mail (např. Gmail).
3. Vytvořit dvě šablony: jedna pro kontakt, jedna pro objednávky.
4. Do šablon si můžete napsat vlastní texty (např. právě to číslo účtu pro platbu).

---

## �🛠️ 5. Technické informace (pro správce)
- **Hosting:** Cloudflare Pages (vázáno na GitHub repozitář).
- **Technologie:** React, TypeScript, Vite.
- **Bezpečnost:** Administrace je chráněna heslem uloženým v environmentálních proměnných (VITE_ADMIN_PASSWORD).
- **Automatizace:** Data jsou stahována přímo z Google Sheets CSV exportu během procesu sestavení (build).

---

## ✅ 4. Podpora
Web je nastaven jako bezúdržbový. V případě potřeby technických úprav (změna designu, přidání funkcí) je nutné zasáhnout do zdrojového kódu na GitHubu.

---
*Vytvořeno s důrazem na rychlost, bezpečnost a moderní design.*
*Tým Aurora Beads | 2026*
