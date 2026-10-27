# Render Diagnostic Log
Date: 2026-10-27T05:44:00.871Z
Branch: recovery/r0-centronic
Commit: 6211b18 (latest)
Server: http://127.0.0.1:8765 (python3 -m http.server)

```

=== STEP 1: HTTP asset verification ===
  asset: http://127.0.0.1:8765/public/ds-tokens.css → 200 text/css
  asset: http://127.0.0.1:8765/public/cs-nav.css → 200 text/css
  asset: http://127.0.0.1:8765/public/images/centronic-research-matrix.jpg → 200 image/jpeg
  asset: http://127.0.0.1:8765/public/images/centronic-ia.jpg → 200 image/jpeg

=== STEP 2: Desktop 1440px (no modifications) ===
  body fontFamily: Manrope, system-ui, sans-serif
  body backgroundColor: rgb(245, 244, 240)
  sec02 display: block
  fig1 complete: true | naturalWidth: 2211
  fig2 complete: true | naturalWidth: 960
  consoleErrors: Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED; Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED; Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED; Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED; Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED; Error: <svg> attribute width: Expected length, "{{ b.icon }}".; Error: <svg> attribute height: Expected length, "{{ b.icon }}".; Error: <svg> attribute viewBox: Expected number, "{{ b.vb }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ pp }}".; Error: <svg> attribute width: Expected length, "{{ c.isz }}".; Error: <svg> attribute height: Expected length, "{{ c.isz }}".; Error: <svg> attribute viewBox: Expected number, "{{ c.ivb }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ pp }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ volD }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ volD }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ seekD }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ seekD }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ routePath }}".; Error: <circle> attribute cx: Expected length, "{{ d.x }}".; Error: <circle> attribute cy: Expected length, "{{ d.y }}".; Error: <circle> attribute r: Expected length, "{{ d.r }}".; Error: <circle> attribute cx: Expected length, "{{ vx }}".; Error: <circle> attribute cy: Expected length, "{{ vy }}".; Error: <line> attribute x1: Expected length, "{{ c.x1 }}".; Error: <line> attribute y1: Expected length, "{{ c.y1 }}".; Error: <line> attribute x2: Expected length, "{{ c.x2 }}".; Error: <line> attribute y2: Expected length, "{{ c.y2 }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ dialD }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ dialD }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ dialD }}".; Error: <line> attribute x1: Expected length, "{{ t.x1 }}".; Error: <line> attribute y1: Expected length, "{{ t.y1 }}".; Error: <line> attribute x2: Expected length, "{{ t.x2 }}".; Error: <line> attribute y2: Expected length, "{{ t.y2 }}".; Error: <circle> attribute cx: Expected length, "{{ knX }}".; Error: <circle> attribute cy: Expected length, "{{ knY }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ pp }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ s.d }}".; Error: <g> attribute transform: Expected transform function, "{{ z.tf }}".; Error: <rect> attribute x: Expected length, "{{ z.rx }}".; Error: <rect> attribute y: Expected length, "{{ z.rx }}".; Error: <rect> attribute width: Expected length, "{{ z.rw }}".; Error: <rect> attribute height: Expected length, "{{ z.rw }}".; Error: <path> attribute d: Expected moveto path command ('M' or 'm'), "{{ zp }}".; Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED; [dc] failed to load React or boot: Error: failed to load https://unpkg.com/react@18.3.1/umd/react.production.min.js
    at s.onerror (http://127.0.0.1:8765/prototypes/v1/support.js:1834:32); Failed to load resource: net::ERR_TUNNEL_CONNECTION_FAILED
  failedRequests: [{"url":"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&family=Manrope:wght@300;400;500;600&family=Zodiak:ital,wght@1,300;1,400&display=swap","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/animejs@4.3.6/lib/anime.iife.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://unpkg.com/react@18.3.1/umd/react.production.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"}]
  screenshot: desktop-1440-genuine.png
  screenshot: desktop-1440-fullpage.png (full page)

=== STEP 3: Mobile 390px (no modifications) ===
  body backgroundColor: rgb(245, 244, 240)
  body fontFamily: Manrope, system-ui, sans-serif
  fig1 complete: true | naturalWidth: 2211
  fig2 complete: true | naturalWidth: 960
  horizontal overflow: false
  failedRequests: [{"url":"https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&family=Manrope:wght@300;400;500;600&family=Zodiak:ital,wght@1,300;1,400&display=swap","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/SplitText.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://cdn.jsdelivr.net/npm/animejs@4.3.6/lib/anime.iife.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://unpkg.com/react@18.3.1/umd/react.production.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"},{"url":"https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js","failure":"net::ERR_TUNNEL_CONNECTION_FAILED"}]
  screenshot: mobile-390-genuine.png

=== STEP 4: Mobile 375px (no modifications) ===
  screenshot: mobile-375-genuine.png

=== STEP 5: Desktop lightbox (genuine — no nav suppression) ===
  screenshot: desktop-lightbox-genuine.png
  lightbox opened successfully via click
  Esc closes lightbox: pass
```
