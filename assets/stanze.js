/* ◉ LE STANZE SI ACCENDONO DALLA MACCHINA, NON DALLA PENNA.
 *
 * Una stanza compare in vetrina SOLO se il suo interruttore in config.js dice
 * `true` e c'è un BACKEND_URL. Altrimenti non c'è: non «in arrivo», non
 * «attiva» — non c'è.
 *
 * ── PERCHÉ ────────────────────────────────────────────────────────────────
 * Il 15/09 questa vetrina scriveva «La stanza delle verifiche · attiva» con
 * `VERIFICHE.ACCESE: false` e `BACKEND_URL: null`. Il badge era testo battuto
 * a mano: poteva mentire, e ha mentito. Il registro della galassia diceva la
 * stessa cosa, quindi il giro era verde.
 *   📜 Un giro che confronta la pagina col registro è verde quando mentono
 *      insieme. Da qui in poi la pagina non ha una sua opinione: legge.
 *
 * Il modello non è nuovo — la card «guarda fuori» faceva già così dal 19/08.
 * Questo file fa di quell'eccezione la regola, per tutte.
 *
 * ── LA SCELTA DI NASCONDERE, E COSA NON VUOL DIRE ─────────────────────────
 * Ordine del Direttore, 15/09: una stanza spenta si NASCONDE, non si mostra
 * chiusa. Non è un progetto archiviato — è il gioco che finalmente obbedisce
 * alla riga che ha in home dal primo giorno: «Chi fuori, per ora, guarda».
 * Mostrare stanze vuote a uno sconosciuto contraddiceva quella frase.
 * Il giorno che SQUELCH accende BACKEND_URL, le stanze tornano DA SOLE:
 * nessuno deve ricordarsi di riscrivere un badge.
 *
 * ⚠️ Si nasconde con l'attributo `hidden` GIÀ NELL'HTML, e questo file semmai
 *    scopre. Al contrario — visibili di default, nascoste da uno script — un
 *    browser che non esegue JS mostrerebbe tutto: si cade dalla parte
 *    onesta, non da quella comoda.
 *
 * — creato da JUDY, 2026-09-15
 */
(function () {
  var CFG = window.AnimaConfig || {};

  function interruttore(percorso) {
    return percorso.split('.').reduce(function (o, k) {
      return (o === null || o === undefined) ? undefined : o[k];
    }, CFG);
  }

  var motore = !!CFG.BACKEND_URL;   // senza motore nessuna stanza è accesa, qualunque cosa dica la sua chiave
  var stanze = document.querySelectorAll('[data-macchina]');

  for (var i = 0; i < stanze.length; i++) {
    var stanza = stanze[i];
    var accesa = motore && interruttore(stanza.getAttribute('data-macchina')) === true;
    if (!accesa) { stanza.hidden = true; continue; }

    stanza.hidden = false;
    stanza.classList.remove('spenta');
    var badge = stanza.querySelectorAll('.stato');
    for (var b = 0; b < badge.length; b++) {
      badge[b].textContent = 'attiva';
      badge[b].classList.remove('spento');
    }
    // i due testi alternativi già previsti dalle pagine: quello acceso, non quello in attesa
    var alt = stanza.querySelectorAll('[data-stato]');
    for (var a = 0; a < alt.length; a++) {
      alt[a].hidden = (alt[a].getAttribute('data-stato') !== 'attiva');
    }
    // un segnaposto «In arrivo» diventa la porta vera
    var presto = stanza.querySelector('.btn.presto[data-apre]');
    if (presto) {
      var link = document.createElement('a');
      link.className = 'btn';
      link.href = presto.getAttribute('data-apre');
      link.textContent = 'Entra';
      presto.replaceWith(link);
    }
  }
})();
