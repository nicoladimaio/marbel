# Guida Progetto MarBel

Guida sintetica per orientarsi nel codice e lavorare in modo coerente sul progetto.

## 1) Architettura

- Framework: **Next.js App Router** (`src/app`)
- UI: **React + TypeScript + Tailwind CSS**
- Backend: **Firebase** (`Auth`, `Firestore`, `Storage`)
- Animazioni: **Framer Motion**

## 2) Struttura route

- Pagine pubbliche: `src/app/(public)/...`
  - `page.tsx` (homepage)
  - `chi-siamo/page.tsx`
  - `servizi/page.tsx`
  - `servizi/[slug]/page.tsx`
  - `portfolio/page.tsx`
  - `offerte/page.tsx`
  - `preventivo/page.tsx`
  - `contatti/page.tsx`
  - `privacy/page.tsx`, `cookie/page.tsx`
- Area admin: `src/app/admin/page.tsx`
- Login: `src/app/login/page.tsx`

## 3) Componenti condivisi

Percorso: `src/app/components`

- `Navbar.tsx` / `Footer.tsx`
- `Hero.tsx` (header dinamico pagine pubbliche)
- `PreventivoFooter.tsx` (CTA finale globale)
- `SocialBar.tsx`
- `AdminMenu.tsx`

## 4) Contenuti dinamici (Firestore)

- `homepage/hero`: immagine, posizione, titolo, sottotitolo hero homepage
- `portfolio`: lavori portfolio
- `categorie`, `macrocategorie`: tassonomia portfolio
- `luoghi`: luoghi associabili ai lavori
- `offerte`: contenuti offerte pubbliche
- `preventivo`: voci selezionabili nel form preventivo

## 5) Firebase config

File: `src/firebaseConfig.ts`

Espone le istanze usate nel progetto (`auth`, `db`, `storage`).

## 6) Flusso admin (alto livello)

- Login Firebase → accesso area amministrativa
- Dashboard con tab dedicate (categorie, luoghi, portfolio, offerte, preventivo, homepage)
- Upload immagini su Firebase Storage e metadati su Firestore

## 7) Convenzioni utili

- Navigazione interna: usare `next/link`
- Immagini: preferire `next/image`
- Tipi Firestore: evitare `any`, usare tipi espliciti
- Evitare duplicati di componenti/admin file non referenziati

## 8) Script progetto

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 9) Nota CTA finale

`PreventivoFooter` usa automaticamente l'immagine e la posizione del hero homepage (`homepage/hero`) come sfondo della CTA, con fallback locale in caso di assenza dati.
