/* 房源列表：按类型 / 区域 / 买卖租赁 / 关键词筛选，条件写进网址方便转发 */
(async function () {
  const $ = (s) => document.querySelector(s);
  MH.renderChrome();
  MH.applyI18n();
  const all = await MH.store.publicList();

  const p = new URLSearchParams(location.search);
  const F = { type: p.get('type') || '', region: p.get('region') || '', deal: p.get('deal') || '', q: p.get('q') || '', closed: p.get('closed') === '1' };

  const segType = $('#segType');
  segType.innerHTML = [{ id: '', zh: MH.t('list.allTypes'), pt: MH.t('list.allTypes') }].concat(MH.TYPES)
    .map((t) => `<button data-v="${t.id}">${t.color ? `<i style="background:${t.color}"></i>` : ''}${MH.name(t)}</button>`).join('');
  $('#selRegion').innerHTML = `<option value="">${MH.t('list.allRegions')}</option>` + MH.REGIONS.map((r) => `<option value="${r.id}">${MH.esc(MH.name(r))}</option>`).join('');
  $('#selDeal').innerHTML = `<option value="">${MH.t('list.allDeals')}</option>` + MH.DEALS.map((d) => `<option value="${d.id}">${MH.name(d)}</option>`).join('');
  $('#selRegion').value = F.region; $('#selDeal').value = F.deal; $('#q').value = F.q; $('#showClosed').checked = F.closed;

  function render() {
    segType.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === F.type));
    const q = F.q.trim().toLowerCase();
    const rows = all.filter((l) =>
      (!F.type || l.type === F.type) && (!F.region || l.region === F.region) && (!F.deal || l.deal === F.deal) &&
      (F.closed || l.status !== 'fechado') &&
      (!q || [l.cod, l.title, l.titlePt, l.desc, MH.region(l.region).zh, MH.region(l.region).pt, (l.highlights || []).join(' ')].join(' ').toLowerCase().includes(q))
    ).sort((a, b) => (a.status === 'fechado') - (b.status === 'fechado') || b.featured - a.featured || String(b.createdAt).localeCompare(String(a.createdAt)));
    $('#count').textContent = MH.t('list.count', { n: rows.length });
    $('#grid').innerHTML = rows.length ? rows.map((l) => MH.card(l)).join('') : `<div class="empty">${MH.t('list.empty')}</div>`;
    const r = F.region ? MH.region(F.region) : null, t = F.type ? MH.type(F.type) : null;
    const title = [r && MH.name(r), t && MH.name(t)].filter(Boolean).join(' · ') || MH.t('list.title');
    $('#pageTitle').textContent = title;
    document.title = title + ' · My House Imobiliária';
    const u = new URLSearchParams();
    Object.entries(F).forEach(([k, v]) => { if (v) u.set(k, v === true ? '1' : v); });
    try { history.replaceState(null, '', u.toString() ? '?' + u : location.pathname); } catch (e) {}
    MH.reveal();
  }
  segType.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { F.type = b.dataset.v; render(); } });
  $('#selRegion').onchange = (e) => { F.region = e.target.value; render(); };
  $('#selDeal').onchange = (e) => { F.deal = e.target.value; render(); };
  $('#showClosed').onchange = (e) => { F.closed = e.target.checked; render(); };
  let tq; $('#q').addEventListener('input', (e) => { clearTimeout(tq); tq = setTimeout(() => { F.q = e.target.value; render(); }, 180); });
  render();
})();
