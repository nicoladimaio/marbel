# Guida Progetto - Impresa Edile

Questa guida ti aiuta a capire la struttura e il funzionamento del progetto step by step.

## Struttura del progetto

- **Next.js**: Framework React che gestisce routing, SEO, performance e API.
- **src/app/**: Ogni cartella rappresenta una route (pagina). Il file `page.tsx` è la pagina associata.
- **Tailwind CSS**: Per lo stile moderno e responsive.
- **firebase**: Backend per autenticazione e gestione dati.
- **react-router-dom**: (installato, ma con Next.js il routing è gestito nativamente)
- **react-helmet-async**: Per gestire i metatag SEO dinamici.

## Routing

Con Next.js App Router:

- Ogni cartella in `src/app/` è una route (es: `/offerte`, `/chi-siamo`)
- Il file `page.tsx` dentro la cartella è la pagina visualizzata per quella route
- Puoi aggiungere layout, error, loading, ecc. per ogni route

## Pagine

- Homepage: `src/app/page.tsx`
- Chi Siamo: `src/app/chi-siamo/page.tsx`
- Offerte: `src/app/offerte/page.tsx`
- Portfolio lavori: `src/app/portfolio/page.tsx`
- Preventivo: `src/app/preventivo/page.tsx`
- Contatti: `src/app/contatti/page.tsx`
- Login: `src/app/login/page.tsx`
- Admin: `src/app/admin/page.tsx`

## Come aggiungere una nuova pagina

1. Crea una cartella in `src/app/` con il nome della route
2. Aggiungi un file `page.tsx` con il componente React della pagina

## Navigazione

Per la navigazione tra pagine, si usano i componenti `<Link>` di Next.js:

```tsx
import Link from "next/link";

<Link href="/offerte">Offerte</Link>;
```

## SEO

Per gestire i metatag SEO, si usa `react-helmet-async` oppure la configurazione nativa di Next.js (metadata in ogni pagina).

## Firebase

Firebase si integra per autenticazione, offerte, portfolio e preventivo. La configurazione avverrà nei prossimi step.

## Configurazione Firebase

1. Vai su https://console.firebase.google.com/ e crea un nuovo progetto.
2. Nel pannello Firebase, aggiungi una nuova app web e copia le credenziali (API key, projectId, ecc.).
3. Inserisci le credenziali nel file `src/firebaseConfig.ts`.
4. Il file esporta `auth` (autenticazione) e `db` (database Firestore) già pronti per l'uso.

Esempio di utilizzo:

```ts
import { auth, db } from "../firebaseConfig";
```

## Navbar e Navigazione globale

Abbiamo aggiunto una Navbar visibile su tutte le pagine:

- Il componente `Navbar` si trova in `src/app/components/Navbar.tsx`
- Viene importato e mostrato nel file `src/app/layout.tsx`, così appare su tutte le route
- I link usano `<Link href="/route">` di Next.js per navigare senza ricaricare la pagina

Esempio di aggiunta Navbar:

```tsx
import Navbar from "./components/Navbar";

<body>
  <Navbar />
  {children}
</body>;
```

La Navbar contiene i link alle pagine principali: Home, Chi Siamo, Offerte, Portfolio, Preventivo, Contatti, Login.

## Login con Firebase

La pagina di login (`src/app/login/page.tsx`) ora include:

- Un form con email e password
- Autenticazione tramite Firebase (`signInWithEmailAndPassword`)
- Gestione errori e stato di caricamento

Come funziona:

1. L'utente inserisce email e password
2. Al submit, viene chiamata la funzione di Firebase per autenticare
3. Se l'accesso va a buon fine, puoi gestire il redirect o mostrare un messaggio
4. Se c'è errore, viene mostrato sotto il form

Esempio di import:

```ts
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
```

## Protezione area admin e logout

La pagina admin (`src/app/admin/page.tsx`) ora:

- Controlla se l'utente è autenticato tramite Firebase
- Se non autenticato, fa redirect automatico alla pagina di login
- Mostra un bottone per il logout

Come funziona:

1. All'apertura della pagina, viene controllato lo stato utente con `onAuthStateChanged`
2. Se non c'è utente, si viene reindirizzati a `/login`
3. Se l'utente è autenticato, può vedere la pagina e cliccare su "Logout" per uscire

Esempio di import:

```ts
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
```

## Gestione Offerte, Portfolio e Preventivo in area admin

Nella pagina admin ora puoi:

- **Offerte**: aggiungere, visualizzare ed eliminare offerte (titolo, descrizione)
- **Portfolio**: aggiungere, visualizzare ed eliminare lavori (titolo, URL immagine)
- **Preventivo**: aggiungere, visualizzare ed eliminare voci (voce, prezzo)

Tutti i dati sono salvati su Firebase Firestore e vengono caricati in tempo reale.
Le immagini del portfolio sono ottimizzate con il componente `Image` di Next.js.

## Gestione avanzata area admin

- Area admin divisa in tab con effetto glass: Offerte, Portfolio, Preventivi
- Offerte: titolo, descrizione, immagine (ottimizzata)
- Portfolio: titolo, immagine, categoria (da menù a tendina), descrizione
- Preventivo: voci e prezzi

Prossimi step:

- Caricamento immagini su Firebase Storage (non solo URL)
- Menù a tendina per categorie portfolio, categorie editabili
- Pulsante + per aggiungere offerte e lavori

## Integrazione Firebase Storage

- Nel file `src/firebaseConfig.ts` è ora esportato anche `storage` per gestire l'upload delle immagini.
- Useremo Firebase Storage per caricare le immagini di offerte e portfolio, memorizzando l'URL in Firestore.

## Visualizzazione dati pubblici

Le pagine Offerte, Portfolio e Preventivo ora mostrano i dati salvati su Firebase Firestore in tempo reale.

- Offerte: elenco offerte con titolo e descrizione
- Portfolio: lavori con titolo e immagine
- Preventivo: tabella con voci e prezzi

Per personalizzare la visualizzazione, modifica i rispettivi file in `src/app/`.

---

Aggiornerò questa guida man mano che aggiungiamo funzionalità e pagine.
