/* 后台（演示版）：按区域管理、增改删、上传压缩图片、一键生成抖音/朋友圈/Instagram 文案 */
(async function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const E = MH.esc, I = MH.icon;
  let list = await MH.store.all();
  const F = { region: '', type: '', status: '', q: '' };

  $('#viewSite').innerHTML = I('eye') + ' 查看网站';
  $('#addBtn').innerHTML = I('plus') + ' 新增房源';
  $('#fType').innerHTML = '<option value="">全部类型</option>' + MH.TYPES.map((t) => `<option value="${t.id}">${t.zh}</option>`).join('');
  $('#fStatus').innerHTML = '<option value="">全部状态</option>' + MH.STATUS.map((s) => `<option value="${s.id}">${s.zh}</option>`).join('');

  // 二次点击确认（不依赖浏览器的 confirm 弹窗）
  MH.sure = (btn, msg) => {
    if (btn._armed) { clearTimeout(btn._armed); btn._armed = 0; return true; }
    MH.toast(msg + '，再点一次确认');
    btn._armed = setTimeout(() => (btn._armed = 0), 3500);
    return false;
  };

  /* ---------- 列表 ---------- */
  function render() {
    const nav = [{ id: '', zh: '全部房源' }].concat(MH.REGIONS);
    $('#regionNav').innerHTML = nav.map((r) => `<button data-r="${r.id}" class="${F.region === r.id ? 'on' : ''}">${E(r.zh)}<span>${list.filter((l) => !r.id || l.region === r.id).length}</span></button>`).join('');
    const scope = list.filter((l) => !F.region || l.region === F.region);
    $('#stats').innerHTML = MH.STATUS.map((s) => `<button class="a-stat ${F.status === s.id ? 'on' : ''}" data-s="${s.id}"><b>${scope.filter((l) => l.status === s.id).length}</b><span>${s.zh}</span></button>`).join('');

    const q = F.q.trim().toLowerCase();
    const rows = scope.filter((l) => (!F.type || l.type === F.type) && (!F.status || l.status === F.status) &&
      (!q || [l.cod, l.title, (l.highlights || []).join(' ')].join(' ').toLowerCase().includes(q)))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

    $('#list').innerHTML = rows.length ? rows.map((l) => {
      const t = MH.type(l.type);
      return `<div class="a-row" data-cod="${E(l.cod)}">
        <img src="${E((l.images || [])[0] || '')}" alt="" loading="lazy">
        <div class="a-row__t"><b>${E(l.title)}</b><small class="cod">Cod ${E(l.cod)} · ${E(l.createdAt || '')}</small></div>
        <div class="a-row__c a-type"><i style="background:${t.color}"></i>${t.zh} · ${MH.deal(l.deal).zh}</div>
        <div class="a-row__c a-reg">${I('pin')}${E(MH.region(l.region).zh)}</div>
        <div class="a-row__st"><select data-act="status" aria-label="状态">${MH.STATUS.map((s) => `<option value="${s.id}" ${s.id === l.status ? 'selected' : ''}>${s.zh}</option>`).join('')}</select></div>
        <div class="a-row__act">
          <button class="a-cap" data-act="cap">${I('text')} 文案</button>
          <button class="icon-btn star ${l.featured ? 'on' : ''}" data-act="star" title="首页精选">${I('star')}</button>
          <a class="icon-btn" href="listing.html?cod=${encodeURIComponent(l.cod)}" target="_blank" title="在网站上查看">${I('eye')}</a>
          <button class="icon-btn" data-act="edit" title="编辑">${I('edit')}</button>
          <button class="icon-btn danger" data-act="del" title="删除">${I('trash')}</button>
        </div></div>`;
    }).join('') : '<div class="a-empty">这里还没有房源，点"新增房源"添加第一套</div>';
  }
  const refresh = async () => { list = await MH.store.all(); render(); };

  $('#regionNav').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { F.region = b.dataset.r; render(); } });
  $('#stats').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { F.status = F.status === b.dataset.s ? '' : b.dataset.s; $('#fStatus').value = F.status; render(); } });
  $('#fType').onchange = (e) => { F.type = e.target.value; render(); };
  $('#fStatus').onchange = (e) => { F.status = e.target.value; render(); };
  $('#q').addEventListener('input', (e) => { F.q = e.target.value; render(); });
  $('#addBtn').onclick = () => openEditor(null);
  $('#resetBtn').onclick = async (e) => {
    if (!MH.sure(e.currentTarget, '将恢复成最初的示例房源')) return;
    await MH.store.reset(); await refresh(); MH.toast('已恢复示例数据');
  };

  $('#list').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]'); if (!b || b.tagName === 'SELECT') return;
    const cod = b.closest('.a-row').dataset.cod, l = list.find((x) => x.cod === cod);
    if (b.dataset.act === 'edit') openEditor(l);
    if (b.dataset.act === 'cap') openCaption(l);
    if (b.dataset.act === 'star') { l.featured = !l.featured; await MH.store.save(l); await refresh(); MH.toast(l.featured ? '已设为首页精选' : '已取消精选'); }
    if (b.dataset.act === 'del') {
      if (!MH.sure(b, '将删除这套房源')) return;
      await MH.store.remove(cod); await refresh(); MH.toast('已删除');
    }
  });
  $('#list').addEventListener('change', async (e) => {
    if (e.target.dataset.act !== 'status') return;
    const l = list.find((x) => x.cod === e.target.closest('.a-row').dataset.cod);
    l.status = e.target.value; await MH.store.save(l); await refresh(); MH.toast('状态已更新为：' + MH.status(l.status).zh);
  });

  /* ---------- 弹层通用 ---------- */
  const openModal = (id) => { const m = $('#' + id); m.hidden = false; document.body.style.overflow = 'hidden'; };
  const closeModal = (id) => { $('#' + id).hidden = true; document.body.style.overflow = ''; };
  document.querySelectorAll('[data-close]').forEach((b) => { if (!b.textContent.trim()) b.innerHTML = I('close'); b.addEventListener('click', () => closeModal(b.closest('.a-modal').id)); });
  document.querySelectorAll('.a-modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) closeModal(m.id); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.a-modal:not([hidden])').forEach((m) => closeModal(m.id)); });

  /* ---------- 编辑 ---------- */
  const SPEC = {
    residencial: [['area', '面积 m²'], ['suites', '套房'], ['beds', '卧室'], ['baths', '卫生间'], ['parking', '车位']],
    terreno: [['area', '占地面积 m²'], ['zoning', '分区 Zoneamento', 'text']],
    galpao: [['area', '土地面积 m²'], ['builtArea', '建筑面积 m²'], ['mainArea', '主仓库面积 m²'], ['height', '层高 Pé-direito（m）'], ['docks', '卸货口 Docas']],
    comercial: [['area', '面积 m²'], ['frontage', '门面宽（m）'], ['mezzanine', '带夹层', 'checkbox']],
    fazenda: [['hectares', '总面积（公顷）'], ['cultivated', '已开垦（公顷）'], ['location', '位置（市 / 州）', 'text']]
  };
  const today = () => { const d = new Date(); return [d.getDate(), d.getMonth() + 1].map((n) => String(n).padStart(2, '0')).join('') + d.getFullYear(); };
  let draft = null, originalCod = null;

  function openEditor(l) {
    originalCod = l ? l.cod : null;
    draft = l ? JSON.parse(JSON.stringify(l)) : { cod: today(), type: 'residencial', deal: 'venda', region: F.region || 'mooca', status: 'ativo', featured: false, title: '', highlights: [], desc: '', images: [], video: '', createdAt: new Date().toISOString().slice(0, 10) };
    $('#edTitle').textContent = l ? '编辑房源' : '新增房源';
    $('#formErr').textContent = '';
    drawForm();
    openModal('editor');
    $('#edBody').scrollTop = 0;
  }

  const val = (k) => (draft[k] == null ? '' : draft[k]);
  function drawForm() {
    const d = draft;
    $('#edBody').innerHTML = `
      <section class="fs"><h3>基本信息</h3>
        <div class="f f--full"><span>类型 <em>*</em></span><div class="pick" data-pick="type">${MH.TYPES.map((t) => `<button type="button" data-v="${t.id}" class="${d.type === t.id ? 'on' : ''}"><i style="background:${t.color}"></i>${t.zh}</button>`).join('')}</div></div>
        <div class="fg" style="margin-top:14px">
          <label class="f"><span>交易</span><select name="deal">${MH.DEALS.map((x) => `<option value="${x.id}" ${d.deal === x.id ? 'selected' : ''}>${x.zh}</option>`).join('')}</select></label>
          <label class="f"><span>区域 <em>*</em></span><select name="region">${MH.REGIONS.map((x) => `<option value="${x.id}" ${d.region === x.id ? 'selected' : ''}>${E(x.zh)}</option>`).join('')}</select></label>
          <label class="f"><span>状态</span><select name="status">${MH.STATUS.map((x) => `<option value="${x.id}" ${d.status === x.id ? 'selected' : ''}>${x.zh}</option>`).join('')}</select></label>
          <label class="f" data-f="cod"><span>Cod 编号 <em>*</em></span><input type="text" name="cod" value="${E(d.cod)}" autocapitalize="off"><span class="hint">和抖音视频里的编号保持一致</span></label>
        </div>
        <div class="fg fg--2" style="margin-top:12px">
          <label class="f f--full" data-f="title"><span>标题 <em>*</em></span><input type="text" name="title" value="${E(d.title)}" placeholder="Mooca 三套房大户型，泳池全配套小区"></label>
          <label class="f f--full"><span>葡语标题（可选，不填会自动生成）</span><input type="text" name="titlePt" value="${E(val('titlePt'))}" placeholder="Apartamento 125 m² com lazer completo · Mooca"></label>
          <label class="f f-check"><input type="checkbox" name="featured" ${d.featured ? 'checked' : ''}> 放到首页精选</label>
        </div>
      </section>

      <section class="fs"><h3>照片与视频 <small>第一张是封面；照片会自动压缩</small></h3>
        <div class="photos" id="photos"></div>
        <label class="f" style="margin-top:14px"><span>视频链接（可选）</span><input type="url" name="video" value="${E(d.video || '')}" placeholder="mp4 视频地址，或抖音视频分享链接"><span class="hint">正式版可以直接上传视频文件</span></label>
      </section>

      <section class="fs"><h3>${MH.type(d.type).zh}规格</h3>
        <div class="fg">${SPEC[d.type].map(([k, label, kind]) => kind === 'checkbox'
          ? `<label class="f f-check"><input type="checkbox" name="${k}" ${d[k] ? 'checked' : ''}> ${label}</label>`
          : `<label class="f"><span>${label}</span><input type="${kind === 'text' ? 'text' : 'number'}" name="${k}" value="${E(val(k))}" ${kind === 'text' ? '' : 'min="0" step="any" inputmode="decimal"'}></label>`).join('')}</div>
      </section>

      <section class="fs"><h3>亮点与介绍</h3>
        <div class="fg fg--2">
          <label class="f f--full"><span>亮点标签（用逗号或顿号分隔）</span><input type="text" name="highlights" value="${E((d.highlights || []).join('、'))}" placeholder="近地铁、高楼层、24小时门卫"></label>
          <label class="f f--full"><span>房源介绍</span><textarea name="desc" placeholder="面积、户型、小区配套、周边生活……">${E(d.desc)}</textarea></label>
          <label class="f f--full"><span>葡语介绍（可选）</span><textarea name="descPt" placeholder="Descrição em português">${E(val('descPt'))}</textarea></label>
        </div>
      </section>

      <section class="fs fs--private"><h3>${I('eye')} 内部信息 <small>只有你能看到，不会显示在网站上</small></h3>
        <div class="fg">
          <label class="f"><span>价格 R$</span><input type="number" name="price" value="${E(val('price'))}" min="0" inputmode="numeric"></label>
          <label class="f"><span>Condomínio R$/月</span><input type="number" name="condo" value="${E(val('condo'))}" min="0" step="any"></label>
          <label class="f"><span>IPTU R$/月</span><input type="number" name="iptu" value="${E(val('iptu'))}" min="0" step="any"></label>
          <label class="f"><span>房东 / 联系人</span><input type="text" name="owner" value="${E(val('owner'))}"></label>
          <label class="f f--full"><span>备注（钥匙、看房时间、佣金等）</span><textarea name="notes" style="min-height:80px">${E(val('notes'))}</textarea></label>
        </div>
      </section>`;
    drawPhotos();
    $('[data-pick="type"]').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      collect(); draft.type = b.dataset.v; drawForm();
    });
  }

  function drawPhotos() {
    const imgs = draft.images || [];
    $('#photos').innerHTML = imgs.map((src, i) => `<div class="photo">
        <img src="${E(src)}" alt="">${i === 0 ? '<span class="photo__cover">封面</span>' : ''}
        <div class="photo__ops">
          <button type="button" data-ph="left" data-i="${i}" title="往前移">${I('back')}</button>
          <button type="button" data-ph="del" data-i="${i}" title="删除">${I('trash')}</button>
          <button type="button" data-ph="right" data-i="${i}" title="往后移">${I('arrow')}</button>
        </div></div>`).join('') +
      `<label class="upload" id="upl">${I('image')}<span>上传照片<br>可多选 / 拖进来</span><input type="file" accept="image/*" multiple></label>`;
    $('#photos').onclick = (e) => {
      const b = e.target.closest('[data-ph]'); if (!b) return;
      const i = +b.dataset.i, a = draft.images;
      if (b.dataset.ph === 'del') a.splice(i, 1);
      if (b.dataset.ph === 'left' && i > 0) [a[i - 1], a[i]] = [a[i], a[i - 1]];
      if (b.dataset.ph === 'right' && i < a.length - 1) [a[i + 1], a[i]] = [a[i], a[i + 1]];
      drawPhotos();
    };
    $('#upl input').onchange = (e) => addFiles(e.target.files);
    const box = $('#photos');
    box.ondragover = (e) => { e.preventDefault(); box.classList.add('drop'); };
    box.ondragleave = () => box.classList.remove('drop');
    box.ondrop = (e) => { e.preventDefault(); box.classList.remove('drop'); addFiles(e.dataTransfer.files); };
  }

  // 压缩：长边 1600px，JPEG 0.8
  function compress(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => {
        const max = 1600, k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('无法读取图片')); };
      img.src = url;
    });
  }
  async function addFiles(files) {
    const arr = [...files].filter((f) => f.type.startsWith('image/'));
    if (!arr.length) return;
    $('#upl span').textContent = `处理中 0/${arr.length}`;
    let done = 0;
    for (const f of arr) {
      try { draft.images.push(await compress(f)); } catch (e) { MH.toast(`${f.name} 读取失败`); }
      done++; const s = $('#upl span'); if (s) s.textContent = `处理中 ${done}/${arr.length}`;
    }
    drawPhotos();
  }

  function collect() {
    const fd = $('#form');
    const g = (n) => fd.elements[n];
    ['deal', 'region', 'status'].forEach((k) => (draft[k] = g(k).value));
    draft.cod = g('cod').value.trim();
    draft.title = g('title').value.trim();
    draft.titlePt = g('titlePt').value.trim();
    draft.featured = g('featured').checked;
    draft.video = g('video').value.trim();
    draft.highlights = g('highlights').value.split(/[,，、;；\n]/).map((s) => s.trim()).filter(Boolean);
    draft.desc = g('desc').value.trim();
    draft.descPt = g('descPt').value.trim();
    SPEC[draft.type].forEach(([k, , kind]) => {
      const el = g(k); if (!el) return;
      draft[k] = kind === 'checkbox' ? el.checked : kind === 'text' ? el.value.trim() : (el.value === '' ? null : Number(el.value));
    });
    ['price', 'condo', 'iptu'].forEach((k) => (draft[k] = g(k).value === '' ? null : Number(g(k).value)));
    draft.owner = g('owner').value.trim();
    draft.notes = g('notes').value.trim();
  }

  function fieldError(name, msg) {
    const wrap = $(`[data-f="${name}"]`); if (!wrap) return;
    wrap.classList.add('invalid');
    let e = $('.ferr', wrap); if (!e) { e = document.createElement('span'); e.className = 'ferr'; wrap.appendChild(e); }
    e.textContent = msg;
    const inp = $('input', wrap);
    inp.addEventListener('input', () => { wrap.classList.remove('invalid'); e.remove(); $('#formErr').textContent = ''; }, { once: true });
  }

  $('#form').addEventListener('submit', async (e) => {
    e.preventDefault();
    collect();
    let bad = null;
    if (!draft.cod) { fieldError('cod', '请填写 Cod 编号'); bad = bad || 'cod'; }
    else if (!/^[\w-]+$/.test(draft.cod)) { fieldError('cod', '只能用字母、数字、横线'); bad = bad || 'cod'; }
    else if (list.some((l) => l.cod.toLowerCase() === draft.cod.toLowerCase() && l.cod !== originalCod)) { fieldError('cod', '这个编号已经有房源在用了'); bad = bad || 'cod'; }
    if (!draft.title) { fieldError('title', '请填写标题'); bad = bad || 'title'; }
    if (bad) { $('#formErr').textContent = '有内容需要修改'; $(`[name="${bad}"]`).focus(); return; }
    await MH.store.save(draft, originalCod);
    closeModal('editor');
    await refresh();
    MH.toast(originalCod ? '已保存' : '已新增，网站上马上能看到');
  });

  /* ---------- 文案生成 ---------- */
  const brl = (n) => 'R$ ' + Number(n).toLocaleString('pt-BR');
  const siteUrl = (l) => `${location.origin}${location.pathname.replace(/[^/]*$/, '')}listing.html?cod=${encodeURIComponent(l.cod)}`;
  function specZh(l) {
    const p = [], n = MH.num;
    if (l.type === 'residencial') { if (l.area) p.push(`${n(l.area)}㎡`); if (l.suites) p.push(`${l.suites}间套房`); else if (l.beds) p.push(`${l.beds}间卧室`); if (l.baths) p.push(`${l.baths}个卫生间`); if (l.parking) p.push(`${l.parking}个车位`); }
    if (l.type === 'terreno') { if (l.area) p.push(`占地面积：${n(l.area)}m²`); if (l.zoning) p.push(`分区：${l.zoning}`); }
    if (l.type === 'galpao') { if (l.area) p.push(`土地 ${n(l.area)}m²`); if (l.builtArea) p.push(`建筑 ${n(l.builtArea)}m²`); if (l.mainArea) p.push(`主仓库 ${n(l.mainArea)}m²`); if (l.height) p.push(`层高 ${l.height}m`); }
    if (l.type === 'comercial') { if (l.area) p.push(`${n(l.area)}㎡`); if (l.frontage) p.push(`门面 ${l.frontage}m`); if (l.mezzanine) p.push('带夹层'); }
    if (l.type === 'fazenda') { if (l.hectares) p.push(`总面积 ${n(l.hectares)} 公顷`); if (l.cultivated) p.push(`已开垦 ${n(l.cultivated)} 公顷`); }
    return p.join(' ｜ ');
  }
  function specPt(l) {
    const p = [], n = MH.num;
    if (l.area && l.type !== 'fazenda') p.push(`📐 ${n(l.area)} m²`);
    if (l.suites) p.push(`🛏️ ${l.suites} suítes`); else if (l.beds) p.push(`🛏️ ${l.beds} dorms`);
    if (l.baths) p.push(`🛁 ${l.baths} banheiros`);
    if (l.parking) p.push(`🚗 ${l.parking} vagas`);
    if (l.hectares) p.push(`🌾 ${n(l.hectares)} ha`);
    if (l.zoning) p.push(`Zoneamento ${l.zoning}`);
    return p.join(' | ');
  }
  const tag = (s) => '#' + String(s).replace(/[\s/·]+/g, '');
  function caption(l, kind, o) {
    const r = MH.region(l.region), t = MH.type(l.type);
    const where = r.id === 'fora' ? (l.location || '巴西') : `圣保罗${r.zh}区`;
    const hl = (l.highlights || []).join(' ｜ ');
    const fees = [l.condo ? `🏢 Condomínio：${brl(l.condo)}/月` : '', l.iptu ? `🏷️ IPTU：${brl(l.iptu)}/月` : ''].filter(Boolean).join('\n');
    const blocks = (...bs) => bs.map((b) => b.filter(Boolean).join('\n')).filter(Boolean).join('\n\n');
    if (kind === 'douyin') {
      return blocks(
        [`🇧🇷${where}${t.zh === '住宅' ? '房源' : t.zh}。${specZh(l)}`, hl],
        [l.desc],
        [o.price && l.price ? `💰参考：${brl(l.price)}` : '', o.fees ? fees : '', `📢【Cod：${l.cod}】🇧🇷`],
        [['#巴西房产', '#圣保罗房产', tag(r.pt), '#圣保罗生活', '#巴西生活'].join(' ')]
      );
    }
    if (kind === 'moments') {
      return [
        `【${t.zh} · ${r.zh}】${l.title}`,
        specZh(l),
        hl ? `✨ ${hl}` : '',
        o.price && l.price ? `💰 参考 ${brl(l.price)}` : '',
        o.fees ? fees : '',
        `Cod：${l.cod}`,
        o.link ? `👉 详情：${siteUrl(l)}` : '',
        '想看房、了解价格，私信丸子～'
      ].filter(Boolean).join('\n');
    }
    return blocks(
      [`🇧🇷 ${l.titlePt || `${t.pt} em ${r.pt}`}`, specPt(l)],
      [l.descPt || ''],
      [o.price && l.price ? `💰 ${brl(l.price)}` : '💰 Valor sob consulta',
        o.fees && l.condo ? `🏢 Condomínio ${brl(l.condo)}/mês` : '', o.fees && l.iptu ? `🏷️ IPTU ${brl(l.iptu)}/mês` : '',
        `📢 Cód: ${l.cod}`, `📲 WhatsApp ${MH.CONFIG.whatsappLabel}`, o.link ? `🔗 ${siteUrl(l)}` : ''],
      [['#imoveis', '#saopaulo', '#imobiliaria', tag(r.pt).toLowerCase(), '#' + t.pt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')].join(' ')]
    );
  }

  function openCaption(l) {
    const st = { kind: 'douyin', price: false, fees: false, link: true };
    const draw = () => {
      $('#capBody').innerHTML = `
        <p class="cap-note">按你平时在抖音的格式自动生成，可以直接改了再复制。<b>${E(l.title)}</b></p>
        <div class="pick cap-tabs">${[['douyin', '抖音'], ['moments', '朋友圈'], ['insta', 'Instagram（葡语）']].map(([k, n]) => `<button type="button" data-k="${k}" class="${st.kind === k ? 'on' : ''}">${n}</button>`).join('')}</div>
        <div class="cap-opts">
          <label><input type="checkbox" data-o="price" ${st.price ? 'checked' : ''}> 显示参考价</label>
          <label><input type="checkbox" data-o="fees" ${st.fees ? 'checked' : ''}> 显示物业费 / IPTU</label>
          <label><input type="checkbox" data-o="link" ${st.link ? 'checked' : ''}> 附网站链接</label>
        </div>
        ${(st.price && !l.price) ? '<p class="cap-note">这套房源还没填内部价格，可以在"编辑 → 内部信息"里补上。</p>' : ''}
        <textarea class="cap-out" id="capOut">${E(caption(l, st.kind, st))}</textarea>
        <div style="display:flex;gap:10px;justify-content:flex-end">
          <a class="btn" href="listing.html?cod=${encodeURIComponent(l.cod)}" target="_blank">${I('eye')} 看网站页面</a>
          <button class="btn btn--ink" id="capCopy">${I('copy')} 复制文案</button>
        </div>`;
      $('.cap-tabs', $('#capBody')).onclick = (e) => { const b = e.target.closest('button'); if (b) { st.kind = b.dataset.k; draw(); } };
      $('#capBody').querySelectorAll('[data-o]').forEach((c) => (c.onchange = () => { st[c.dataset.o] = c.checked; draw(); }));
      $('#capCopy').onclick = (e) => MH.copy($('#capOut').value, e.currentTarget);
    };
    draw();
    openModal('caption');
  }

  render();
})();
