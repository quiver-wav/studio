# Studio · Radio Soverato — PWA

App di prenotazione delle sale dello studio (REC, ON AIR, SHOOT, LOUNGE), installabile
su iPhone come app a tutto schermo. Funzioni: account con admin, prenotazioni anche
ricorrenti, blackout slot, vista giorno/settimana, lista d'attesa, note di consegna
sala, bacheca con priorità e avvisi in home.

## File da caricare su GitHub (tutti nella RADICE del repo)

- `index.html` — pagina dell'app
- `app.js` — l'app compilata (React, un solo file)
- `config.js` — configurazione (vedi sotto)
- `sw.js` — service worker (uso offline)
- `manifest.webmanifest` — manifest PWA
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — icone
- `README.md` — questo file

## 1. Pubblicazione su GitHub Pages

1. Su github.com: **+ → New repository**, nome es. `studio`, **Public**,
   spunta "Add a README file" → **Create repository**
2. **Add file → Upload files** → trascina TUTTI i file dello zip
   (singolarmente, NON dentro una cartella) → **Commit changes**
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch **main**,
   cartella **/ (root)** → **Save**
4. Dopo 1-2 minuti l'app è su `https://TUOUSERNAME.github.io/studio/`

## 2. Installazione su iPhone

Apri l'URL in **Safari** → tasto **Condividi** → **Aggiungi alla schermata Home**.
Icona nera con il logo Radio Soverato, app a tutto schermo.

## 3. Modalità dati: IMPORTANTE

L'app ha due modalità, indicate nella schermata di accesso:

### Locale (default, config.js vuoto)
I dati restano nel browser del singolo dispositivo. Va bene per PROVARE l'app,
ma ogni telefono vede solo le proprie prenotazioni: NON è condivisa.

### Condivisa (consigliata): Supabase gratuito, ~10 minuti
Per avere prenotazioni e bacheca condivise tra tutti gli utenti:

1. Crea un account gratuito su [supabase.com](https://supabase.com) → **New project**
   (scegli una password per il database e la regione `eu-central`)
2. Nel progetto: **SQL Editor → New query**, incolla ed esegui:

```sql
create table if not exists studio_storage (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);
alter table studio_storage enable row level security;
create policy "lettura pubblica"  on studio_storage for select using (true);
create policy "scrittura pubblica" on studio_storage for insert with check (true);
create policy "modifica pubblica"  on studio_storage for update using (true);
```

3. Vai su **Project Settings → API** e copia:
   - **Project URL** (es. `https://abcdefgh.supabase.co`)
   - **anon public** key
4. Apri `config.js` nel repo GitHub (matita "Edit"), incolla i due valori
   tra le virgolette → **Commit changes**
5. Ricarica l'app: nella schermata di accesso vedrai "Modalità dati: condivisa".

Nota di sicurezza: con queste policy chiunque conosca l'URL può leggere/scrivere i
dati — va bene per un gruppo ristretto e fidato come lo studio, ma non metterci
dati sensibili e non riutilizzare PIN usati altrove. I PIN sono salvati in chiaro:
è un sistema "di cortesia", non una vera autenticazione.

## Aggiornamenti

Quando ti passo una nuova versione, ti basta ricaricare `app.js` (Upload files →
Commit): l'app installata si aggiorna alla prima apertura con connessione.

## Limiti noti

- Niente notifiche push: la lista d'attesa avvisa con un banner in home alla
  prossima apertura dell'app (i dati si aggiornano all'apertura e ogni 60 secondi).
- Il primo account registrato diventa amministratore.
