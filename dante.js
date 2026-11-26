// Sebugi Books: ripasso della Divina Commedia per cantica e canto.
// Usa i dati e le funzioni di app.js (tutte, voti, idFrase, salvaVoti, T, ui, el, mostraSchermata).
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
    cantiche: new Set(), canti: new Set(), domanda: 'canto',
    coda: [], i: 0, giuste: 0, sbagliate: [], q: null, chiuso: false, ultime: []
};

const traccia = (nome, dati) => { try { if (window.umami) umami.track(nome, dati); } catch (e) {} };
const mescolaD = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const versiDante = () => tutte.filter(x => x.cantica);
const chiave = x => x.cantica + ' ' + x.canto;
const nomeCanto = (cantica, canto, breve) => breve ? T('danteCantoN', { n: ROMANI[canto] }) : cantica + ' ' + ROMANI[canto];
const daChiave = k => { const [c, n] = k.split(' '); return [c, Number(n)]; };

function poolDante() {
    return versiDante().filter(x =>
        (dc.cantiche.size === 0 || dc.cantiche.has(x.cantica)) && (dc.canti.size === 0 || dc.canti.has(chiave(x))));
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
    // Tipo di domanda: solo quelle che hanno senso con la scelta fatta
    const pool = poolDante();
    const nCanti = new Set(pool.map(chiave)).size;
    const nCantiche = new Set(pool.map(x => x.cantica)).size;
    const tipi = [];
    if (nCanti > 1) tipi.push(['canto', 'dqCantoBreve']);
    tipi.push(['chi', 'dqChiBreve']);
    if (nCantiche > 1) tipi.push(['cantica', 'dqCanticaBreve']);
    if (!tipi.some(([t]) => t === dc.domanda)) dc.domanda = tipi[0][0];
    const boxD = el('dc-domande');
    boxD.innerHTML = '';
    tipi.forEach(([t, k]) => chip(boxD, T(k), dc.domanda === t, () => { dc.domanda = t; disegnaDante(); }));
    el('btn-dante-inizia').textContent = T('danteInizia', { n: pool.length });
    el('btn-dante-inizia').disabled = pool.length === 0;
}

function apriDante(cantoIndirizzo) {
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
    if (!lista) traccia('dante-inizio-ripasso', { domanda: dc.domanda, versi: scelti.length, canti: new Set(scelti.map(chiave)).size });
    mostraDomandaDante();
}

function opzioniDante(q) {
    const pool = dc.ultime.length ? dc.ultime : versiDante();
    const tutti = versiDante();
    if (dc.domanda === 'cantica') return { opz: CANTICHE.slice(), giusta: q.cantica };
    if (dc.domanda === 'chi') {
        const prendi = lista => [...new Set(lista.map(x => x.personaggio))].filter(p => p !== q.personaggio);
        let altri = mescolaD(prendi(pool.filter(x => x.cantica === q.cantica)));
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
    const o = dc.opz = opzioniDante(q);
    el('dc-num').textContent = T('danteNum', { i: dc.i + 1, n: dc.coda.length });
    let domanda = dc.domanda === 'chi' ? T('dqChi') : dc.domanda === 'cantica' ? T('dqCantica') : T('dqCanto');
    if (dc.domanda === 'canto' && o.stessa) domanda = T('dqCantoDi', { cantica: (DELLA[ui] || DELLA.it)[q.cantica] });
    el('dc-domanda').textContent = domanda;
    el('dc-verso').textContent = q.testo.replace(/ \/ /g, '\n');
    const box = el('dc-opzioni');
    box.innerHTML = '';
    o.opz.forEach(t => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dc-opz';
        b.textContent = t;
        b.addEventListener('click', () => rispondiDante(b, t));
        box.appendChild(b);
    });
    el('dc-nonso').style.display = 'block';
    el('dc-dopo').style.display = 'none';
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
    voti[idFrase(q)] = voto;
    salvaVoti();
    const versi = (q.versi || '').includes('-') ? T('danteVV', { v: q.versi }) : T('danteV', { v: q.versi });
    el('dc-info').textContent = T('danteInfo', { cantica: q.cantica, canto: ROMANI[q.canto], versi, chi: q.personaggio });
    el('dc-avanti').textContent = dc.i < dc.coda.length - 1 ? T('avantiD') : T('risultatoD');
    el('dc-nonso').style.display = 'none';
    el('dc-dopo').style.display = 'block';
}

function fineDante() {
    el('dc-quiz').style.display = 'none';
    el('dc-fine').style.display = 'block';
    const n = dc.coda.length, g = dc.giuste;
    el('dc-punti').textContent = T('dantePunti', { g, n });
    el('dc-commento').textContent = g / n >= 0.8 ? T('danteAlto') : g / n >= 0.5 ? T('danteMedio') : T('danteBasso');
    el('dc-rifai').textContent = dc.sbagliate.length ? T('danteRifaiSbagliati', { n: dc.sbagliate.length }) : T('danteRifai');
    traccia('dante-fine-ripasso', { giuste: g, totale: n });
    window.scrollTo(0, 0);
}

el('dc-avanti').addEventListener('click', () => {
    dc.i++;
    if (dc.i < dc.coda.length) { mostraDomandaDante(); window.scrollTo(0, 0); } else fineDante();
});
el('dc-nonso').addEventListener('click', () => rispondiDante(null, null));
el('dc-rifai').addEventListener('click', () => {
    const lista = dc.sbagliate.length ? dc.sbagliate.slice() : dc.ultime;
    avviaDante(lista);
});
el('dc-altri-canti').addEventListener('click', () => apriDante());
el('btn-dante-scelte').addEventListener('click', () => apriDante());
el('btn-dante-inizia').addEventListener('click', () => avviaDante());
el('btn-dante-home').addEventListener('click', () => { traccia('dante-da-home'); apriDante(); });
el('btn-dante-home2').addEventListener('click', () => { mostraHome(); disegnaStatistiche(); });
