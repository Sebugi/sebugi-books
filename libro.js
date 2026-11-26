// Pagina di un singolo libro: stesso meccanismo dell'app (frase, risposta, autovalutazione, grafico)
const LIBRO = document.body.dataset.libro;
const TITOLO = document.body.dataset.titolo;
const DATI = document.body.dataset.dati || '../data/frasi.json';
const LANG = document.documentElement.lang === 'en' ? 'en' : 'it';
const el = id => document.getElementById(id);
const GEN_EN = {Gotico: 'Gothic', Romanzo: 'Novel', Poesia: 'Poetry', Saggio: 'Essay', Avventura: 'Adventure', 'Giallo e thriller': 'Crime & thriller', Sentimentale: 'Romance', 'Per ragazzi': "Children's books", Fantascienza: 'Science fiction', Teatro: 'Theatre'};

const TXT = {
    it: {
        categorie: {corretto: 'Corretto', insicuro: 'Insicuro', sbagliato: 'Sbagliato', nonricordavo: 'Non ricordavo', nonsapevo: 'Non lo sapevo'},
        statTitolo: 'Le tue risposte',
        questo: 'Questa frase è proprio di ' + TITOLO + '.',
        avanti: 'Avanti', risultato: 'Vedi il risultato',
        punteggio: (p, n) => 'Ne hai riconosciute ' + p + ' su ' + n,
        alto: 'Ottimo, conosci bene questo libro e i suoi compagni di scaffale.',
        medio: 'Buon risultato. Nel quiz completo puoi allenarti su tutti i libri e ripassare gli errori.',
        basso: 'Si impara giocando: ogni frase che non conoscevi è una da ricordare. Riprova o passa al quiz completo.',
        dInfo: 'Verso <span id="numero">1</span> di <span id="totale">10</span> · Da quale canto?',
        dTitolo: (c, n) => c + ', canto ' + n,
        dDettaglio: (v, chi) => (v.includes('-') ? 'Versi ' : 'Verso ') + v + ' · Chi parla: ' + chi,
        dPunteggio: (p, n) => 'Ne hai riconosciuti ' + p + ' su ' + n,
        dAlto: 'Ottimo: questi canti li conosci bene.',
        dMedio: 'Buon risultato. Nell\'app ripassi canto per canto e rifai i versi sbagliati.',
        dBasso: 'Si impara ripassando: nell\'app scegli il canto che devi portare e ripassi i suoi versi.',
        dPausaTitolo: 'Quattro versi fatti!',
        dPausa: 'Puoi continuare con gli altri 6 versi del test, oppure passare all\'app: lì ripassi la Divina Commedia canto per canto, con 141 versi da riconoscere, le domande su canto, cantica e chi parla, e il ripasso dei versi sbagliati.',
        dContinua: 'Continua con gli altri 6 versi', dApp: 'Vai all\'app della Divina Commedia', dAppFine: 'Ripassa la Divina Commedia nell\'app'
    },
    en: {
        categorie: {corretto: 'Correct', insicuro: 'Unsure', sbagliato: 'Wrong', nonricordavo: 'I forgot it', nonsapevo: "I didn't know"},
        statTitolo: 'Your answers',
        questo: 'This phrase really is from ' + TITOLO + '.',
        avanti: 'Next', risultato: 'See your score',
        punteggio: (p, n) => 'You recognised ' + p + ' out of ' + n,
        alto: 'Excellent, you know this book and its shelf-mates well.',
        medio: 'Good score. In the full quiz you can practise on every book and review your mistakes.',
        basso: 'You learn by playing: every phrase you did not know is one to remember. Try again or move on to the full quiz.',
        dInfo: 'Verse <span id="numero">1</span> of <span id="totale">10</span> · Which canto?',
        dTitolo: (c, n) => c + ', canto ' + n,
        dDettaglio: (v, chi) => (v.includes('-') ? 'Lines ' : 'Line ') + v + ' · Speaker: ' + chi,
        dPunteggio: (p, n) => 'You recognised ' + p + ' out of ' + n,
        dAlto: 'Excellent: you know these cantos well.',
        dMedio: 'Good score. In the app you can study canto by canto and redo the verses you missed.',
        dBasso: 'You learn by reviewing: in the app you choose the canto you need and study its verses.',
        dPausaTitolo: 'Four verses done!',
        dPausa: 'You can carry on with the other 6 verses of the test, or move to the app: there you study the Divine Comedy canto by canto, with 141 verses to recognise in the original Italian and questions on canto, part and speaker.',
        dContinua: 'Continue with the other 6 verses', dApp: 'Open the Divine Comedy in the app', dAppFine: 'Study the Divine Comedy in the app'
    }
}[LANG];

const CATEGORIE = [
    ['corretto', 'btn-corretto'], ['insicuro', 'btn-insicuro'], ['sbagliato', 'btn-sbagliato'],
    ['nonricordavo', 'btn-nonricordo'], ['nonsapevo', 'btn-nonsapevo']
];

let domande = [];
let indice = 0;
let risposte = {};
// Divina Commedia: domande solo su Dante, risposta = canto, pausa dopo 4 versi
let DANTE = false;
let pausaFatta = false;
const ROMANI = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI',
    'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
    'XXXI', 'XXXII', 'XXXIII', 'XXXIV'];
const LINK_DANTE = '../' + (LANG === 'en' ? '../' : '') + '?libro=la-divina-commedia&lang=' + LANG;
const traccia = nome => { try { if (window.umami) umami.track(nome); } catch (e) {} };

function preparaDante() {
    el('info-frase').innerHTML = TXT.dInfo;
    const fine = el('fine').querySelector('a.bottone-principale');
    if (fine) { fine.href = LINK_DANTE; fine.textContent = TXT.dAppFine; fine.setAttribute('data-umami-event', 'dante-pagina-fine-app'); }
    const st = document.createElement('style');
    st.textContent = '#pausa-dante{background:var(--surface,#fffaf0);border:1px solid var(--line-strong,#cdb98f);border-radius:14px;padding:22px 18px;text-align:center;margin:0 0 16px;box-shadow:0 18px 44px rgba(70,50,20,.15)}' +
        '#pausa-dante h2{margin:0 0 8px}#pausa-dante p{margin:0 0 16px}#pausa-dante .bottone-principale{display:block;margin:0 0 10px}' +
        '#pausa-continua{display:block;width:100%;padding:14px;border-radius:10px;border:1px solid var(--line-strong,#cdb98f);background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer}';
    document.head.appendChild(st);
    const box = document.createElement('div');
    box.id = 'pausa-dante';
    box.style.display = 'none';
    box.innerHTML = '<h2></h2><p></p><a class="bottone-principale" data-umami-event="dante-pagina-app"></a><button type="button" id="pausa-continua" data-umami-event="dante-pagina-continua"></button>';
    box.querySelector('h2').textContent = TXT.dPausaTitolo;
    box.querySelector('p').textContent = TXT.dPausa;
    const a = box.querySelector('a');
    a.href = LINK_DANTE; a.textContent = TXT.dApp;
    const b = box.querySelector('button');
    b.textContent = TXT.dContinua;
    b.addEventListener('click', () => { box.style.display = 'none'; mostraDomanda(); el('card-frase').scrollIntoView({behavior: 'smooth', block: 'start'}); });
    el('quiz').insertBefore(box, el('quiz').firstChild);
}

function mostraPausa() {
    el('card-frase').style.display = 'none';
    el('risposta').style.display = 'none';
    el('btn-mostra-risposta').style.display = 'none';
    el('pausa-dante').style.display = 'block';
    el('pausa-dante').scrollIntoView({behavior: 'smooth', block: 'start'});
    traccia('dante-pagina-pausa');
}

function mescola(a) { return a.sort(() => Math.random() - 0.5); }

function disegnaStatistiche() {
    const tot = CATEGORIE.reduce((s, [k]) => s + (risposte[k] || 0), 0);
    el('statistiche').style.display = tot ? 'block' : 'none';
    if (!tot) return;
    el('stat-titolo').textContent = TXT.statTitolo + ' · ' + tot;
    el('stat-grafico').innerHTML = CATEGORIE.map(([k]) => {
        const n = risposte[k] || 0;
        const p = Math.round(n * 100 / tot);
        return `<div class="stat-col stat-${k}">
            <span class="stat-pct">${p}%</span>
            <div class="stat-asta"><div class="stat-riempi" style="height:${p}%"></div></div>
            <span class="stat-nome">${TXT.categorie[k]}</span>
            <span class="stat-n">${n}</span>
        </div>`;
    }).join('');
}

function testoDi(q) { return LANG === 'it' ? (q.it || q.testo) : (q.lingua === 'it' ? q.en : q.testo); }
function originaleDi(q) { return LANG === 'it' ? (q.lingua === 'en' ? q.testo : '') : (q.lingua === 'it' ? q.testo : ''); }

function mostraDomanda() {
    const q = domande[indice];
    el('numero').textContent = indice + 1;
    el('totale').textContent = domande.length;
    el('testo-frase').textContent = testoDi(q);
    el('testo-frase').classList.toggle('ha-virgolette', /["“”«»„]/.test(el('testo-frase').textContent));
    el('card-frase').style.display = 'block';
    el('btn-mostra-risposta').style.display = 'block';
    el('risposta').style.display = 'none';
}

function mostraRisposta() {
    const q = domande[indice];
    if (DANTE && q.cantica) {
        el('titolo-risposta').textContent = TXT.dTitolo(q.cantica, ROMANI[q.canto]);
        el('autore-risposta').textContent = TXT.dDettaglio(q.versi || '', q.personaggio || '');
        el('genere-risposta').textContent = '';
        el('traduzione-risposta').textContent = originaleDi(q);
        el('nota-libro').textContent = '';
        disegnaIllustrazione(q.genere);
        el('btn-mostra-risposta').style.display = 'none';
        el('risposta').style.display = 'block';
        return;
    }
    el('titolo-risposta').textContent = q.libro;
    el('autore-risposta').textContent = q.autore;
    el('genere-risposta').textContent = LANG === 'en' ? (GEN_EN[q.genere] || q.genere) : q.genere;
    // Nella pagina italiana la domanda è tradotta: sotto la risposta si vede l'originale inglese
    el('traduzione-risposta').textContent = originaleDi(q);
    el('nota-libro').textContent = q.libro === LIBRO ? TXT.questo : '';
    disegnaIllustrazione(q.genere);
    el('btn-mostra-risposta').style.display = 'none';
    el('risposta').style.display = 'block';
}

function registra(chiave) {
    risposte[chiave] = (risposte[chiave] || 0) + 1;
    disegnaStatistiche();
    indice++;
    if (DANTE && indice === 4 && !pausaFatta && domande.length > 4) { pausaFatta = true; mostraPausa(); return; }
    if (indice < domande.length) { mostraDomanda(); return; }
    el('card-frase').style.display = 'none';
    el('risposta').style.display = 'none';
    el('btn-mostra-risposta').style.display = 'none';
    el('fine').style.display = 'block';
    const giuste = risposte.corretto || 0;
    el('punteggio').textContent = (DANTE ? TXT.dPunteggio : TXT.punteggio)(giuste, domande.length);
    const p = giuste / domande.length;
    el('commento-fine').textContent = DANTE ? (p >= 0.8 ? TXT.dAlto : p >= 0.5 ? TXT.dMedio : TXT.dBasso)
        : (p >= 0.8 ? TXT.alto : p >= 0.5 ? TXT.medio : TXT.basso);
}

function inizia(tutte) {
    const conTesto = x => LANG === 'it' ? x.it : (x.lingua !== 'it' || x.en);
    if (!DANTE && tutte.some(x => x.libro === LIBRO && x.cantica)) { DANTE = true; preparaDante(); }
    if (DANTE) {
        // Dieci versi solo di Dante, celebri prima, un verso per canto finché si può
        const versi = tutte.filter(x => x.libro === LIBRO && x.cantica && conTesto(x));
        const ordinati = [...mescola(versi.filter(x => x.livello === 1)), ...mescola(versi.filter(x => x.livello !== 1))];
        const scelti = [], canti = new Set();
        ordinati.forEach(x => { const k = x.cantica + x.canto; if (scelti.length < 10 && !canti.has(k)) { scelti.push(x); canti.add(k); } });
        ordinati.forEach(x => { if (scelti.length < 10 && !scelti.includes(x)) scelti.push(x); });
        domande = mescola(scelti);
        indice = 0; risposte = {}; pausaFatta = false;
        el('fine').style.display = 'none';
        el('pausa-dante').style.display = 'none';
        disegnaStatistiche();
        mostraDomanda();
        return;
    }
    // Frasi di questo libro: prima le celebri, poi (se servono) alcune frasi scelte dal testo
    let proprie = mescola(tutte.filter(x => x.libro === LIBRO && x.livello === 1 && conTesto(x)));
    if (proprie.length < 4) {
        proprie = proprie.concat(mescola(tutte.filter(x => x.libro === LIBRO && x.vetrina && conTesto(x))).slice(0, 4 - proprie.length));
    }
    const altre = tutte.filter(x => x.libro !== LIBRO && x.livello === 1 && conTesto(x));
    const n = Math.min(5, proprie.length);
    domande = mescola([...proprie.slice(0, n), ...mescola(altre.slice()).slice(0, 10 - n)]);
    indice = 0; risposte = {};
    el('fine').style.display = 'none';
    disegnaStatistiche();
    mostraDomanda();
}

el('btn-mostra-risposta').addEventListener('click', mostraRisposta);
CATEGORIE.forEach(([k, id]) => el(id).addEventListener('click', () => registra(k)));
el('btn-ricomincia').addEventListener('click', () => fetch(DATI).then(r => r.json()).then(inizia));

fetch(DATI).then(r => r.json()).then(inizia);
