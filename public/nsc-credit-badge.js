/*! Nischaya credit badge — "Developed and maintained by Nischaya Creative Soft".
 * Usage: put <div data-nsc-credit></div> where the badge goes (right end of the footer bottom bar) and load this file once:
 *   <script src="/path/to/nsc-credit-badge.js" defer></script>
 * Frameworks that render the footer later (React, Vue…): call window.nscCreditBadge.mount(element) after it mounts.
 * Self-contained: no dependencies, no cookies, no network requests; every class and id is prefixed nsc-credit.
 */
(() => {
  if (window.nscCreditBadge) return; // loaded twice: keep the first copy
  const LOTUS = 'M14222 24919 c-30 -5 -84 -24 -121 -42 -66 -33 -337 -229 -416 -302 -22 -20 -105 -94 -185 -163 -79 -70 -192 -174 -250 -232 -58 -58 -157 -155 -220 -216 -134 -129 -441 -442 -520 -529 -30 -33 -116 -125 -191 -205 -75 -80 -151 -163 -170 -185 -36 -43 -72 -84 -187 -213 -41 -45 -115 -133 -165 -196 -51 -62 -139 -169 -197 -237 -58 -68 -137 -164 -175 -214 -38 -49 -112 -144 -165 -210 -108 -135 -138 -174 -332 -435 -76 -102 -155 -207 -175 -234 -75 -98 -429 -620 -508 -751 -43 -71 -122 -195 -234 -370 -39 -60 -109 -175 -156 -255 -118 -203 -313 -540 -355 -613 -105 -186 -216 -335 -339 -457 -121 -120 -215 -171 -360 -195 -217 -35 -354 -3 -661 153 -453 232 -584 297 -690 344 -63 28 -119 54 -125 58 -8 6 -125 58 -370 165 -16 7 -41 16 -55 20 -14 4 -29 11 -35 15 -5 4 -57 24 -115 43 -58 20 -130 46 -160 57 -72 28 -216 75 -310 100 -41 11 -106 29 -145 40 -196 54 -272 65 -475 65 -182 0 -198 -1 -245 -23 -95 -43 -187 -120 -219 -182 -7 -14 -27 -51 -45 -84 -42 -77 -122 -318 -161 -486 -115 -496 -142 -638 -191 -1010 -66 -505 -85 -1098 -50 -1630 12 -179 24 -340 27 -358 3 -18 11 -103 19 -190 8 -86 26 -274 40 -416 54 -558 18 -741 -187 -956 -164 -172 -394 -243 -678 -210 -47 6 -148 15 -225 20 -77 6 -174 15 -215 20 -287 39 -985 72 -1502 71 -735 0 -915 -27 -1045 -157 -94 -95 -122 -227 -102 -483 6 -81 13 -149 15 -152 2 -3 11 -64 19 -134 9 -71 18 -132 21 -137 3 -5 14 -55 24 -111 53 -285 136 -626 204 -837 19 -58 46 -150 61 -205 47 -168 192 -580 290 -820 32 -77 66 -162 77 -190 23 -62 24 -64 121 -275 14 -30 43 -95 65 -145 22 -49 103 -214 179 -365 127 -252 169 -331 241 -460 14 -25 39 -70 55 -100 17 -30 46 -79 64 -107 18 -29 38 -63 43 -75 5 -13 21 -41 35 -63 13 -22 34 -56 45 -75 11 -19 29 -48 40 -65 11 -16 26 -41 34 -55 8 -14 44 -72 81 -130 37 -58 79 -124 94 -148 14 -24 62 -94 106 -157 44 -63 100 -144 125 -181 25 -36 70 -98 100 -138 30 -39 68 -91 85 -116 57 -86 110 -156 205 -270 53 -63 118 -144 145 -180 61 -81 132 -167 205 -245 30 -34 91 -103 135 -155 44 -52 118 -134 165 -181 47 -48 130 -135 185 -193 116 -124 534 -523 639 -610 39 -33 112 -97 163 -142 50 -45 147 -126 215 -180 67 -54 166 -132 218 -174 99 -79 205 -159 300 -223 30 -21 80 -55 110 -77 168 -123 498 -340 515 -340 5 0 159 -96 210 -130 41 -28 135 -79 334 -182 64 -33 121 -63 126 -67 18 -14 419 -199 520 -241 92 -38 158 -64 322 -126 185 -71 585 -191 860 -258 180 -44 462 -89 843 -133 341 -39 969 -22 1310 37 30 5 84 12 120 16 36 3 133 19 215 35 313 61 634 156 975 289 75 30 170 65 260 96 41 15 104 41 140 59 70 35 295 135 303 135 3 0 31 15 64 33 32 18 108 52 168 76 61 23 143 56 182 72 93 38 315 111 418 138 330 86 811 59 1126 -64 49 -19 121 -46 161 -59 122 -41 343 -138 593 -261 217 -106 303 -142 685 -290 363 -141 781 -254 1075 -290 28 -3 102 -15 165 -25 480 -80 1176 -72 1765 20 72 11 175 27 230 35 55 8 132 22 170 30 39 8 126 26 195 41 126 26 178 40 280 74 30 10 91 28 135 40 114 32 412 132 535 180 30 12 75 28 100 36 25 8 59 21 77 29 17 8 35 15 40 15 6 0 161 67 433 187 80 36 468 228 503 250 20 13 68 40 105 60 160 86 367 205 424 244 15 11 30 19 33 19 3 0 18 8 33 19 15 10 95 63 177 118 291 192 402 270 563 393 90 69 209 160 265 202 56 43 144 115 197 161 52 46 158 137 235 202 77 66 172 149 210 186 39 36 102 95 140 130 124 113 528 526 615 629 30 36 107 121 170 190 64 69 145 163 180 210 35 47 92 117 127 155 56 62 226 285 518 680 81 110 225 321 225 330 0 2 43 68 96 147 52 78 120 186 150 238 30 52 77 130 105 173 27 43 49 81 49 84 0 3 26 48 57 101 65 109 71 120 159 287 36 66 71 131 79 145 39 65 260 523 324 670 40 91 76 174 81 185 39 89 97 230 135 330 25 66 55 140 65 165 35 85 88 245 155 470 37 124 75 250 85 280 11 30 38 134 61 230 22 96 52 218 65 270 41 161 51 210 73 355 84 565 67 746 -81 868 -55 45 -117 69 -248 97 -187 39 -1127 39 -1640 -1 -215 -16 -847 -67 -1055 -85 -256 -21 -487 -16 -569 15 -209 76 -388 275 -445 495 -24 91 -29 333 -11 486 13 106 45 438 65 675 8 99 20 234 26 300 42 469 22 1404 -40 1885 -6 41 -13 104 -16 140 -3 36 -14 108 -25 160 -10 52 -28 158 -40 235 -35 234 -110 561 -172 750 -55 168 -172 321 -286 373 -116 52 -414 40 -652 -28 -36 -11 -81 -23 -100 -29 -70 -19 -257 -80 -335 -109 -263 -97 -445 -166 -473 -182 -9 -5 -57 -27 -107 -49 -265 -116 -625 -290 -940 -454 -158 -82 -401 -197 -417 -197 -7 0 -25 -6 -39 -14 -121 -63 -397 -97 -534 -66 -112 25 -264 112 -351 202 -104 106 -257 331 -363 533 -18 33 -43 78 -57 100 -13 22 -39 69 -58 105 -19 36 -45 85 -58 110 -25 47 -171 301 -199 348 -40 64 -119 203 -119 208 0 6 -116 208 -140 244 -66 99 -170 260 -184 285 -9 17 -21 37 -26 45 -5 8 -31 50 -57 92 -45 73 -172 260 -290 428 -28 41 -76 109 -104 150 -29 41 -85 118 -124 170 -39 52 -127 169 -196 260 -161 214 -421 540 -524 656 -44 49 -118 135 -164 190 -45 54 -134 155 -196 224 -62 69 -155 172 -205 230 -296 335 -1029 1068 -1373 1373 -390 346 -564 439 -755 406z m73 -4974 c47 -27 197 -164 274 -250 182 -204 375 -438 493 -600 270 -371 509 -748 677 -1070 41 -77 77 -144 81 -150 4 -5 35 -71 68 -145 33 -74 83 -187 112 -250 77 -169 80 -177 80 -187 0 -4 14 -42 31 -83 215 -519 348 -1183 349 -1747 l0 -172 -70 -83 c-171 -204 -525 -668 -712 -932 -87 -124 -152 -219 -158 -231 -3 -6 -57 -89 -121 -185 -64 -96 -153 -238 -199 -315 -46 -77 -93 -156 -105 -175 -71 -111 -100 -158 -175 -285 -46 -77 -114 -198 -150 -270 -37 -71 -81 -155 -97 -185 -79 -144 -224 -429 -378 -743 -119 -242 -134 -260 -180 -217 -32 30 -78 125 -215 445 -5 11 -26 58 -48 105 -22 47 -54 119 -72 160 -18 41 -36 80 -40 85 -4 6 -39 82 -78 170 -66 149 -155 329 -189 384 -20 31 -88 161 -182 346 -73 143 -164 304 -271 480 -67 110 -67 110 -138 232 -99 170 -366 576 -597 908 -112 161 -183 259 -334 457 l-154 202 6 105 c7 119 39 342 62 441 9 36 25 103 36 150 12 47 29 112 39 145 74 251 93 310 155 470 26 66 55 143 65 170 87 242 417 879 598 1155 41 63 85 131 97 150 148 234 506 730 628 870 12 14 76 88 141 165 136 160 356 380 445 446 100 73 148 80 226 34z m-7370 -6130 c211 -51 282 -69 300 -76 11 -4 72 -28 135 -52 235 -91 255 -99 265 -107 6 -4 44 -22 85 -40 41 -18 144 -66 227 -106 84 -41 155 -74 158 -74 7 0 254 -142 370 -213 50 -31 117 -70 150 -87 48 -25 244 -153 399 -260 182 -126 486 -350 531 -393 11 -10 71 -57 133 -105 101 -76 186 -148 248 -207 38 -37 88 -80 178 -154 87 -71 343 -308 476 -441 198 -199 422 -432 460 -480 55 -69 113 -134 205 -230 39 -41 96 -106 125 -145 30 -38 99 -124 154 -190 55 -66 149 -185 210 -265 60 -80 134 -176 165 -215 83 -102 301 -414 301 -429 0 -6 89 -146 147 -231 91 -133 124 -187 168 -275 27 -52 56 -106 66 -120 17 -25 33 -56 164 -305 109 -206 124 -238 151 -310 14 -38 46 -115 71 -170 25 -55 49 -109 54 -120 5 -11 24 -63 43 -115 19 -52 45 -120 58 -150 14 -30 39 -104 57 -165 18 -60 39 -128 46 -150 14 -45 46 -174 69 -280 48 -217 50 -470 4 -567 -120 -256 -363 -267 -1018 -44 -74 26 -195 66 -268 91 -73 25 -154 54 -180 66 -26 12 -60 27 -77 35 -16 7 -68 29 -115 47 -300 121 -771 347 -995 477 -49 29 -133 75 -185 102 -52 28 -144 83 -205 123 -240 157 -284 186 -386 257 -58 40 -138 96 -178 123 -41 28 -110 80 -155 116 -45 36 -133 104 -196 151 -63 46 -180 143 -260 214 -80 71 -172 151 -205 179 -63 51 -333 313 -440 425 -209 218 -374 401 -465 515 -58 72 -120 147 -138 167 -42 45 -200 251 -387 503 -49 66 -113 159 -167 245 -23 36 -68 105 -100 154 -32 48 -58 90 -58 93 0 3 -36 59 -81 124 -44 66 -130 218 -191 337 -178 348 -282 556 -295 588 -6 16 -23 56 -38 89 -14 33 -41 101 -60 150 -172 454 -167 439 -216 610 -129 445 -158 762 -87 958 60 169 190 285 378 336 91 25 282 23 395 -4z m15130 -9 c204 -39 334 -169 405 -405 45 -147 4 -576 -74 -781 -7 -19 -26 -84 -41 -145 -56 -228 -187 -594 -289 -810 -124 -262 -325 -653 -383 -743 -18 -29 -33 -54 -33 -57 0 -3 -17 -31 -37 -62 -41 -63 -44 -67 -90 -146 -17 -29 -63 -100 -103 -158 -39 -57 -123 -180 -186 -274 -293 -434 -704 -912 -1211 -1409 -364 -356 -879 -777 -1253 -1023 -69 -45 -159 -105 -200 -133 -150 -101 -262 -172 -345 -220 -16 -10 -79 -47 -140 -82 -301 -176 -695 -369 -1190 -583 -16 -7 -61 -25 -100 -39 -38 -15 -79 -31 -90 -37 -55 -26 -559 -195 -730 -244 -555 -159 -784 -167 -931 -33 -159 146 -173 344 -57 818 17 70 109 351 143 440 12 30 28 73 35 95 37 116 287 636 443 925 38 71 106 183 182 300 27 41 61 95 76 120 15 25 61 97 102 160 41 63 86 133 100 155 26 40 115 161 274 375 245 328 627 778 892 1050 83 85 172 178 197 205 72 78 464 450 580 550 57 50 138 122 179 161 41 39 116 102 166 140 50 38 144 115 210 172 65 56 151 124 189 150 39 25 124 87 190 137 66 50 152 113 190 140 39 27 88 62 110 77 54 38 153 104 248 164 43 27 113 72 155 101 79 54 297 183 307 183 4 0 61 33 128 74 67 40 165 96 217 124 52 27 122 65 155 84 33 18 83 43 110 54 28 12 97 43 155 69 733 329 1060 417 1345 361z';
  const CSS = `  .nsc-credit { display: inline-block; line-height: 0; }
  .nsc-credit-btn { position: relative; width: 32px; height: 32px; padding: 0; border: 0; border-radius: 50%; cursor: pointer; display: grid; place-items: center;
    background: radial-gradient(120% 100% at 50% 15%, #2A6B4A, #1A4A33 70%); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), 0 1px 3px rgba(0,0,0,.3);
    transition: transform .15s ease, box-shadow .15s ease; }
  .nsc-credit-btn:hover, .nsc-credit-btn[aria-expanded="true"] { transform: translateY(-1px); box-shadow: inset 0 0 0 1px rgba(243,150,31,.55), 0 4px 14px rgba(0,0,0,.35); }
  .nsc-credit-btn:focus-visible { outline: 2px solid #F3961F; outline-offset: 3px; }
  .nsc-credit-btn::before { content: ""; position: absolute; inset: -6px; border-radius: 50%; } /* 44px touch area around the 32px circle */
  .nsc-credit-mark { width: 20px; height: auto; overflow: visible; display: block; }
  .nsc-credit-sweep { transform: skewX(-20deg); }
  .nsc-credit-glint { opacity: 0; transform-box: fill-box; transform-origin: center; filter: drop-shadow(0 0 18px rgba(255,236,200,.95)); }
  /* One shine = one short run of both animations; between shines nothing animates. */
  .nsc-credit.is-shining .nsc-credit-sweep { animation: nsc-credit-sweep 1.1s ease-in-out both; }
  .nsc-credit.is-shining .nsc-credit-glint { animation: nsc-credit-glint .7s ease-in-out 1.15s both; } /* starts once the sweep has passed */
  @keyframes nsc-credit-sweep { from { transform: skewX(-20deg) translateX(0); } to { transform: skewX(-20deg) translateX(1400px); } }
  @keyframes nsc-credit-glint { 0%, 100% { opacity: 0; scale: .2; rotate: 0deg; } 45% { opacity: 1; scale: 1; rotate: 45deg; } }
  .nsc-credit-pop { position: fixed; z-index: 1000; width: max-content; max-width: min(280px, calc(100vw - 16px)); padding: 12px 14px; border-radius: 12px;
    background: #161B18; color: #F5F1E9; border: 1px solid rgba(243,150,31,.35); box-shadow: 0 12px 32px rgba(0,0,0,.45);
    font: 400 13.5px/1.45 'Work Sans', system-ui, sans-serif; text-align: left; opacity: 0; transform: translateY(4px); transition: opacity .15s ease, transform .15s ease; }
  .nsc-credit-pop[hidden] { display: block; visibility: hidden; pointer-events: none; }
  .nsc-credit-pop.show { opacity: 1; transform: none; }
  .nsc-credit-pop p { margin: 0 0 6px; color: #AFBDB2; }
  .nsc-credit-pop b { color: #F5F1E9; font-weight: 600; white-space: nowrap; }
  .nsc-credit-pop a { color: #F3961F; font-weight: 600; text-decoration: none; }
  .nsc-credit-pop a:hover, .nsc-credit-pop a:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
  .nsc-credit-pop a:focus-visible { outline: 2px solid #F3961F; outline-offset: 2px; border-radius: 3px; }
  .nsc-credit-pop::after { content: ""; position: absolute; left: var(--nsc-arrow, 50%); bottom: -6px; width: 10px; height: 10px; background: inherit;
    border: inherit; border-top: 0; border-left: 0; transform: translateX(-50%) rotate(45deg); }
  .nsc-credit-pop.below::after { bottom: auto; top: -6px; transform: translateX(-50%) rotate(225deg); }
  @media (prefers-reduced-motion: reduce) { .nsc-credit.is-shining .nsc-credit-sweep, .nsc-credit.is-shining .nsc-credit-glint { animation: none; } .nsc-credit-btn, .nsc-credit-pop { transition: none; } }
`;
  let count = 0;

  function init(root) {
    const btn = root.querySelector('.nsc-credit-btn'), pop = root.querySelector('.nsc-credit-pop');
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches, canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

    let onScreen = false, every = 0, first = 0;
    const shine = () => { if (still || document.hidden || !onScreen) return; root.classList.remove('is-shining'); void root.offsetWidth; root.classList.add('is-shining'); };
    root.querySelector('.nsc-credit-glint').addEventListener('animationend', () => root.classList.remove('is-shining'));
    const run = () => { clearTimeout(first); clearInterval(every); if (!onScreen || document.hidden || still) return; first = setTimeout(shine, 600); every = setInterval(shine, 9000); };
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); }).observe(btn);
    else { onScreen = true; run(); }
    document.addEventListener('visibilitychange', run);

    let timer = 0, idle = 0;
    const IDLE_MS = 4000;
    const idleClose = () => { clearTimeout(idle); idle = setTimeout(() => { if (!pop.matches(':hover') && !btn.matches(':hover') && !pop.contains(document.activeElement)) close(false); else idleClose(); }, IDLE_MS); };
    const place = () => {
      const r = btn.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, gap = 10;
      const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8), below = r.top - h - gap < 8;
      pop.classList.toggle('below', below);
      pop.style.left = left + 'px'; pop.style.top = (below ? r.bottom + gap : r.top - h - gap) + 'px';
      pop.style.setProperty('--nsc-arrow', (r.left + r.width / 2 - left) + 'px');
    };
    const isOpen = () => !pop.hidden;
    const open = () => { clearTimeout(timer); pop.hidden = false; place(); requestAnimationFrame(() => pop.classList.add('show')); btn.setAttribute('aria-expanded', 'true'); };
    const close = (refocus) => { clearTimeout(timer); clearTimeout(idle); if (!isOpen()) return; pop.classList.remove('show'); pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); if (refocus) btn.focus(); };
    const later = () => { clearTimeout(timer); timer = setTimeout(() => close(false), 220); };
    btn.addEventListener('click', () => { if (isOpen() && btn.matches(':hover') && canHover) return idleClose(); isOpen() ? close(false) : (open(), idleClose()); });
    if (canHover) { btn.addEventListener('pointerenter', open); btn.addEventListener('pointerleave', later); pop.addEventListener('pointerenter', () => clearTimeout(timer)); pop.addEventListener('pointerleave', later); }
    document.addEventListener('pointerdown', (e) => { if (isOpen() && !root.contains(e.target)) close(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) close(true); });
    pop.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) close(false); });
    addEventListener('scroll', () => isOpen() && place(), { passive: true });
    addEventListener('resize', () => isOpen() && place());

  }

  function mount(slot) {
    if (!slot || slot.dataset.nscCreditMounted) return;
    slot.dataset.nscCreditMounted = '1';
    if (!document.getElementById('nsc-credit-style')) {
      const st = document.createElement('style'); st.id = 'nsc-credit-style'; st.textContent = CSS; document.head.append(st);
    }
    const n = ++count;
    slot.innerHTML = `<div class="nsc-credit">
  <button class="nsc-credit-btn" type="button" aria-label="Who made this website?" aria-expanded="false" aria-controls="nsc-credit-pop-${n}">
    <svg class="nsc-credit-mark" viewBox="0 45 720 620" aria-hidden="true">
      <defs>
        <path id="nsc-credit-lotus-${n}" fill-rule="evenodd" transform="translate(0 720) scale(0.025 -0.025)" d="${LOTUS}"/>
        <clipPath id="nsc-credit-clip-${n}"><use href="#nsc-credit-lotus-${n}"/></clipPath>
        <linearGradient id="nsc-credit-band-${n}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#FFF4DC" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      </defs>
      <use href="#nsc-credit-lotus-${n}" fill="#F3961F"/>
      <g clip-path="url(#nsc-credit-clip-${n})"><rect class="nsc-credit-sweep" x="-340" y="0" width="290" height="760" fill="url(#nsc-credit-band-${n})"/></g>
      <g transform="translate(357 112)"><g class="nsc-credit-glint"><path d="M0-170 L26-26 L170 0 L26 26 L0 170 L-26 26 L-170 0 L-26-26Z" fill="#FFF8E6"/><circle r="30" fill="#fff"/></g></g>
    </svg>
  </button>
  <div class="nsc-credit-pop" id="nsc-credit-pop-${n}" role="dialog" aria-label="Website credit" hidden>
    <p>Developed and maintained by<br><b>— Nischaya Creative Soft</b></p>
    <a href="https://nischayacreativesoft.com/" target="_blank" rel="noopener nofollow">www.nischayacreativesoft.com <span aria-hidden="true">↗</span></a>
  </div>
</div>`;
    init(slot.querySelector('.nsc-credit'));
  }

  window.nscCreditBadge = { mount };
  const auto = () => document.querySelectorAll('[data-nsc-credit]').forEach(mount);
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', auto) : auto();
})();
