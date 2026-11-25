// Illustrazioni in stile incisione seppia, una per genere. Bozze: da rifinire.
const INK = '#4a3a22';
const ILLUSTRAZIONI = {

// Gotico: finestra illuminata in un muro di pietra, con ramo spoglio e luna
'Gotico': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Una finestra gotica illuminata nella notte">
  <defs>
    <radialGradient id="luce" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#f3d58b" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#e2b865" stop-opacity="0.25"/>
    </radialGradient>
  </defs>
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- muro -->
    <rect x="52" y="8" width="196" height="150" rx="3"/>
    <g stroke-width="0.6" opacity="0.55">
      <path d="M52 30H248M52 52H248M52 74H248M52 96H248M52 118H248M52 140H248"/>
      <path d="M80 8V30M120 8V30M170 8V30M210 8V30M96 30V52M140 30V52M190 30V52M228 30V52M72 52V74M110 52V74M214 52V74M236 52V74M86 96V118M200 96V118M70 118V140M226 118V140M100 140V158M180 140V158"/>
    </g>
    <!-- alone di luce -->
    <ellipse cx="150" cy="88" rx="62" ry="72" fill="url(#luce)" stroke="none"/>
    <!-- finestra a sesto acuto -->
    <path d="M122 150V78C122 50 138 30 150 20C162 30 178 50 178 78V150Z" fill="#f6dfa0" fill-opacity="0.75" stroke-width="1.6"/>
    <path d="M114 154V76C114 46 134 22 150 10C166 22 186 46 186 76V154Z" stroke-width="1.4"/>
    <!-- trafori -->
    <path d="M150 22V150M122 96H178M122 124H178"/>
    <circle cx="150" cy="62" r="13"/>
    <circle cx="150" cy="62" r="5"/>
    <path d="M137 62H163M150 49V75" stroke-width="0.8"/>
    <!-- davanzale -->
    <path d="M106 150H194V158H106Z" fill="#efe3c6"/>
    <!-- ramo spoglio -->
    <path d="M8 168C26 150 34 128 50 112C60 102 70 98 82 92"/>
    <path d="M30 138C26 126 28 116 36 108M44 122C54 120 64 122 70 128M50 112C46 102 48 92 54 86M62 104C72 106 80 104 86 100"/>
    <path d="M18 154C12 148 8 144 4 142M36 132C42 134 46 138 48 144" stroke-width="0.9"/>
    <!-- luna -->
    <path d="M262 28C252 30 246 40 248 50C250 60 260 66 270 64C262 62 256 54 256 46C256 38 258 32 262 28Z" fill="#efe3c6" stroke-width="1"/>
    <path d="M272 38L274 44M282 52L288 54M268 76L272 80" stroke-width="0.8"/>
    <!-- terra -->
    <path d="M0 160H300" stroke-width="1.4"/>
    <path d="M10 166H290M30 172H270M60 178H240" stroke-width="0.6" opacity="0.6"/>
  </g>
</svg>`,

// Romanzo: libro aperto, penna d'oca e ramoscello
'Romanzo': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un libro aperto con una penna d'oca e un ramo">
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- tavolo -->
    <path d="M10 160H290" stroke-width="1.4"/>
    <path d="M24 166H276M54 172H246" stroke-width="0.6" opacity="0.6"/>
    <!-- libro -->
    <path d="M60 148C96 138 128 140 150 150C172 140 204 138 240 148V62C204 52 172 54 150 64C128 54 96 52 60 62Z" fill="#fbf4e2"/>
    <path d="M150 64V150"/>
    <path d="M66 156C100 148 130 150 150 158C170 150 200 148 234 156" stroke-width="0.9"/>
    <path d="M60 148V156M240 148V156" stroke-width="0.9"/>
    <!-- righe di testo -->
    <g stroke-width="0.7" opacity="0.7">
      <path d="M76 80C96 76 116 78 136 84M76 92C96 88 116 90 136 96M76 104C96 100 116 102 136 108M76 116C96 112 116 114 136 120M76 128C96 124 116 126 128 130"/>
      <path d="M164 84C184 78 204 76 224 80M164 96C184 90 204 88 224 92M164 108C184 102 204 100 224 104M164 120C184 114 204 112 224 116"/>
    </g>
    <!-- penna d'oca -->
    <path d="M214 60C230 34 252 18 276 12C270 34 254 52 232 64Z" fill="#efe3c6"/>
    <path d="M214 60C242 38 262 24 276 12" />
    <path d="M222 62C232 58 238 52 244 44M228 66C238 60 246 54 252 46" stroke-width="0.7"/>
    <path d="M214 60L200 78" stroke-width="1.6"/>
    <!-- ramoscello -->
    <path d="M14 150C30 132 42 120 64 108" />
    <path d="M26 138C22 128 24 120 32 114M38 128C48 126 56 128 62 134M44 120C42 112 44 104 50 98M20 146C14 142 10 138 8 132" stroke-width="1"/>
    <path d="M32 114C28 112 26 108 28 104C32 104 34 108 32 114Z M50 98C46 96 44 92 46 88C50 88 52 92 50 98Z M62 134C60 138 56 140 52 140C52 136 56 134 62 134Z" fill="#e6d8b4" stroke-width="0.8"/>
  </g>
</svg>`,
// Poesia: rotolo di pergamena con ramo d'alloro e penna
'Poesia': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un rotolo di pergamena con un ramo d'alloro">
  <g fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M70 36H226C238 36 238 56 226 56H84C72 56 72 36 84 36" fill="#f3e6c4" fill-opacity="0.7"/>
    <path d="M84 56V132C84 150 70 150 66 138C62 126 72 122 84 124" />
    <path d="M226 56V120C226 140 240 144 244 134" />
    <path d="M84 124H226C238 124 238 144 226 144H72" fill="#f3e6c4" fill-opacity="0.7"/>
    <g stroke-width="0.9" opacity="0.8"><path d="M104 74H206M104 86H196M104 98H206M104 110H180"/></g>
    <path d="M40 150C52 120 60 100 70 80" stroke-width="1.2"/>
    <path d="M52 124c-10-2-14-10-12-16 8 0 14 6 12 16zM58 108c-10-2-14-10-12-16 8 0 14 6 12 16zM64 92c-9-2-13-9-11-15 8 0 13 5 11 15zM56 120c8-6 16-6 20-2-4 6-12 8-20 2zM62 104c8-6 16-6 20-2-4 6-12 8-20 2z"/>
    <path d="M258 22C240 40 226 70 214 100L210 112L220 108C236 84 250 52 258 22Z" fill="#a67c3d" fill-opacity="0.35"/>
  </g>
</svg>`,
// Saggio: libro aperto con una corona
'Saggio': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un libro aperto con una corona">
  <g fill="none" stroke="${INK}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 70C130 58 90 56 60 64V140C90 132 130 134 150 146C170 134 210 132 240 140V64C210 56 170 58 150 70Z" fill="#f3e6c4" fill-opacity="0.7"/>
    <path d="M150 70V146"/>
    <g stroke-width="0.9" opacity="0.8"><path d="M76 82C98 78 120 80 136 86M76 96C98 92 120 94 136 100M76 110C98 106 120 108 136 114M164 86C180 80 202 78 224 82M164 100C180 94 202 92 224 96M164 114C180 108 202 106 224 110"/></g>
    <path d="M118 46L124 20L138 34L150 14L162 34L176 20L182 46Z" fill="#a67c3d" fill-opacity="0.35"/>
    <path d="M118 46H182"/>
  </g>
</svg>`,

// Avventura: veliero sul mare con gabbiano e sole
'Avventura': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un veliero in mare aperto">
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="232" cy="46" r="20" fill="#f3d58b" fill-opacity="0.75"/>
    <path d="M222 46H242M232 36V56" stroke-width="0.6" opacity="0.5"/>
    <!-- onde -->
    <path d="M10 150C28 142 44 142 62 150C80 158 96 158 114 150C132 142 148 142 166 150C184 158 200 158 218 150C236 142 252 142 270 150C280 154 286 154 292 152" stroke-width="1.3"/>
    <path d="M22 164C40 158 56 158 74 164C92 170 108 170 126 164C144 158 160 158 178 164C196 170 212 170 230 164C248 158 264 158 282 164" stroke-width="0.8" opacity="0.6"/>
    <!-- scafo -->
    <path d="M78 134H222C216 148 204 154 190 154H110C96 154 84 148 78 134Z" fill="#e6d3a6"/>
    <path d="M86 142H214" stroke-width="0.7" opacity="0.6"/>
    <!-- albero e vele -->
    <path d="M150 134V28" stroke-width="1.6"/>
    <path d="M150 34C176 44 196 70 200 104H150Z" fill="#fbf4e2"/>
    <path d="M150 42C128 52 112 76 108 108H150Z" fill="#f6ecd2"/>
    <path d="M150 110C170 114 186 122 194 132H150Z" fill="#fbf4e2" stroke-width="1"/>
    <path d="M150 28L172 34L150 40" fill="#c9604a" fill-opacity="0.85" stroke-width="0.9"/>
    <path d="M150 40C170 52 184 70 190 92M150 60C166 70 176 82 182 98" stroke-width="0.6" opacity="0.6"/>
    <!-- sartie e prua -->
    <path d="M150 28L84 134M150 28L218 134" stroke-width="0.6" opacity="0.6"/>
    <path d="M78 134L58 126" stroke-width="1.4"/>
    <!-- gabbiano -->
    <path d="M40 54C46 46 54 46 60 54C66 46 74 46 80 54" stroke-width="1"/>
    <path d="M96 30C100 26 104 26 108 30C112 26 116 26 120 30" stroke-width="0.9"/>
  </g>
</svg>`,

// Giallo e thriller: lente d'ingrandimento sopra impronte, con lampione nella nebbia
'Giallo e thriller': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Una lente d'ingrandimento su alcune impronte">
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 160H290" stroke-width="1.4"/>
    <path d="M24 166H276M54 172H246" stroke-width="0.6" opacity="0.6"/>
    <!-- nebbia -->
    <path d="M14 40C34 34 54 34 76 40M30 52C52 46 72 46 94 52" stroke-width="0.7" opacity="0.5"/>
    <!-- lampione -->
    <path d="M38 160V70M30 160H46" stroke-width="1.6"/>
    <path d="M38 70C38 56 48 50 60 50" stroke-width="1.4"/>
    <path d="M56 50H70L68 62H58Z" fill="#f3d58b" fill-opacity="0.9"/>
    <path d="M63 66L50 90H76Z" fill="#f3d58b" fill-opacity="0.25" stroke="none"/>
    <!-- impronte -->
    <g fill="#e6d8b4" stroke-width="0.9">
      <ellipse cx="108" cy="146" rx="7" ry="11" transform="rotate(-12 108 146)"/>
      <ellipse cx="140" cy="134" rx="7" ry="11" transform="rotate(-12 140 134)"/>
      <ellipse cx="170" cy="150" rx="7" ry="11" transform="rotate(-12 170 150)"/>
    </g>
    <!-- lente -->
    <circle cx="192" cy="84" r="46" fill="#fbf4e2" fill-opacity="0.7" stroke-width="2.4"/>
    <circle cx="192" cy="84" r="38" stroke-width="0.8" opacity="0.6"/>
    <path d="M168 62C176 52 188 48 200 50" stroke-width="2" opacity="0.7"/>
    <path d="M225 118L262 156" stroke-width="7"/>
    <path d="M225 118L262 156" stroke="#f6ecd2" stroke-width="4"/>
    <!-- impronta digitale dentro la lente -->
    <g stroke-width="0.9" opacity="0.8">
      <path d="M176 100C176 86 184 76 194 76C204 76 210 84 210 94"/>
      <path d="M182 104C182 92 188 84 195 84C202 84 204 90 204 98"/>
      <path d="M188 106C188 98 192 92 196 92C199 92 199 96 199 101"/>
      <path d="M170 98C170 80 180 68 194 68C208 68 218 80 217 96"/>
    </g>
  </g>
</svg>`,

// Sentimentale: lettera con sigillo a cuore e rosa
'Sentimentale': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Una lettera sigillata con un cuore e una rosa">
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 160H290" stroke-width="1.4"/>
    <path d="M24 166H276M54 172H246" stroke-width="0.6" opacity="0.6"/>
    <!-- busta -->
    <path d="M74 150V64H226V150Z" fill="#fbf4e2"/>
    <path d="M74 64L150 114L226 64" fill="#f3e8cc"/>
    <path d="M74 150L128 104M226 150L172 104" stroke-width="0.8" opacity="0.7"/>
    <!-- sigillo -->
    <circle cx="150" cy="114" r="15" fill="#b8503e" fill-opacity="0.9"/>
    <path d="M150 124C140 116 138 110 142 107C146 104 150 107 150 110C150 107 154 104 158 107C162 110 160 116 150 124Z" fill="#f5eddc" stroke-width="0.8"/>
    <!-- rosa -->
    <path d="M238 156C240 132 246 112 258 92" stroke-width="1.4"/>
    <path d="M241 140C250 138 256 140 260 146C252 148 246 146 241 140Z M246 124C240 120 238 114 240 108C246 112 248 118 246 124Z" fill="#cfd8b0" stroke-width="0.8"/>
    <path d="M258 92C250 90 246 82 250 76C254 70 262 70 266 74C272 72 278 78 276 84C278 90 270 96 262 94Z" fill="#d98a7a" fill-opacity="0.9"/>
    <path d="M254 80C258 84 264 84 268 80M258 76C262 78 266 78 270 76" stroke-width="0.8"/>
    <!-- piuma -->
    <path d="M40 140C54 112 76 90 104 76C100 98 82 124 54 140Z" fill="#efe3c6"/>
    <path d="M40 140C62 112 86 90 104 76" />
    <path d="M40 140L28 154" stroke-width="1.6"/>
  </g>
</svg>`,

// Per ragazzi: mongolfiera con nuvole e stelle
'Per ragazzi': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Una mongolfiera fra le nuvole">
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- nuvole -->
    <path d="M18 138C14 128 22 120 32 122C34 112 48 110 54 118C62 112 74 118 72 128C80 128 82 138 74 140H24C20 140 18 140 18 138Z" fill="#fbf4e2"/>
    <path d="M222 62C218 52 226 44 236 46C238 36 252 34 258 42C266 36 278 42 276 52C284 52 286 62 278 64H228C224 64 222 64 222 62Z" fill="#fbf4e2"/>
    <!-- mongolfiera -->
    <path d="M150 12C112 12 92 44 100 80C104 98 122 112 136 118H164C178 112 196 98 200 80C208 44 188 12 150 12Z" fill="#f0dca6"/>
    <path d="M150 12C130 24 124 60 136 118M150 12C170 24 176 60 164 118" />
    <path d="M150 12V118" stroke-width="0.8"/>
    <path d="M104 62C130 70 170 70 196 62" stroke="#b8503e" stroke-width="3" opacity="0.85"/>
    <path d="M102 80C130 90 170 90 198 80" stroke="#1f4a3a" stroke-width="3" opacity="0.8"/>
    <path d="M136 118L130 142M164 118L170 142M150 118V142" stroke-width="0.9"/>
    <path d="M124 142H176V162H124Z" fill="#e6d3a6"/>
    <path d="M124 150H176" stroke-width="0.7"/>
    <!-- stelline -->
    <path d="M70 40L73 48L81 48L75 53L77 61L70 56L63 61L65 53L59 48L67 48Z" fill="#f3d58b" stroke-width="0.8"/>
    <path d="M238 112L240 117L246 117L241 121L243 127L238 123L233 127L235 121L230 117L236 117Z" fill="#f3d58b" stroke-width="0.8"/>
    <path d="M40 80L42 84L46 84L43 87L44 91L40 88L36 91L37 87L34 84L38 84Z" fill="#f3d58b" stroke-width="0.7"/>
  </g>
</svg>`,

// Fantascienza: pianeta con anello, razzo e stelle
'Fantascienza': `<svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un pianeta con un anello e un razzo">
  <g fill="none" stroke="${INK}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- pianeta -->
    <circle cx="112" cy="94" r="46" fill="#ecdcb0"/>
    <path d="M78 70C98 80 126 82 150 76M68 94C92 104 128 106 156 98M74 116C96 124 122 124 140 118" stroke-width="0.7" opacity="0.6"/>
    <!-- anello -->
    <path d="M30 108C20 96 52 76 98 66C150 56 198 62 204 78C210 94 172 114 124 124C84 132 40 124 30 108Z" stroke-width="1.6"/>
    <path d="M42 108C36 98 62 82 100 74C146 66 188 70 192 80C196 92 164 108 122 116C86 122 48 118 42 108Z" stroke-width="0.7" opacity="0.6"/>
    <path d="M70 128C84 130 100 130 116 126" stroke="#f3d58b" stroke-width="0" />
    <!-- razzo -->
    <g transform="translate(228 70) rotate(35)">
      <path d="M0 -34C12 -22 14 -2 12 18H-12C-14 -2 -12 -22 0 -34Z" fill="#fbf4e2"/>
      <circle cx="0" cy="-8" r="6" fill="#f3d58b"/>
      <path d="M-12 18L-22 32L-12 28M12 18L22 32L12 28" fill="#c9604a" fill-opacity="0.85" stroke-width="1"/>
      <path d="M-6 18L0 38L6 18" fill="#f3d58b" fill-opacity="0.9" stroke-width="1"/>
    </g>
    <!-- scia -->
    <path d="M214 98C204 114 196 126 188 138" stroke-width="0.7" opacity="0.5" stroke-dasharray="3 4"/>
    <!-- stelle -->
    <path d="M40 40L42 46L48 46L43 50L45 56L40 52L35 56L37 50L32 46L38 46Z" fill="#f3d58b" stroke-width="0.8"/>
    <path d="M250 28L252 33L257 33L253 36L254 41L250 38L246 41L247 36L243 33L248 33Z" fill="#f3d58b" stroke-width="0.8"/>
    <path d="M268 140L270 144L274 144L271 147L272 151L268 148L264 151L265 147L262 144L266 144Z" fill="#f3d58b" stroke-width="0.7"/>
    <circle cx="180" cy="26" r="1.4" fill="${INK}"/><circle cx="64" cy="150" r="1.4" fill="${INK}"/><circle cx="270" cy="90" r="1.2" fill="${INK}"/><circle cx="20" cy="70" r="1.2" fill="${INK}"/>
  </g>
</svg>`,
};

function disegnaIllustrazione(genere) {
    const box = document.getElementById('illustrazione');
    if (box) box.innerHTML = ILLUSTRAZIONI[genere] || '';
}
