// Sebugi Books: ripasso della Divina Commedia per cantica e canto.
// Usa i dati e le funzioni di app.js (tutte, voti, idFrase, salvaVoti, T, ui, el, mostraSchermata).
// Il testo completo dei canti, con i momenti e chi parla, è in data/dante-canti.json.
const CANTICHE = ['Inferno', 'Purgatorio', 'Paradiso'];
const ROMANI = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI',
    'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
    'XXXI', 'XXXII', 'XXXIII', 'XXXIV'];
const DELLA = {
    it: { Inferno: "dell'Inferno", Purgatorio: 'del Purgatorio', Paradiso: 'del Paradiso' },
    en: { Inferno: 'of the Inferno', Purgatorio: 'of the Purgatorio', Paradiso: 'of the Paradiso' },
    de: { Inferno: 'des Infernos', Purgatorio: 'des Purgatoriums', Paradiso: 'des Paradieses' }
};
const dc = {
    cantiche: new Set(), canti: new Set(), domanda: 'pd', ambito: 'celebri',
    coda: [], i: 0, giuste: 0, sbagliate: [], q: null, chiuso: false, ultime: []
};
let CANTI_DC = null;      // dati di data/dante-canti.json
let caricaCanti = null;   // promessa del caricamento

const traccia = (nome, dati) => { try { if (window.umami) umami.track(nome, dati); } catch (e) {} };
const mescolaD = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const versiDante = () => tutte.filter(x => x.cantica);
const chiave = x => x.cantica + ' ' + x.canto;
const idCanto = x => x.cantica.toLowerCase() + '-' + x.canto;
const nomeCanto = (cantica, canto, breve) => breve ? T('danteCantoN', { n: ROMANI[canto] }) : cantica + ' ' + ROMANI[canto];
const daChiave = k => { const [c, n] = k.split(' '); return [c, Number(n)]; };
const intervallo = v => { const [a, b] = String(v).split('-').map(Number); return [a, b || a]; };

function datiCanti() {
    if (!caricaCanti) {
        caricaCanti = fetch('data/dante-canti.json?v=1').then(r => r.json()).then(d => { CANTI_DC = d; return d; })
            .catch(() => { caricaCanti = null; return null; });
    }
    return caricaCanti;
}

// Chi parla nei versi da a..b (se cambia, i nomi in ordine)
function chiParla(canto, a, b) {
    const nomi = [];
    for (let v = a; v <= b; v++) {
        const r = canto.parlanti.find(x => x.da <= v && v <= x.a);
        const p = r ? r.p : 'Dante';
        if (!nomi.includes(p)) nomi.push(p);
    }
    return nomi.join(ui === 'it' ? ' e ' : ui === 'de' ? ' und ' : ' and ');
}
const momentoDi = (canto, v) => canto.momenti.findIndex(m => m.da <= v && v <= m.a);

// Tutto il canto: una domanda per terzina (1-3, 4-6, ... e l'ultimo verso da solo)
function terzineDi(k) {
    const c = CANTI_DC && CANTI_DC[k];
    if (!c) return [];
    const L = c.versi.length, out = [];
    for (let a = 1; a <= L; a += 3) {
        const b = Math.min(a + 2, L);
        out.push({
            libro: 'La Divina Commedia', cantica: c.cantica, canto: c.canto, versi: a === b ? String(a) : a + '-' + b,
            testo: c.versi.slice(a - 1, b).join(' / '), personaggio: chiParla(c, a, b), terzina: true
        });
    }
    return out;
}

function poolDante() {
    const celebri = versiDante().filter(x =>
        (dc.cantiche.size === 0 || dc.cantiche.has(x.cantica)) && (dc.canti.size === 0 || dc.canti.has(chiave(x))));
    if (dc.ambito !== 'tutto' || !CANTI_DC) return celebri;
    const canti = [...new Set(celebri.map(idCanto))].filter(k => CANTI_DC[k]);
    return canti.flatMap(terzineDi);
}

function chip(box, testo, acceso, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (acceso ? ' on' : '');
    b.textContent = testo;
    b.setAttribute('aria-pressed', acceso);
    b.addEventListener('click', onClick);
    box.appendChild(b);
}

function disegnaDante() {
    const tutti = versiDante();
    // Cantiche
    const boxC = el('dc-cantiche');
    boxC.innerHTML = '';
    CANTICHE.forEach(c => chip(boxC, c, dc.cantiche.has(c), () => {
        if (dc.cantiche.has(c)) dc.cantiche.delete(c); else dc.cantiche.add(c);
        dc.canti.forEach(k => { if (dc.cantiche.size && !dc.cantiche.has(daChiave(k)[0])) dc.canti.delete(k); });
        disegnaDante();
    }));
    // Canti delle cantiche scelte
    const ammesse = dc.cantiche.size ? CANTICHE.filter(c => dc.cantiche.has(c)) : CANTICHE;
    const breve = ammesse.length === 1;
    const boxK = el('dc-canti');
    boxK.innerHTML = '';
    ammesse.forEach(c => {
        [...new Set(tutti.filter(x => x.cantica === c).map(x => x.canto))].sort((a, b) => a - b).forEach(n => {
            const k = c + ' ' + n;
            chip(boxK, nomeCanto(c, n, breve), dc.canti.has(k), () => {
                if (dc.canti.has(k)) dc.canti.delete(k);
                else { dc.canti.add(k); traccia('dante-scelta-canto', { canto: c + ' ' + ROMANI[n] }); }
                disegnaDante();
            });
        });
    });
    // Versi celebri oppure tutto il canto
    const boxA = el('dc-ambito');
    boxA.innerHTML = '';
    if (!CANTI_DC) dc.ambito = 'celebri';
    [['celebri', 'ambCelebri'], ['tutto', 'ambTutto']].forEach(([a, k]) => {
        if (a === 'tutto' && !CANTI_DC) return;
        chip(boxA, T(k), dc.ambito === a, () => { dc.ambito = a; disegnaDante(); });
    });
    // Tipo di domanda: solo quelle che hanno senso con la scelta fatta
    const pool = poolDante();
    const nCanti = new Set(pool.map(chiave)).size;
    const nCantiche = new Set(pool.map(x => x.cantica)).size;
    const tipi = [];
    if (CANTI_DC) tipi.push(['pd', 'dqPDBreve']);
    tipi.push(['chi', 'dqChiBreve']);
    if (nCanti > 1) tipi.push(['canto', 'dqCantoBreve']);
    if (nCantiche > 1) tipi.push(['cantica', 'dqCanticaBreve']);
    if (!tipi.some(([t]) => t === dc.domanda)) dc.domanda = tipi[0][0];
    const boxD = el('dc-domande');
    boxD.innerHTML = '';
    tipi.forEach(([t, k]) => chip(boxD, T(k), dc.domanda === t, () => { dc.domanda = t; disegnaDante(); }));
    el('btn-dante-inizia').textContent = T(dc.ambito === 'tutto' ? 'danteIniziaT' : 'danteInizia', { n: pool.length });
    el('btn-dante-inizia').disabled = pool.length === 0;
}

async function apriDante(cantoIndirizzo) {
    // cantoIndirizzo, se c'è: "inferno-5" (canto preselezionato da un annuncio o da un link)
    if (cantoIndirizzo) {
        const m = String(cantoIndirizzo).toLowerCase().match(/^(inferno|purgatorio|paradiso)-(\d+)$/);
        if (m) {
            const c = m[1][0].toUpperCase() + m[1].slice(1);
            if (versiDante().some(x => x.cantica === c && x.canto === Number(m[2]))) {
                dc.cantiche = new Set([c]);
                dc.canti = new Set([c + ' ' + Number(m[2])]);
            }
        }
    }
    await datiCanti();
    disegnaDante();
    mostraSchermata('schermata-dante');
}

function avviaDante(lista) {
    const scelti = lista || poolDante();
    if (!scelti.length) { alert(T('danteNessuno')); return; }
    dc.ultime = scelti;
    dc.coda = mescolaD(scelti);
    dc.i = 0; dc.giuste = 0; dc.sbagliate = [];
    el('dc-quiz').style.display = 'block';
    el('dc-fine').style.display = 'none';
    mostraSchermata('schermata-dante-gioco');
    if (!lista) traccia('dante-inizio-ripasso', { domanda: dc.domanda, ambito: dc.ambito, versi: scelti.length, canti: new Set(scelti.map(chiave)).size });
    mostraDomandaDante();
}

function opzioniDante(q) {
    const pool = dc.ultime.length ? dc.ultime : versiDante();
    const tutti = versiDante();
    if (dc.domanda === 'cantica') return { opz: CANTICHE.slice(), giusta: q.cantica };
    if (dc.domanda === 'chi') {
        const prendi = lista => [...new Set(lista.map(x => x.personaggio))].filter(p => p !== q.personaggio && !/ (e|and|und) /.test(p));
        let altri = mescolaD(prendi(pool.filter(x => x.cantica === q.cantica && x.canto === q.canto)));
        if (altri.length < 2) altri = altri.concat(mescolaD(prendi(pool.filter(x => x.cantica === q.cantica))).filter(p => !altri.includes(p)));
        if (altri.length < 2) altri = altri.concat(mescolaD(prendi(pool)).filter(p => !altri.includes(p)));
        if (altri.length < 2) altri = altri.concat(mescolaD(prendi(tutti.filter(x => x.cantica === q.cantica))).filter(p => !altri.includes(p)));
        if (altri.length < 2) altri = altri.concat(mescolaD(prendi(tutti)).filter(p => !altri.includes(p)));
        return { opz: mescolaD([q.personaggio, ...altri.slice(0, 2)]), giusta: q.personaggio };
    }
    // Quale canto: prima gli altri canti scelti della stessa cantica, poi gli altri canti della stessa cantica
    const k = chiave(q);
    const chiaviDi = lista => [...new Set(lista.map(chiave))].filter(x => x !== k);
    let altri = mescolaD(chiaviDi(pool.filter(x => x.cantica === q.cantica)));
    if (altri.length < 2) altri = altri.concat(mescolaD(chiaviDi(tutti.filter(x => x.cantica === q.cantica))).filter(x => !altri.includes(x)));
    const scelte = mescolaD([k, ...altri.slice(0, 2)]);
    const stessa = scelte.every(x => daChiave(x)[0] === q.cantica);
    const nome = x => { const [c, n] = daChiave(x); return nomeCanto(c, n, stessa); };
    return { opz: scelte.map(nome), giusta: nome(k), stessa };
}

function mostraDomandaDante() {
    const q = dc.q = dc.coda[dc.i];
    dc.chiuso = false;
    el('dc-num').textContent = T('danteNum', { i: dc.i + 1, n: dc.coda.length });
    el('dc-verso').textContent = q.testo.replace(/ \/ /g, '\n');
    const box = el('dc-opzioni');
    box.innerHTML = '';
    ['dc-pd', 'dc-aiuto', 'dc-scheda', 'dc-dopo'].forEach(id => { el(id).style.display = 'none'; });
    el('dc-nonso').style.display = 'none';
    el('dc-sotto').style.display = 'none';
    if (dc.domanda === 'pd') {
        el('dc-domanda').textContent = T('dqPD');
        el('dc-sotto').style.display = 'block';
        el('dc-pd').style.display = 'block';
        return;
    }
    const o = dc.opz = opzioniDante(q);
    let domanda = dc.domanda === 'chi' ? T('dqChi') : dc.domanda === 'cantica' ? T('dqCantica') : T('dqCanto');
    if (dc.domanda === 'canto' && o.stessa) domanda = T('dqCantoDi', { cantica: (DELLA[ui] || DELLA.it)[q.cantica] });
    el('dc-domanda').textContent = domanda;
    o.opz.forEach(t => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dc-opz';
        b.textContent = t;
        b.addEventListener('click', () => rispondiDante(b, t));
        box.appendChild(b);
    });
    el('dc-nonso').style.display = 'block';
}

function rispondiDante(bottone, scelta) {
    if (dc.chiuso) return;
    dc.chiuso = true;
    const q = dc.q, giusta = dc.opz.giusta;
    el('dc-opzioni').querySelectorAll('button').forEach(b => {
        b.disabled = true;
        if (b.textContent === giusta) b.classList.add('ok');
    });
    let voto;
    if (scelta === giusta) { dc.giuste++; voto = 'corretto'; el('dc-esito').textContent = T('danteEsatto'); }
    else {
        if (bottone) bottone.classList.add('no');
        voto = scelta === null ? 'nonsapevo' : 'sbagliato';
        dc.sbagliate.push(q);
        el('dc-esito').textContent = T('danteEra', { r: giusta });
    }
    if (!q.terzina) { voti[idFrase(q)] = voto; salvaVoti(); }
    el('dc-info').textContent = infoVerso(q);
    el('dc-avanti').textContent = dc.i < dc.coda.length - 1 ? T('avantiD') : T('risultatoD');
    el('dc-nonso').style.display = 'none';
    el('dc-dopo').style.display = 'block';
}

function infoVerso(q) {
    const versi = (q.versi || '').includes('-') ? T('danteVV', { v: q.versi }) : T('danteV', { v: q.versi });
    return T('danteInfo', { cantica: q.cantica, canto: ROMANI[q.canto], versi, chi: q.personaggio });
}

// ---------- Cosa viene prima e cosa viene dopo ----------
function cantoDi(q) { return CANTI_DC && CANTI_DC[idCanto(q)]; }

function aiutoDante() {
    const q = dc.q, c = cantoDi(q);
    if (!c) { schedaDante(); return; }
    traccia('dante-aiuto', { canto: idCanto(q) });
    const [a, b] = intervallo(q.versi);
    // Il momento che viene dopo; se il verso è nell'ultimo momento, quello che viene prima
    const dopo = momentoDi(c, b) < c.momenti.length - 1;
    const mio = dopo ? momentoDi(c, b) : momentoDi(c, a);
    const giusto = dopo ? mio + 1 : mio - 1;
    const altri = mescolaD(c.momenti.map((m, i) => i).filter(i => i !== mio && i !== giusto)).slice(0, 2);
    el('dc-pd').style.display = 'none';
    el('dc-aiuto-dom').textContent = T(dopo ? 'pdAiutoDopo' : 'pdAiutoPrima');
    const box = el('dc-aiuto-opz');
    box.innerHTML = '';
    mescolaD([giusto, ...altri]).forEach(i => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dc-opz';
        btn.textContent = c.momenti[i].t;
        btn.addEventListener('click', () => {
            box.querySelectorAll('button').forEach(x => { x.disabled = true; });
            btn.classList.add(i === giusto ? 'ok' : 'no');
            if (i !== giusto) [...box.children].forEach(x => { if (x.textContent === c.momenti[giusto].t) x.classList.add('ok'); });
            el('dc-aiuto-esito').textContent = T(i === giusto ? 'pdGiusto' : 'pdNo');
            el('dc-aiuto-esito').style.display = 'block';
            el('dc-aiuto-indietro').style.display = 'none';
            schedaDante();
        });
        box.appendChild(btn);
    });
    el('dc-aiuto-esito').style.display = 'none';
    el('dc-aiuto-indietro').style.display = 'block';
    el('dc-aiuto').style.display = 'block';
}

function schedaDante() {
    const q = dc.q, c = cantoDi(q);
    el('dc-pd').style.display = 'none';
    const [a, b] = intervallo(q.versi);
    const L = c.versi.length;
    const pezzo = (da, fino) => c.versi.slice(da - 1, fino).join('\n');
    const numeri = (da, fino) => da === fino ? T('danteV', { v: da }) : T('danteVV', { v: da + '-' + fino });
    el('dc-situazione').textContent = c.momenti[momentoDi(c, a)].t;
    if (a > 1) { const da = Math.max(1, a - 3); el('dc-prima-n').textContent = numeri(da, a - 1); el('dc-prima').textContent = pezzo(da, a - 1); }
    else { el('dc-prima-n').textContent = ''; el('dc-prima').textContent = T('pdInizio'); }
    if (b < L) { const fino = Math.min(L, b + 3); el('dc-dopo-n').textContent = numeri(b + 1, fino); el('dc-dopo-v').textContent = pezzo(b + 1, fino); }
    else { el('dc-dopo-n').textContent = ''; el('dc-dopo-v').textContent = T('pdFine'); }
    el('dc-pd-info').textContent = infoVerso(q);
    el('dc-scheda').style.display = 'block';
}

function valutaDante(voto) {
    const q = dc.q;
    if (voto === 'corretto') dc.giuste++; else dc.sbagliate.push(q);
    if (!q.terzina) { voti[idFrase(q)] = voto; salvaVoti(); }
    dc.i++;
    if (dc.i < dc.coda.length) { mostraDomandaDante(); window.scrollTo(0, 0); } else fineDante();
}

function fineDante() {
    el('dc-quiz').style.display = 'none';
    el('dc-fine').style.display = 'block';
    const n = dc.coda.length, g = dc.giuste;
    const pd = dc.domanda === 'pd';
    el('dc-punti').textContent = T(pd ? 'pdPunti' : 'dantePunti', { g, n });
    el('dc-commento').textContent = g / n >= 0.8 ? T('danteAlto') : g / n >= 0.5 ? T('danteMedio') : T('danteBasso');
    el('dc-rifai').textContent = dc.sbagliate.length ? T(pd ? 'pdRifai' : 'danteRifaiSbagliati', { n: dc.sbagliate.length }) : T('danteRifai');
    traccia('dante-fine-ripasso', { giuste: g, totale: n, domanda: dc.domanda });
    window.scrollTo(0, 0);
}

el('dc-avanti').addEventListener('click', () => {
    dc.i++;
    if (dc.i < dc.coda.length) { mostraDomandaDante(); window.scrollTo(0, 0); } else fineDante();
});
el('dc-nonso').addEventListener('click', () => rispondiDante(null, null));
el('dc-mostra').addEventListener('click', () => { schedaDante(); el('dc-scheda').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
el('dc-aiuto-btn').addEventListener('click', aiutoDante);
el('dc-aiuto-indietro').addEventListener('click', () => {
    el('dc-aiuto').style.display = 'none';
    el('dc-pd').style.display = 'block';
    window.scrollTo(0, 0);
});
el('dc-sapevo').addEventListener('click', () => valutaDante('corretto'));
el('dc-piumeno').addEventListener('click', () => valutaDante('insicuro'));
el('dc-nonsapevo').addEventListener('click', () => valutaDante('nonsapevo'));
el('dc-rifai').addEventListener('click', () => {
    const lista = dc.sbagliate.length ? dc.sbagliate.slice() : dc.ultime;
    avviaDante(lista);
});
el('dc-altri-canti').addEventListener('click', () => apriDante());
el('btn-dante-scelte').addEventListener('click', () => apriDante());
el('btn-dante-inizia').addEventListener('click', () => avviaDante());
el('btn-dante-home').addEventListener('click', () => { traccia('dante-da-home'); apriDante(); });
el('btn-dante-home2').addEventListener('click', () => { mostraHome(); disegnaStatistiche(); });
