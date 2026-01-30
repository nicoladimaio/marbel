import PreventivoFooter from "../../components/PreventivoFooter";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#317614] font-sans">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
            Privacy Policy
          </h1>
          <p className="text-lg text-[#475569] max-w-2xl mx-auto">
            Ultimo aggiornamento: [inserisci data]
          </p>
        </header>
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 sm:p-8 text-[#475569] leading-relaxed space-y-4">
          <p>
            La presente informativa descrive le modalità di trattamento dei dati
            personali degli utenti che visitano il sito dittamarbel.netlify.app
            o inviano una richiesta tramite il modulo di contatto o preventivo.
            Il trattamento avviene nel rispetto del Regolamento UE 679/2016
            (GDPR) e della normativa italiana vigente.
          </p>
          <p>
            <b>Dati raccolti e finalità:</b> Raccogliamo dati personali solo
            quando necessario (ad esempio tramite i moduli di contatto o
            preventivo). I dati sono utilizzati esclusivamente per rispondere
            alle richieste degli utenti. Utilizziamo Google Analytics per
            raccogliere dati statistici anonimi sulle visite al sito.
            L&apos;indirizzo IP viene anonimizzato e non consente
            l&apos;identificazione dell&apos;utente. Google Analytics è
            configurato per non incrociare i dati raccolti con altre
            informazioni in possesso di Google e per non condividere i dati con
            terze parti.
          </p>
          <p>
            <b>Base giuridica e consenso:</b> Il trattamento dei dati raccolti
            tramite cookie analitici avviene solo previo consenso
            dell&apos;utente, espresso tramite il banner dei cookie. È sempre
            possibile modificare o revocare il consenso tramite il pulsante
            &quot;Gestisci preferenze cookie&quot; presente in basso a sinistra
            su ogni pagina.
          </p>
          <p>
            <b>Diritti dell&apos;utente:</b> L&apos;utente può richiedere in
            qualsiasi momento l&apos;accesso, la rettifica, la cancellazione o
            la limitazione dei propri dati personali scrivendo a info@marbel.it.
            Per maggiori dettagli sui cookie e sulle modalità di revoca del
            consenso, consultare la Cookie Policy.
          </p>
        </div>
      </div>
      <PreventivoFooter />
    </main>
  );
}
