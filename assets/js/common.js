/* 公共：多语言、图标、页头页脚、房源卡片、联系方式弹层、动效 */
window.MH = window.MH || {};

(function () {
  /* ---------- 多语言 ---------- */
  const DICT = {
    'nav.listings': ['全部房源', 'Imóveis'],
    'nav.map': ['按区域找', 'Regiões'],
    'nav.about': ['关于我们', 'Sobre'],
    'nav.contact': ['联系丸子', 'Contato'],
    'hero.kicker': ['圣保罗 · 华人房产顾问', 'Consultoria imobiliária em São Paulo'],
    'hero.title': ['在圣保罗，<br>找到你的家与铺位', 'Seu lar e seu ponto<br>em São Paulo'],
    'hero.sub': ['住宅 · 店面 · 仓库 · 地皮 · 农场　中文全程服务，司法团队保障每一笔交易', 'Residencial · Comercial · Galpões · Terrenos · Fazendas — atendimento em chinês e português, com suporte jurídico'],
    'cod.placeholder': ['输入 Cod 编号，如 11112026Rs', 'Código, ex. 11112026Rs'],
    'cod.btn': ['查房源', 'Buscar'],
    'cod.notfound': ['没找到这个编号，可以直接私信丸子询问', 'Código não encontrado. Fale com a gente.'],
    'cod.hint': ['在抖音、朋友圈看到的房源，输入编号直接查看详情', 'Viu um imóvel no Douyin ou Instagram? Digite o código.'],
    'stat.listings': ['在推房源', 'Imóveis ativos'],
    'stat.regions': ['覆盖区域', 'Regiões'],
    'stat.types': ['物业类型', 'Tipos'],
    'map.title': ['按区域找房', 'Explore por região'],
    'map.sub': ['拖动画布浏览圣保罗，点击区域查看该区房源', 'Arraste o mapa e toque numa região'],
    'map.subMobile': ['点击区域查看该区房源', 'Toque numa região para ver os imóveis'],
    'map.note': ['示意图 · 非精确比例', 'Mapa ilustrativo'],
    'map.hint': ['按住拖动，探索圣保罗', 'Arraste para explorar'],
    'map.all': ['查看该区全部房源', 'Ver todos desta região'],
    'map.empty': ['这个区域暂时没有在推房源，有需求可以直接告诉丸子', 'Sem imóveis no momento. Fale com a gente.'],
    'types.title': ['按类型找', 'Por tipo'],
    'featured.title': ['精选房源', 'Destaques'],
    'featured.more': ['看全部房源', 'Ver todos'],
    'about.title': ['关于丸子与 My House', 'Sobre a My House'],
    'contact.title': ['找丸子聊聊', 'Fale com a gente'],
    'contact.sub': ['看房、估价、委托出售出租，微信或 WhatsApp 都可以', 'Visitas, avaliação, venda ou locação — WeChat ou WhatsApp'],
    'btn.wechat': ['加微信', 'WeChat'],
    'btn.whatsapp': ['WhatsApp', 'WhatsApp'],
    'btn.inquire': ['询价 / 预约看房', 'Consultar valor / Agendar visita'],
    'btn.share': ['分享', 'Compartilhar'],
    'btn.copy': ['复制', 'Copiar'],
    'btn.copied': ['已复制', 'Copiado'],
    'price.ask': ['价格私信咨询', 'Valor sob consulta'],
    'list.title': ['全部房源', 'Todos os imóveis'],
    'list.allTypes': ['全部类型', 'Todos'],
    'list.allRegions': ['全部区域', 'Todas as regiões'],
    'list.allDeals': ['买卖和租赁', 'Venda e locação'],
    'list.search': ['搜索 Cod 或关键词', 'Código ou palavra-chave'],
    'list.count': ['共 {n} 套', '{n} imóveis'],
    'list.empty': ['没有符合条件的房源，换个条件试试，或者直接问丸子', 'Nenhum imóvel encontrado.'],
    'list.showClosed': ['显示已成交', 'Mostrar fechados'],
    'detail.specs': ['基本信息', 'Características'],
    'detail.highlights': ['亮点', 'Destaques'],
    'detail.desc': ['房源介绍', 'Descrição'],
    'detail.similar': ['同区域其他房源', 'Na mesma região'],
    'detail.notfound': ['这套房源不存在或已下架', 'Imóvel não encontrado'],
    'detail.back': ['返回房源列表', 'Voltar'],
    'detail.legal': ['My House 司法团队全程参与合同审核、产权调查和银行手续', 'Equipe jurídica própria: contratos, due diligence e trâmites bancários'],
    'footer.legal': ['房源信息仅供参考，以实际合同为准。我们依照 LGPD 保护你的个人信息。', 'Informações sujeitas a alteração. Seus dados são protegidos conforme a LGPD.'],
    'footer.admin': ['管理后台', 'Admin'],
    'wa.hello': ['你好丸子，我在网站上看到房源', 'Olá, vi o imóvel no site']
  };
  let lang = 'zh';
  try { lang = localStorage.getItem('mh-lang') || 'zh'; } catch (e) {}
  MH.lang = () => lang;
  MH.t = (k, vars) => {
    let s = (DICT[k] || [k, k])[lang === 'pt' ? 1 : 0];
    if (vars) Object.keys(vars).forEach((v) => (s = s.replace('{' + v + '}', vars[v])));
    return s;
  };
  MH.setLang = (l) => { try { localStorage.setItem('mh-lang', l); } catch (e) {} location.reload(); };
  MH.applyI18n = (root) => {
    (root || document).querySelectorAll('[data-i18n]').forEach((el) => (el.innerHTML = MH.t(el.dataset.i18n)));
    (root || document).querySelectorAll('[data-i18n-ph]').forEach((el) => (el.placeholder = MH.t(el.dataset.i18nPh)));
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'zh-CN';
  };

  /* ---------- 查找 ---------- */
  const by = (arr) => (id) => arr.find((x) => x.id === id) || { id, zh: id, pt: id };
  MH.region = by(MH.REGIONS);
  MH.type = by(MH.TYPES);
  MH.deal = by(MH.DEALS);
  MH.status = by(MH.STATUS);
  MH.name = (o) => (lang === 'pt' ? o.pt : o.zh);
  MH.num = (n) => (n == null || n === '' ? '' : Number(n).toLocaleString('pt-BR'));
  MH.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  MH.qs = (k) => new URLSearchParams(location.search).get(k);

  /* 葡语模式下房源标题自动生成（她可以在后台另填葡语标题） */
  MH.title = (l) => {
    if (lang === 'pt') {
      if (l.titlePt) return l.titlePt;
      const sz = l.type === 'fazenda' ? MH.num(l.hectares) + ' ha' : MH.num(l.area) + ' m²';
      return `${MH.type(l.type).pt} ${sz} · ${MH.region(l.region).pt}`;
    }
    return l.title;
  };
  MH.desc = (l) => (lang === 'pt' && l.descPt ? l.descPt : l.desc);

  /* ---------- 图标 ---------- */
  const P = {
    area: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    bed: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 15h18M6 10V7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
    bath: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"/>',
    car: '<path d="M5 16h14M6 16v2M18 16v2M4 16l1.5-5.5A2 2 0 0 1 7.4 9h9.2a2 2 0 0 1 1.9 1.5L20 16"/><circle cx="7.5" cy="13.5" r=".6"/><circle cx="16.5" cy="13.5" r=".6"/>',
    suite: '<path d="M4 20V8l8-4 8 4v12M9 20v-6h6v6"/>',
    pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
    height: '<path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4"/>',
    dock: '<path d="M3 21V9l9-5 9 5v12M7 21v-7h10v7"/>',
    leaf: '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    share: '<path d="M12 3v13M7 8l5-5 5 5M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5"/>',
    play: '<path d="M8 5v14l11-7z"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    shield: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    bank: '<path d="M3 10 12 4l9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    text: '<path d="M4 6h16M4 12h10M4 18h13"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    note: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    rotl: '<path d="M4 4v5h5"/><path d="M5.6 15a7 7 0 1 0 1.5-7.3L4 9"/>',
    rotr: '<path d="M20 4v5h-5"/><path d="M18.4 15a7 7 0 1 1-1.5-7.3L20 9"/>',
    cube: '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
    building: '<path d="M4 21V5l7-2v18M11 9l9 3v9M7 8h1M7 12h1M7 16h1M15 14h1M15 18h1M3 21h18"/>'
  };
  const FILLED = {
    whatsapp: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/>',
    wechat: '<path fill="currentColor" stroke="none" d="M9 4C5.1 4 2 6.6 2 9.8c0 1.8 1 3.4 2.6 4.5L4 16.5l2.5-1.3c.8.2 1.6.4 2.5.4h.6a5.3 5.3 0 0 1-.2-1.4c0-3.2 3-5.7 6.8-5.7h.6C16.2 5.8 12.9 4 9 4zm-2.3 3.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zm4.6 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8zM16.2 10c-3.2 0-5.8 2.1-5.8 4.7s2.6 4.7 5.8 4.7c.7 0 1.3-.1 2-.3l2 1.1-.5-1.8c1.4-.9 2.3-2.2 2.3-3.7 0-2.6-2.6-4.7-5.8-4.7zm-1.9 2.5a.7.7 0 1 1 0 1.5.7.7 0 0 1 0-1.5zm3.8 0a.7.7 0 1 1 0 1.5.7.7 0 0 1 0-1.5z"/>'
  };
  MH.icon = (name, cls) =>
    `<svg class="ic ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || FILLED[name] || ''}</svg>`;

  /* ---------- 规格 ---------- */
  MH.specs = (l) => {
    const pt = lang === 'pt', out = [];
    const add = (icon, zh, ptl, v, unit) => { if (v !== null && v !== undefined && v !== '' && v !== false) out.push({ icon, label: pt ? ptl : zh, value: (typeof v === 'number' ? MH.num(v) : v) + (unit || '') }); };
    switch (l.type) {
      case 'residencial':
        add('area', '面积', 'Área', l.area, ' m²'); add('suite', '套房', 'Suítes', l.suites);
        add('bed', '卧室', 'Dormitórios', l.beds); add('bath', '卫生间', 'Banheiros', l.baths); add('car', '车位', 'Vagas', l.parking); break;
      case 'terreno':
        add('area', '占地面积', 'Área do terreno', l.area, ' m²'); add('map', '分区', 'Zoneamento', l.zoning); break;
      case 'galpao':
        add('area', '土地面积', 'Terreno', l.area, ' m²'); add('dock', '建筑面积', 'Área construída', l.builtArea, ' m²');
        add('ruler', '主仓库', 'Galpão principal', l.mainArea, ' m²'); add('height', '层高', 'Pé-direito', l.height, ' m'); add('car', '卸货口', 'Docas', l.docks); break;
      case 'comercial':
        add('area', '面积', 'Área', l.area, ' m²'); add('ruler', '门面宽', 'Frente', l.frontage, ' m');
        if (l.mezzanine) add('dock', '夹层', 'Mezanino', pt ? 'Sim' : '有'); break;
      case 'fazenda':
        add('area', '总面积', 'Área total', l.hectares, ' ha'); add('leaf', '已开垦', 'Área aberta', l.cultivated, ' ha'); add('pin', '位置', 'Local', l.location); break;
    }
    return out;
  };
  MH.specText = (l, n) => MH.specs(l).slice(0, n || 3).map((s) => (/m²|ha$| m$/.test(s.value) || l.type === 'fazenda' ? s.value : s.value + ' ' + s.label)).join(' · ');
  MH.specLine = (l) => MH.specs(l).slice(0, 4).map((s) => `<span>${MH.icon(s.icon)}${MH.esc(s.value)}</span>`).join('');

  /* ---------- 房源卡片 ---------- */
  MH.card = (l, opt) => {
    const t = MH.type(l.type), r = MH.region(l.region), st = l.status !== 'ativo' ? MH.status(l.status) : null;
    const img = (l.images && l.images[0]) || '';
    return `<a class="card ${opt && opt.compact ? 'card--compact' : ''} reveal" href="listing.html?cod=${encodeURIComponent(l.cod)}">
      <div class="card__img">
        <img src="${MH.esc(img)}" alt="${MH.esc(MH.title(l))}" loading="lazy">
        <span class="tag" style="--tc:${t.color}">${MH.name(t)} · ${MH.name(MH.deal(l.deal))}</span>
        ${st ? `<span class="badge badge--${l.status}">${MH.name(st)}</span>` : ''}
        ${l.video ? `<span class="card__play">${MH.icon('play')}</span>` : ''}
      </div>
      <div class="card__body">
        <div class="card__meta">${MH.icon('pin')}${MH.esc(MH.name(r))}</div>
        <h3 class="card__title">${MH.esc(MH.title(l))}</h3>
        <div class="card__specs">${MH.specLine(l)}</div>
        <div class="card__foot"><span class="cod">Cod ${MH.esc(l.cod)}</span><span class="card__ask">${MH.t('price.ask')}</span></div>
      </div>
    </a>`;
  };

  /* ---------- 联系方式 ---------- */
  MH.waLink = (l) => {
    const msg = l ? `${MH.t('wa.hello')}：${MH.title(l)}（Cod ${l.cod}）\n${location.origin}${location.pathname.replace(/[^/]*$/, '')}listing.html?cod=${encodeURIComponent(l.cod)}` : MH.t('wa.hello');
    return `https://wa.me/${MH.CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  };
  MH.copy = async (text, btn) => {
    try { await navigator.clipboard.writeText(text); } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (_) {} ta.remove();
    }
    if (btn) { const o = btn.innerHTML; btn.innerHTML = MH.t('btn.copied'); btn.classList.add('is-done'); setTimeout(() => { btn.innerHTML = o; btn.classList.remove('is-done'); }, 1400); }
  };
  MH.toast = (msg) => {
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 1800);
  };

  MH.openContact = (l) => {
    const C = MH.CONFIG;
    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.innerHTML = `<div class="sheet__panel" role="dialog" aria-modal="true" aria-label="${MH.t('nav.contact')}">
      <button class="sheet__x" aria-label="close">${MH.icon('close')}</button>
      <div class="sheet__head"><div class="avatar">丸</div><div><strong>${C.agent} · ${C.brand} ${C.brandSub}</strong><small>${C.creci}</small></div></div>
      ${l ? `<p class="sheet__ref">${MH.esc(MH.title(l))}<br><span class="cod">Cod ${MH.esc(l.cod)}</span></p>` : ''}
      <div class="sheet__row"><span class="sheet__ic wechat">${MH.icon('wechat')}</span><div><small>WeChat</small><strong>${MH.esc(C.wechat)}</strong></div><button class="btn btn--sm" data-copy="${MH.esc(C.wechat)}">${MH.t('btn.copy')}</button></div>
      <div class="sheet__qr" aria-label="WeChat QR">${MH.icon('wechat')}<span>${lang === 'pt' ? 'QR code do WeChat (adicionar)' : '微信二维码（待放入）'}</span></div>
      <a class="btn btn--wa btn--block" href="${MH.waLink(l)}" target="_blank" rel="noopener">${MH.icon('whatsapp')} WhatsApp ${MH.esc(C.whatsappLabel)}</a>
      <p class="sheet__dy">${MH.icon('note')} 抖音 ${MH.esc(C.douyin)}</p>
    </div>`;
    document.body.appendChild(sheet);
    requestAnimationFrame(() => sheet.classList.add('open'));
    const close = () => { sheet.classList.remove('open'); setTimeout(() => sheet.remove(), 250); };
    sheet.addEventListener('click', (e) => { if (e.target === sheet || e.target.closest('.sheet__x')) close(); });
    sheet.querySelector('[data-copy]').addEventListener('click', (e) => MH.copy(e.currentTarget.dataset.copy, e.currentTarget));
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
  };

  /* ---------- 页头 / 页脚 / 手机底栏 ---------- */
  MH.logo = () => `<a class="logo" href="index.html" aria-label="My House Imobiliária">
      <span class="logo__mark">MY<br>HOUSE</span>
      <span class="logo__txt"><b>My House</b><small>Imobiliária · 丸子</small></span></a>`;

  MH.renderChrome = (opts) => {
    const o = opts || {};
    const header = document.createElement('header');
    header.className = 'site-header' + (o.overlay ? ' site-header--overlay' : '');
    header.innerHTML = `<div class="wrap site-header__in">
      ${MH.logo()}
      <nav class="nav">
        <a href="list.html">${MH.t('nav.listings')}</a>
        <a href="index.html#map">${MH.t('nav.map')}</a>
        <a href="index.html#about">${MH.t('nav.about')}</a>
      </nav>
      <div class="site-header__act">
        <button class="lang" aria-label="language"><span class="${lang === 'zh' ? 'on' : ''}">中</span><span class="${lang === 'pt' ? 'on' : ''}">PT</span></button>
        <button class="btn btn--ink btn--sm hide-sm" data-contact>${MH.t('nav.contact')}</button>
      </div></div>`;
    document.body.prepend(header);
    header.querySelector('.lang').addEventListener('click', () => MH.setLang(lang === 'zh' ? 'pt' : 'zh'));
    if (o.overlay) {
      const on = () => header.classList.toggle('is-solid', window.scrollY > 40);
      window.addEventListener('scroll', on, { passive: true }); on();
    }

    const C = MH.CONFIG;
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `<div class="wrap site-footer__in">
      <div>${MH.logo()}<p class="muted">${C.creci}<br>${C.city}</p></div>
      <div class="site-footer__links">
        <a href="list.html">${MH.t('nav.listings')}</a>
        <a href="index.html#map">${MH.t('nav.map')}</a>
        <a href="index.html#about">${MH.t('nav.about')}</a>
        <a href="#" data-contact>${MH.t('nav.contact')}</a>
      </div>
      <div class="site-footer__social">
        <span>${MH.icon('note')} 抖音 ${C.douyin}</span>
        <span>${MH.icon('wechat')} WeChat</span>
        <span>${MH.icon('whatsapp')} ${C.whatsappLabel}</span>
      </div></div>
      <div class="wrap site-footer__base"><span>${MH.t('footer.legal')}</span><span>© 2026 My House Imobiliária · <a href="admin.html">${MH.t('footer.admin')}</a></span></div>`;
    document.body.appendChild(footer);

    if (!o.noDock) {
      const dock = document.createElement('div');
      dock.className = 'dock';
      dock.innerHTML = `<button class="btn btn--wechat" data-contact>${MH.icon('wechat')} ${MH.t('btn.wechat')}</button>
        <a class="btn btn--wa" href="${MH.waLink(o.listing)}" target="_blank" rel="noopener">${MH.icon('whatsapp')} ${o.listing ? (lang === 'pt' ? 'Consultar' : '询价') : 'WhatsApp'}</a>`;
      document.body.appendChild(dock);
      document.body.classList.add('has-dock');
    }
    document.addEventListener('click', (e) => { const b = e.target.closest('[data-contact]'); if (b) { e.preventDefault(); MH.openContact(o.listing || null); } });
  };

  /* ---------- 动效 ---------- */
  MH.reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let io = null;
  MH.reveal = (root) => {
    const els = (root || document).querySelectorAll('.reveal:not(.in)');
    if (MH.reduced() || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    io = io || new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e, i) => { e.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms'; io.observe(e); });
  };
  MH.countUp = (el, to) => {
    if (MH.reduced()) { el.textContent = to; return; }
    const t0 = performance.now(), d = 1100;
    const step = (t) => { const p = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };

  /* 图片加载失败时显示占位（预览用外链图偶尔会失效） */
  const PH = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#E9E1D5"/><path d="M150 170v-40l50-30 50 30v40z" fill="none" stroke="#B9AD9C" stroke-width="6" stroke-linejoin="round"/><rect x="185" y="140" width="30" height="30" fill="none" stroke="#B9AD9C" stroke-width="6"/></svg>');
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG' && !t.dataset.ph) { t.dataset.ph = '1'; t.src = PH; }
  }, true);
})();
