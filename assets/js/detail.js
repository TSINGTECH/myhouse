/* 房源详情：视频/大图在前，关键数字，亮点，介绍；不显示价格，引导询价 */
(async function () {
  const main = document.getElementById('main');
  const l = await MH.store.byCod(MH.qs('cod'));
  const pt = MH.lang() === 'pt';

  if (!l || l.status === 'oculto') {
    MH.renderChrome();
    main.innerHTML = `<div class="empty"><h1 style="font-size:28px;margin-bottom:16px">${MH.t('detail.notfound')}</h1>
      <a class="btn btn--ink" href="list.html">${MH.icon('back')} ${MH.t('detail.back')}</a></div>`;
    return;
  }
  MH.renderChrome({ listing: l });

  const t = MH.type(l.type), r = MH.region(l.region), C = MH.CONFIG;
  const title = MH.title(l);
  document.title = `${title} · Cod ${l.cod} · My House`;
  const isVideo = (v) => v && (/^data:video/.test(v) || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(v));
  const imgs = l.images || [];
  const media = [];
  if (isVideo(l.video)) media.push({ v: l.video });
  imgs.forEach((src) => media.push({ i: src }));
  const shown = media.slice(0, 3);
  const mediaHTML = (m, main) => m.v
    ? `<video src="${MH.esc(m.v)}" ${imgs[0] ? `poster="${MH.esc(imgs[0])}"` : ''} controls playsinline preload="metadata"></video>`
    : `<img src="${MH.esc(m.i)}" alt="${MH.esc(title)}" ${main ? '' : 'loading="lazy"'} data-lb="${imgs.indexOf(m.i)}">`;

  const st = l.status !== 'ativo' ? MH.status(l.status) : null;
  const specs = MH.specs(l);
  const similar = (await MH.store.publicList()).filter((x) => x.cod !== l.cod && (x.region === l.region || x.type === l.type) && x.status !== 'fechado')
    .sort((a, b) => (b.region === l.region) - (a.region === l.region)).slice(0, 3);

  main.innerHTML = `
    <nav class="crumbs"><a href="list.html">${MH.t('nav.listings')}</a><span>/</span><a href="list.html?region=${r.id}">${MH.esc(MH.name(r))}</a><span>/</span><span class="cod">Cod ${MH.esc(l.cod)}</span></nav>
    <div class="gallery gallery--${Math.min(3, media.length || 1)}">
      ${(shown.length ? shown : [{ i: '' }]).map((m, k) => `<div class="${k ? '' : 'gallery__main'}">${mediaHTML(m, !k)}</div>`).join('')}
      ${media.length > 3 ? `<button class="gallery__more" data-lb="0">${MH.icon('image')} ${pt ? 'Ver todas' : '查看全部'} ${imgs.length} ${pt ? 'fotos' : '张'}</button>` : ''}
      ${!isVideo(l.video) && l.video ? '' : ''}
    </div>
    ${media.length > 1 ? `<div class="gallery__count" id="gcount">1 / ${media.length}</div>` : ''}
    <div class="detail">
      <div>
        <div class="detail__tags">
          <span class="chip"><i style="background:${t.color}"></i>${MH.name(t)}</span>
          <span class="chip">${MH.name(MH.deal(l.deal))}</span>
          ${st ? `<span class="chip">${MH.name(st)}</span>` : ''}
        </div>
        <h1>${MH.esc(title)}</h1>
        <p class="detail__loc">${MH.icon('pin')} ${MH.esc(MH.name(r))}${l.location ? ' · ' + MH.esc(l.location) : ''} · São Paulo</p>
        ${l.video && !isVideo(l.video) ? `<p style="margin-top:14px"><a class="btn btn--sm" href="${MH.esc(l.video)}" target="_blank" rel="noopener">${MH.icon('play')} ${pt ? 'Ver vídeo' : '观看房源视频'}</a></p>` : ''}
        ${specs.length ? `<div class="specs">${specs.map((s) => `<div class="spec">${MH.icon(s.icon)}<b>${MH.esc(s.value)}</b><span>${s.label}</span></div>`).join('')}</div>` : ''}
        ${(l.highlights || []).length ? `<section class="block"><h2>${MH.t('detail.highlights')}</h2><div class="hl">${l.highlights.map((h) => `<span>${MH.esc(h)}</span>`).join('')}</div></section>` : ''}
        <section class="block"><h2>${MH.t('detail.desc')}</h2><p class="prose">${MH.esc(MH.desc(l))}</p></section>
      </div>
      <aside class="aside">
        <div class="aside__agent"><div class="avatar">丸</div><div><b>${C.agent} · My House</b><small>${C.creci}</small></div></div>
        <div class="aside__price">${MH.t('price.ask')}</div>
        <div class="aside__cod"><span class="cod">Cod ${MH.esc(l.cod)}</span><button id="copyCod">${MH.icon('copy')} ${MH.t('btn.copy')}</button></div>
        <a class="btn btn--wa btn--block" href="${MH.waLink(l)}" target="_blank" rel="noopener">${MH.icon('whatsapp')} ${MH.t('btn.inquire')}</a>
        <button class="btn btn--wechat btn--block" data-contact>${MH.icon('wechat')} ${pt ? 'Falar no WeChat' : '微信咨询'}</button>
        <button class="btn btn--block" id="share">${MH.icon('share')} ${MH.t('btn.share')}</button>
        <div class="aside__legal">${MH.icon('shield')}<span>${MH.t('detail.legal')}</span></div>
      </aside>
    </div>
    ${similar.length ? `<section class="section section--tight"><div class="sec-head"><h2>${MH.t('detail.similar')}</h2><a class="link-arrow" href="list.html?region=${r.id}">${MH.esc(MH.name(r))} ${MH.icon('arrow')}</a></div><div class="grid">${similar.map((x) => MH.card(x)).join('')}</div></section>` : ''}
  `;

  document.getElementById('copyCod').onclick = (e) => MH.copy(l.cod, e.currentTarget);
  document.getElementById('share').onclick = async (e) => {
    const url = location.href, text = `${title}（Cod ${l.cod}）`;
    if (navigator.share) { try { await navigator.share({ title: text, text, url }); return; } catch (_) { return; } }
    MH.copy(`${text}\n${url}`, e.currentTarget);
  };

  // 手机端横滑计数
  const g = main.querySelector('.gallery'), gc = document.getElementById('gcount');
  if (g && gc) g.addEventListener('scroll', () => { gc.textContent = `${Math.round(g.scrollLeft / g.clientWidth) + 1} / ${media.length}`; }, { passive: true });
  // 手机上横滑显示全部图片，桌面只显示前三张（多出来的用 CSS 隐藏）
  if (media.length > 3) g.insertAdjacentHTML('beforeend', media.slice(3).map((m) => `<div class="gallery__extra">${mediaHTML(m)}</div>`).join(''));

  // 大图查看
  main.addEventListener('click', (e) => {
    const el = e.target.closest('[data-lb]');
    if (!el || !imgs.length) return;
    let i = Math.max(0, +el.dataset.lb || 0);
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `<img alt=""><button class="lb-x" aria-label="close">${MH.icon('close')}</button>
      <button class="lb-p" aria-label="prev">${MH.icon('back')}</button><button class="lb-n" aria-label="next">${MH.icon('arrow')}</button><span class="lb-c"></span>`;
    const show = () => { lb.querySelector('img').src = imgs[i]; lb.querySelector('.lb-c').textContent = `${i + 1} / ${imgs.length}`; };
    const close = () => { lb.classList.remove('open'); setTimeout(() => lb.remove(), 250); document.removeEventListener('keydown', key); };
    const key = (ev) => { if (ev.key === 'Escape') close(); if (ev.key === 'ArrowRight') { i = (i + 1) % imgs.length; show(); } if (ev.key === 'ArrowLeft') { i = (i - 1 + imgs.length) % imgs.length; show(); } };
    lb.addEventListener('click', (ev) => {
      if (ev.target.closest('.lb-n')) { i = (i + 1) % imgs.length; show(); }
      else if (ev.target.closest('.lb-p')) { i = (i - 1 + imgs.length) % imgs.length; show(); }
      else if (ev.target === lb || ev.target.closest('.lb-x')) close();
    });
    document.addEventListener('keydown', key);
    document.body.appendChild(lb); show(); requestAnimationFrame(() => lb.classList.add('open'));
  });
  MH.reveal();
})();
