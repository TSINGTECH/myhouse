/* 首页：首屏轮播 + Cod 搜索 + 滚动条带 + 地图（花园俯览插画） + 类型 + 精选 + 关于 + 联系 */
(async function () {
  const $ = (s) => document.querySelector(s);
  MH.renderChrome({ overlay: true });
  MH.applyI18n();
  $('#codBtn').innerHTML = MH.icon('search') + ' ' + MH.t('cod.btn');
  $('#arrow1').innerHTML = $('#arrow2').innerHTML = MH.icon('arrow');

  const all = await MH.store.publicList();
  const live = all.filter((l) => l.status !== 'fechado');
  const pt = MH.lang() === 'pt';
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  /* ---------- 首屏轮播 ---------- */
  const heroImgs = live.filter((l) => l.featured).concat(live).map((l) => l.images && l.images[0]).filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i).slice(0, 5);
  $('#heroMedia').innerHTML = heroImgs.map((src, i) => `<img src="${MH.esc(src)}" alt="" ${i ? 'loading="lazy"' : ''}>`).join('');
  $('#heroDots').innerHTML = heroImgs.map(() => '<i></i>').join('');
  const himgs = [...document.querySelectorAll('#heroMedia img')], hdots = [...document.querySelectorAll('#heroDots i')];
  let hi = 0;
  const showHero = (n) => { himgs.forEach((im, k) => im.classList.toggle('on', k === n)); hdots.forEach((d, k) => d.classList.toggle('on', k === n)); };
  showHero(0);
  if (!MH.reduced() && himgs.length > 1) setInterval(() => { hi = (hi + 1) % himgs.length; showHero(hi); }, 5200);

  /* ---------- Cod 搜索 ---------- */
  $('#codForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = $('#codInput').value.replace(/^cod[:：\s]*/i, '').trim();
    if (!v) { $('#codInput').focus(); return; }
    const hit = await MH.store.byCod(v);
    if (hit && hit.status !== 'oculto') location.href = 'listing.html?cod=' + encodeURIComponent(hit.cod);
    else $('#codErr').textContent = MH.t('cod.notfound');
  });
  $('#codInput').addEventListener('input', () => ($('#codErr').textContent = ''));

  /* ---------- 统计 ---------- */
  MH.countUp($('#statL'), live.length);
  MH.countUp($('#statR'), new Set(live.map((l) => l.region)).size);
  MH.countUp($('#statT'), new Set(live.map((l) => l.type)).size);

  /* ---------- 滚动条带 ---------- */
  const words = MH.REGIONS.map((r) => `<span>${MH.esc(MH.name(r))}${pt ? '' : `<small>${MH.esc(r.sub)}</small>`}</span>`).join('')
    + MH.TYPES.map((t) => `<span>${MH.name(t)}</span>`).join('');
  $('#marquee').innerHTML = words + words;

  /* ---------- 地图公共部分：区域、右侧面板、切换 ---------- */
  const drawer = $('#drawer'), strip = $('#strip');
  const typeDot = (t) => `<i style="background:${MH.type(t).color}"></i>`;
  const liveIn = (id) => live.filter((l) => l.region === id);
  const byRegion = (id) => all.filter((l) => l.region === id);
  $('#legend').innerHTML = MH.TYPES.map((t) => `<span>${typeDot(t.id)}${MH.name(t)}</span>`).join('');
  strip.innerHTML = MH.REGIONS.map((r) => `<button data-id="${r.id}">${MH.esc(MH.name(r))} <b>${liveIn(r.id).length}</b></button>`).join('');
  strip.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) ctl.select(b.dataset.id); });

  const ctl = {
    current: null, liveIn,
    select(id) {
      const r = MH.region(id);
      ctl.current = id;
      strip.querySelectorAll('button').forEach((n) => n.classList.toggle('on', n.dataset.id === id));
      const items = byRegion(id).sort((a, b) => (a.status === 'fechado') - (b.status === 'fechado') || b.featured - a.featured);
      const counts = MH.TYPES.map((t) => [t, items.filter((l) => l.type === t.id && l.status !== 'fechado').length]).filter((x) => x[1]);
      drawer.innerHTML = `<div class="drawer__head">
          <button class="x" aria-label="close">${MH.icon('close')}</button>
          <h3>${MH.esc(MH.name(r))}</h3>
          <p>${MH.esc(pt ? r.pt : r.desc)}</p>
          <div class="drawer__count">${counts.map(([t, n]) => `<span class="chip">${typeDot(t.id)}${MH.name(t)} ${n}</span>`).join('')}</div>
        </div>
        <div class="drawer__list">${items.length ? items.map((l) => `<a class="mini" href="listing.html?cod=${encodeURIComponent(l.cod)}">
            <img src="${MH.esc((l.images && l.images[0]) || '')}" alt="" loading="lazy">
            <div class="mini__b"><span class="mini__t">${MH.esc(MH.title(l))}</span>
            <span class="mini__s">${MH.name(MH.type(l.type))} · ${MH.esc(MH.specText(l, 2))}${l.status !== 'ativo' ? ' · ' + MH.name(MH.status(l.status)) : ''}</span>
            <span class="cod">Cod ${MH.esc(l.cod)}</span></div></a>`).join('') : `<div class="drawer__empty">${MH.t('map.empty')}</div>`}</div>
        <div class="drawer__foot"><a class="btn btn--ink btn--block" href="list.html?region=${id}">${MH.t('map.all')} ${MH.icon('arrow')}</a></div>`;
      drawer.classList.add('open');
      drawer.querySelector('.x').onclick = ctl.close;
      m25.setActive(id); m25.focus(id);
      if (isMobile()) { const b = strip.querySelector(`[data-id="${id}"]`); if (b) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); }
    },
    close() {
      ctl.current = null; drawer.classList.remove('open');
      strip.querySelectorAll('.on').forEach((n) => n.classList.remove('on'));
      m25.setActive(null); m25.unfocus();
    }
  };

  /* ---------- 花园俯览地图（CSS 3D，手机也流畅） ---------- */
  const m25 = (function () {
    const W = 1200, H = 760;
    const canvas = $('#canvas'), tilt = $('#tilt'), plane = $('#plane');
    const S = { x: 0, y: 0, s: 1 }, V = { tilt: 0, rz: 0 };
    const target = () => (isMobile() ? { tilt: 40, rz: -6 } : { tilt: 54, rz: -14 });
    let raised = false;

    plane.innerHTML = `<svg class="plane__bg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
      <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="rgba(72,110,80,.2)"/></pattern></defs>
      <rect width="${W}" height="${H}" fill="url(#dots)"/>
      <path d="M150 300 C 220 140, 480 70, 700 80 S 1010 150, 1020 300 S 980 560, 900 700 S 520 770, 330 720 S 90 480, 150 300z" fill="rgba(255,255,255,.62)" stroke="#A9C3A4" stroke-width="1.5" stroke-dasharray="4 7"/>
      <ellipse cx="395" cy="575" rx="62" ry="40" fill="#C4DDB6"/><text x="395" y="580" text-anchor="middle" font-size="13" fill="#587A52" font-family="sans-serif">Ibirapuera</text>
      <circle cx="700" cy="572" r="20" fill="#C4DDB6"/><text x="700" y="610" text-anchor="middle" font-size="11" fill="#587A52" font-family="sans-serif">Aclimação</text>
      <g fill="#A8CC9A">${[[340, 540], [352, 606], [446, 604], [452, 548], [240, 330], [262, 352], [905, 600], [930, 578], [640, 150], [560, 660], [980, 360], [470, 110], [820, 150], [200, 480]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/><circle cx="${x + 9}" cy="${y + 6}" r="6" fill="#B9D7AB"/>`).join('')}</g>
      <path d="M-20 238 C 150 258, 300 205, 450 228 S 700 252, 850 218 S 1050 200, 1220 172" fill="none" stroke="#B5DDE4" stroke-width="16" stroke-linecap="round"/>
      <path d="M-20 238 C 150 258, 300 205, 450 228 S 700 252, 850 218 S 1050 200, 1220 172" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>
      <text x="250" y="212" font-size="13" font-style="italic" fill="#5E97A2" font-family="serif">Rio Tietê</text>
      <path d="M365 222 C 345 330, 300 420, 325 540 S 360 690, 330 790" fill="none" stroke="#B5DDE4" stroke-width="11" stroke-linecap="round"/>
      <text x="250" y="455" font-size="13" font-style="italic" fill="#5E97A2" font-family="serif" transform="rotate(-78 250 455)">Rio Pinheiros</text>
      <path d="M920 790 C 860 700, 770 610, 705 525 S 615 385, 600 305 S 565 245, 545 232" fill="none" stroke="#CDE8EC" stroke-width="6" stroke-linecap="round"/>
      <path d="M600 60 L 595 250 L 585 395 L 560 505 L 478 625 L 465 760" fill="none" stroke="#9AA7CF" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>
      <text x="606" y="190" font-size="11" fill="#7D8AB5" font-family="sans-serif">${pt ? 'Metrô Linha 1' : '地铁 1 号线'}</text>
      <g transform="translate(1110 70)" fill="#8FA08F" font-family="sans-serif" font-size="11"><path d="M0 -14 L 5 4 L 0 0 L -5 4z"/><text x="0" y="20" text-anchor="middle">N</text></g>
      <text x="1090" y="215" font-size="11" fill="#8FA08F" font-family="sans-serif">${pt ? 'Aeroporto GRU' : 'GRU 国际机场'}</text>
      <path d="M1000 690 C 1060 720, 1130 720, 1180 700" fill="none" stroke="#A9C3A4" stroke-width="1.5" stroke-dasharray="3 6"/>
    </svg>`;

    // 区域：底部光点 + 柱子（高度=在推房源数）+ 立起来的标签
    const nodes = MH.REGIONS.map((r) => {
      const n = liveIn(r.id).length, hot = n >= 3;
      const types = [...new Set(liveIn(r.id).map((l) => l.type))];
      const h = n ? Math.min(200, 36 + n * 30) : 0;
      const base = document.createElement('div');
      base.className = 'rbase' + (hot ? '' : ' cool');
      const bar = document.createElement('div');
      bar.className = 'rbar' + (hot ? '' : ' cool');
      const b = document.createElement('button');
      b.className = 'rnode' + (n ? '' : ' zero') + (r.outside ? ' outside' : '') + (hot ? ' pulse' : '');
      b.dataset.id = r.id;
      b.setAttribute('aria-label', `${MH.name(r)} ${n}`);
      b.innerHTML = `<span class="rnode__pill"><span class="rnode__n">${n}</span><span class="rnode__t"><b>${MH.esc(MH.name(r))}</b><small>${MH.esc(pt ? '' : r.sub)}</small></span><span class="rnode__types">${types.map(typeDot).join('')}</span></span>`;
      [base, bar, b].forEach((el) => { el.style.left = r.x + 'px'; el.style.top = r.y + 'px'; plane.appendChild(el); });
      return { r, h, bar, b };
    });
    // 漂浮的房源照片
    const anchors = {
      santana: [[450, 95]], guarulhos: [[900, 70]], bomretiro: [[360, 320]], bras: [[905, 290]], centro: [[420, 445]],
      mooca: [[990, 440], [955, 548]], cambuci: [[612, 692]], vilaclementino: [[318, 690]], ipiranga: [[792, 735]], fora: [[1125, 545]]
    };
    MH.REGIONS.forEach((r, ri) => {
      const pts = anchors[r.id] || [];
      liveIn(r.id).filter((l) => l.images && l.images[0]).slice(0, pts.length).forEach((l, k) => {
        const a = document.createElement('a');
        a.className = 'bubble' + (k ? ' bubble--s' : '');
        a.href = 'listing.html?cod=' + encodeURIComponent(l.cod);
        a.style.left = pts[k][0] + 'px'; a.style.top = pts[k][1] + 'px';
        a.style.setProperty('--d', -((ri * 0.9 + k * 1.7) % 6) + 's');
        a.title = MH.title(l);
        a.setAttribute('draggable', 'false');
        a.innerHTML = `<span><img src="${MH.esc(l.images[0])}" alt="" loading="lazy" draggable="false"></span>`;
        plane.appendChild(a);
      });
    });

    const icons = { zIn: 'plus', zOut: 'minus', rotL: 'rotl', rotR: 'rotr', flat: 'cube' };
    Object.entries(icons).forEach(([id, ic]) => ($('#' + id).innerHTML = MH.icon(ic)));
    $('#hint').innerHTML = MH.icon('area') + MH.t('map.hint');

    const setView = () => {
      canvas.style.setProperty('--tilt', V.tilt + 'deg');
      canvas.style.setProperty('--rz', V.rz + 'deg');
      nodes.forEach((n) => { const h = V.tilt > 0 ? n.h : 0; n.b.style.setProperty('--h', h + 'px'); n.bar.style.setProperty('--h', h + 'px'); });
      $('#flat').classList.toggle('on', V.tilt > 0);
    };
    const apply = (anim) => {
      plane.classList.toggle('anim', !!anim);
      plane.style.transform = `translate(${S.x}px, ${S.y}px) scale3d(${S.s}, ${S.s}, ${S.s})`;
      plane.style.setProperty('--inv', (1 / S.s).toFixed(4));
    };
    const fit = (anim) => {
      const tw = tilt.clientWidth, th = tilt.clientHeight;
      if (isMobile()) {
        const bx = [345, 1150], by = [60, 700];
        S.s = Math.min(tw / (bx[1] - bx[0]), (th - 30) / (by[1] - by[0])) * (V.tilt ? 1.08 : 1);
        S.x = (tw - (bx[1] - bx[0]) * S.s) / 2 - bx[0] * S.s;
        S.y = (th - (by[1] - by[0]) * S.s) / 2 - by[0] * S.s + 20;
      } else {
        S.s = Math.min(tw / W, th / H) * 0.98;
        S.x = (tw - W * S.s) / 2; S.y = (th - H * S.s) / 2 - 10;
      }
      apply(anim);
    };
    const clamp = () => {
      const tw = tilt.clientWidth, th = tilt.clientHeight, m = 260;
      S.x = Math.min(m, Math.max(tw - W * S.s - m, S.x));
      S.y = Math.min(m, Math.max(th - H * S.s - m, S.y));
    };
    const zoom = (f) => {
      const ns = Math.min(1.8, Math.max(0.45, S.s * f)), cx = tilt.clientWidth / 2, cy = tilt.clientHeight / 2;
      S.x = cx - (cx - S.x) * (ns / S.s); S.y = cy - (cy - S.y) * (ns / S.s); S.s = ns; clamp();
    };
    fit(false); setView();

    // 滚动进入时"立起来"
    function raise() {
      if (raised) return; raised = true;
      const t = target();
      if (MH.reduced()) canvas.classList.add('live');
      V.tilt = t.tilt; V.rz = t.rz; setView();
      if (MH.reduced()) requestAnimationFrame(() => canvas.classList.remove('live'));
      if (!isMobile()) { const h = $('#hint'); h.classList.remove('hide'); setTimeout(() => h.classList.add('hide'), 3800); }
    }

    // 拖动平移（桌面）：把屏幕位移换算回倾斜后的地图平面
    let drag = null, moved = 0, vel = { x: 0, y: 0 }, raf = 0;
    const toPlane = (dx, dy) => {
      const ct = Math.max(0.35, Math.cos(V.tilt * Math.PI / 180)), r = V.rz * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
      const ux = dx, uy = dy / ct;
      return { x: ux * c + uy * s, y: -ux * s + uy * c };
    };
    canvas.addEventListener('pointerdown', (e) => {
      if (isMobile() || e.button !== 0 || e.target.closest('.canvas__ui')) return;
      cancelAnimationFrame(raf);
      drag = { x: e.clientX, y: e.clientY, t: performance.now() }; moved = 0; vel = { x: 0, y: 0 };
      plane.classList.remove('anim');
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now(), dt = Math.max(1, now - drag.t);
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 4) { canvas.classList.add('dragging'); $('#hint').classList.add('hide'); try { canvas.setPointerCapture(e.pointerId); } catch (_) {} }
      const p = toPlane(dx, dy);
      S.x += p.x; S.y += p.y; clamp(); apply(false);
      vel = { x: p.x / dt * 16, y: p.y / dt * 16 };
      drag = { x: e.clientX, y: e.clientY, t: now };
    });
    window.addEventListener('pointerup', () => {
      if (!drag) return;
      drag = null; canvas.classList.remove('dragging');
      if (MH.reduced()) return;
      const glide = () => {
        vel.x *= 0.92; vel.y *= 0.92;
        if (Math.abs(vel.x) + Math.abs(vel.y) < 0.3) return;
        S.x += vel.x; S.y += vel.y; clamp(); apply(false); raf = requestAnimationFrame(glide);
      };
      raf = requestAnimationFrame(glide);
    });
    canvas.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    canvas.addEventListener('wheel', (e) => {
      if (isMobile() || !e.ctrlKey) return; // 只响应触控板捏合 / Ctrl+滚轮
      e.preventDefault(); zoom(Math.exp(-e.deltaY * 0.01)); apply(false);
    }, { passive: false });
    $('#zIn').onclick = () => { zoom(1.25); apply(true); };
    $('#zOut').onclick = () => { zoom(0.8); apply(true); };
    $('#rotL').onclick = () => { if (!V.tilt) V.tilt = target().tilt; V.rz = Math.max(-60, V.rz - 15); setView(); };
    $('#rotR').onclick = () => { if (!V.tilt) V.tilt = target().tilt; V.rz = Math.min(60, V.rz + 15); setView(); };
    $('#flat').onclick = () => { const t = target(); if (V.tilt) { V.tilt = 0; V.rz = 0; } else { V.tilt = t.tilt; V.rz = t.rz; } raised = true; setView(); fit(true); };
    plane.addEventListener('click', (e) => { const b = e.target.closest('.rnode'); if (b) ctl.select(b.dataset.id); });

    function focus(id) {
      const r = MH.region(id);
      if (isMobile()) return;
      canvas.classList.add('with-drawer');
      const tw = canvas.clientWidth - 410, th = canvas.clientHeight;
      S.s = Math.max(S.s, 1);
      S.x = tw / 2 - r.x * S.s; S.y = th / 2 - r.y * S.s; clamp(); apply(true);
    }
    function unfocus() { canvas.classList.remove('with-drawer'); }
    function setActive(id) { nodes.forEach((n) => n.b.classList.toggle('on', n.r.id === id)); }
    function resize() { fit(false); if (ctl.current) focus(ctl.current); }
    return { raise, focus, unfocus, setActive, resize };
  })();

  /* ---------- 地图区滚动进入视野时"立起来" ---------- */
  const subText = () => MH.t(isMobile() ? 'map.subMobile' : 'map.sub');
  $('#mapSub').textContent = subText();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => { if (ents.some((en) => en.isIntersecting)) { m25.raise(); io.disconnect(); } }, { threshold: 0.35 });
    io.observe($('.mapwrap'));
  } else m25.raise();
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { $('#mapSub').textContent = subText(); m25.resize(); }, 150); });

  /* ---------- 类型 ---------- */
  const typeImg = { residencial: MH.IMG.living[0], comercial: MH.IMG.loja[0], galpao: MH.IMG.galpao[0], terreno: MH.IMG.terreno[0], fazenda: MH.IMG.fazenda[0] };
  $('#types').innerHTML = MH.TYPES.map((t) => {
    const ls = live.filter((l) => l.type === t.id);
    const img = (ls.find((l) => l.images && l.images[0]) || {}).images;
    return `<a class="type reveal" href="list.html?type=${t.id}">
      <img src="${MH.esc((img && img[0]) || typeImg[t.id])}" alt="" loading="lazy">
      <span class="type__n">${ls.length}</span>
      <span class="type__b"><b>${MH.name(t)}</b><span>${pt ? '' : t.pt}</span></span></a>`;
  }).join('');

  /* ---------- 精选 ---------- */
  const feat = live.filter((l) => l.featured).concat(live.filter((l) => !l.featured)).slice(0, 6);
  $('#featured').innerHTML = feat.map((l) => MH.card(l)).join('');

  /* ---------- 关于 ---------- */
  const C = MH.CONFIG;
  $('#aboutBadge').innerHTML = `${MH.icon('shield')}<div><b>${C.creci}</b><small>${pt ? 'Imobiliária registrada em São Paulo' : '圣保罗正式注册 · CRECI 企业牌照'}</small></div>`;
  $('#aboutLead').textContent = pt
    ? 'A My House Imobiliária atua na compra, venda e locação de imóveis residenciais, comerciais e de investimento em São Paulo, com equipe jurídica própria acompanhando cada etapa.'
    : 'My House Imobiliária 专注圣保罗住宅、商业及投资类房产的买卖与租赁。丸子用中文全程陪你看房、谈价、签约，公司自有司法团队深度参与每一笔交易，确保合规、安全、透明。';
  const pillars = pt
    ? [['shield', 'CRECI PJ', 'Registro oficial'], ['doc', 'Contratos', 'Revisão jurídica'], ['search', 'Due diligence', 'Matrícula e certidões'], ['bank', 'Financiamento', 'Trâmites bancários']]
    : [['shield', '持牌经营', 'CRECI 企业牌照'], ['doc', '合同审核', '司法团队把关'], ['search', '产权调查', 'Matrícula 与各项证明'], ['bank', '银行手续', '交易全程法律保障']];
  $('#pillars').innerHTML = pillars.map(([i, b, s]) => `<div class="pillar reveal">${MH.icon(i)}<b>${b}</b><span>${s}</span></div>`).join('');

  /* ---------- 联系 ---------- */
  $('#contactBtns').innerHTML = `<a class="btn btn--wa" href="${MH.waLink()}" target="_blank" rel="noopener">${MH.icon('whatsapp')} WhatsApp ${MH.esc(C.whatsappLabel)}</a>
    <button class="btn" data-contact>${MH.icon('wechat')} ${pt ? 'WeChat' : '加微信 / 扫码'}</button>
    <span class="contact__dy">${MH.icon('note')} 抖音号 ${C.douyin}</span>`;

  MH.reveal();
})();
