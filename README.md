# MarBel Website

Sito vetrina + area amministrativa per MarBel, sviluppato con Next.js App Router, Firebase Firestore/Storage e Tailwind CSS.

## Stack tecnico

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Firebase (Auth, Firestore, Storage)
- Framer Motion

## Script disponibili

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Avvio locale

1. Installa dipendenze:

```bash
npm install
```

2. Avvia in sviluppo:

```bash
npm run dev
```

3. Apri `http://localhost:3000`.

## Struttura principale

- `src/app/(public)` → pagine pubbliche (`home`, `chi-siamo`, `servizi`, `portfolio`, `offerte`, `preventivo`, `contatti`, `privacy`, `cookie`)
- `src/app/admin/page.tsx` → dashboard amministrativa
- `src/app/components` → componenti condivisi (`Hero`, `Navbar`, `PreventivoFooter`, ecc.)
- `src/firebaseConfig.ts` → configurazione Firebase
- `src/data` → dataset statici di supporto

## Contenuti dinamici Firebase

- Hero homepage (`homepage/hero`)
- Portfolio (`portfolio`)
- Categorie/macrocategorie (`categorie`, `macrocategorie`)
- Luoghi (`luoghi`)
- Offerte (`offerte`)
- Voci preventivo (`preventivo`)

## Note operative

- Il componente `PreventivoFooter` usa automaticamente immagine e posizione del hero homepage come sfondo CTA (con fallback locale).
- Le pagine pubbliche usano `next/link` per navigazione interna e `next/image` per ottimizzazione immagini.
