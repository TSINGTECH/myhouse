/* 站点配置 + 区域 + 类型 + 示例房源（种子数据）
   正式上线后这些会来自数据库；这里集中放，方便替换。 */
window.MH = window.MH || {};

MH.CONFIG = {
  brand: 'My House',
  brandSub: 'Imobiliária',
  agent: '丸子',
  agentPt: 'Wanzi',
  creci: 'CRECI PJ 444841',
  // TODO：以下联系方式请替换为真实信息
  whatsapp: '5511900000000',
  whatsappLabel: '+55 11 9 0000-0000',
  wechat: '待填写微信号',
  douyin: '589705812',
  instagram: '',
  email: '',
  city: 'São Paulo · SP'
};

/* 区域：x/y 是插画地图上的坐标（画布 1200×760，示意位置）；geo 是实景地图用的区域中心点 [经度, 纬度]，不是具体房源地址 */
MH.REGIONS = [
  { id: 'santana',   zh: 'Santana',          pt: 'Santana',           sub: '北区成熟生活区',       x: 600,  y: 120, geo: [-46.6250, -23.5020], desc: '北区老牌住宅区，生活配套成熟，大户型和顶层复式较多。' },
  { id: 'guarulhos', zh: 'Guarulhos',        pt: 'Guarulhos',         sub: '机场 · 仓储物流',      x: 1040, y: 130, geo: [-46.5050, -23.4600], desc: '紧邻国际机场和多条高速，大型仓库、物流园区集中。' },
  { id: 'bomretiro', zh: 'Bom Retiro',       pt: 'Bom Retiro',        sub: '服装批发商圈',         x: 515,  y: 285, geo: [-46.6400, -23.5270], desc: '华人和韩国商家聚集的服装批发区，店面、楼上仓库需求旺。' },
  { id: 'bras',      zh: 'Brás',             pt: 'Brás',              sub: '批发商圈',             x: 740,  y: 320, geo: [-46.6165, -23.5440], desc: '圣保罗最大的批发商圈之一，人流大，店面转手快。' },
  { id: 'centro',    zh: '25 de Março',      pt: '25 de Março',       sub: '市中心商圈',           x: 585,  y: 395, geo: [-46.6315, -23.5425], desc: '市中心传统商业街，小商品批发与零售集中。' },
  { id: 'mooca',     zh: 'Mooca',            pt: 'Mooca',             sub: '新盘多 · 地皮',        x: 830,  y: 450, geo: [-46.5990, -23.5585], desc: '传统意大利社区，近年新楼盘多，也有不少可开发的地皮。紧邻 Brás。' },
  { id: 'cambuci',   zh: 'Cambuci',          pt: 'Cambuci / Aclimação', sub: '近 Aclimação 公园',  x: 655,  y: 525, geo: [-46.6235, -23.5700], desc: '靠近 Aclimação 公园，生活便利，适合家庭居住。' },
  { id: 'vilaclementino', zh: 'Vila Clementino', pt: 'Vila Clementino', sub: '中高端住宅区',   x: 470,  y: 625, geo: [-46.6430, -23.5985], desc: '中高端住宅区，近 Vila Mariana 和地铁，学校、医院资源好。' },
  { id: 'ipiranga',  zh: 'Ipiranga',         pt: 'Ipiranga',          sub: '近地铁 · 新楼盘',      x: 805,  y: 630, geo: [-46.6085, -23.5880], desc: '历史街区，地铁沿线新楼盘多，性价比较高。' },
  { id: 'fora',      zh: '州外 / 农场',       pt: 'Interior / Fazendas', sub: '大宗土地 · 农场',     x: 1065, y: 640, geo: null, desc: '圣保罗州外的农场、大宗土地与投资类物业。', outside: true }
];

MH.TYPES = [
  { id: 'residencial', zh: '住宅',      pt: 'Residencial', color: '#6F7F68' },
  { id: 'comercial',   zh: '店面 / 商业', pt: 'Comercial',  color: '#B4633A' },
  { id: 'galpao',      zh: '仓库',      pt: 'Galpão',      color: '#55616E' },
  { id: 'terreno',     zh: '地皮',      pt: 'Terreno',     color: '#A07F45' },
  { id: 'fazenda',     zh: '农场',      pt: 'Fazenda',     color: '#6E7A35' }
];

MH.DEALS = [
  { id: 'venda',   zh: '出售', pt: 'Venda' },
  { id: 'locacao', zh: '出租', pt: 'Locação' }
];

MH.STATUS = [
  { id: 'ativo',     zh: '在推',   pt: 'Disponível' },
  { id: 'reservado', zh: '洽谈中', pt: 'Em negociação' },
  { id: 'fechado',   zh: '已成交', pt: 'Negócio fechado' },
  { id: 'oculto',    zh: '已下架', pt: 'Oculto' }
];

/* 预览用图片（来自 Unsplash 的示例照片，已存到 assets/img/demo；正式版由她在后台上传） */
(function () {
  const u = (id) => `assets/img/demo/${id}.jpg`;
  MH.IMG = {
    living:  [u('1600607687939-ce8a6c25118c'), u('1502672260266-1c1ef2d93688'), u('1554995207-c18c203602cb'), u('1560448204-e02f11c3d0e2'), u('1522708323590-d24dbb6b0267'), u('1586023492125-27b2c045efd7')],
    kitchen: [u('1600566753190-17f0baa2a6c3'), u('1484154218962-a197022b5858')],
    bedroom: [u('1505693416388-ac5ce068fe85'), u('1493809842364-78817add7ffb')],
    building:[u('1545324418-cc1a3fa10c00'), u('1460317442991-0ec209397118')],
    house:   [u('1600596542815-ffad4c1539a9'), u('1600585154340-be6161a56a0c')],
    galpao:  [u('1586528116311-ad8dd3c8310d'), u('1553413077-190dd305871c')],
    terreno: [u('1500382017468-9049fed747ef'), u('1501785888041-af3ef285b470')],
    fazenda: [u('1464226184884-fa280b87c399'), u('1500382017468-9049fed747ef')],
    loja:    [u('1441986300917-64674bd600d8'), u('1555529669-e69e7aa0ba9a')]
  };
})();

/* 示例房源：住宅、地皮、仓库、农场参考她抖音上发过的内容；店面为演示数据 */
MH.SEED = (function () {
  const I = MH.IMG;
  return [
    { cod: '11112026Rs', type: 'residencial', deal: 'venda', region: 'mooca', status: 'ativo', featured: true,
      title: 'Mooca 三套房大户型，泳池全配套小区', area: 125, suites: 3, beds: 3, baths: 5, parking: 2,
      highlights: ['保姆房', '储藏室', '泳池', '健身房', '24小时门卫'],
      desc: '125㎡，3 间套房、5 个卫生间，另有保姆房、2 个车位和储藏室。小区配套齐全：泳池、健身房、运动场、烧烤区、宴会厅、桑拿、游戏室和儿童游乐区，24 小时门卫。',
      images: [I.living[0], I.kitchen[0], I.bedroom[0], I.building[0]], video: '', createdAt: '2026-11-11' },

    { cod: '22102026Rs', type: 'residencial', deal: 'venda', region: 'ipiranga', status: 'ativo', featured: false,
      title: 'Ipiranga 高楼层精装两套房，步行到地铁', area: 106, suites: 2, beds: 2, baths: 3, parking: 2,
      highlights: ['高楼层', '精致装修', '开放式厨房', '步行到地铁'],
      desc: '106㎡，2 间套房、3 个卫生间，精致设计风格，高楼层视野好，2 个车位，步行可达地铁站。',
      images: [I.living[1], I.kitchen[1], I.bedroom[1]], video: '', createdAt: '2026-10-22' },

    { cod: '23102026Rs', type: 'residencial', deal: 'venda', region: 'ipiranga', status: 'ativo', featured: true,
      title: 'Ipiranga 128㎡ 三套房，高楼层精装', area: 128, suites: 3, beds: 3, baths: 5, parking: 2,
      highlights: ['高楼层', '精装修', '开放式厨房', '步行到地铁'],
      desc: '128㎡，3 间套房、5 个卫生间，高楼层，精致装修设计，2 个车位，步行可达地铁站。',
      images: [I.living[2], I.kitchen[0], I.bedroom[0]], video: '', createdAt: '2026-10-23' },

    { cod: '20102026Rs', type: 'residencial', deal: 'venda', region: 'vilaclementino', status: 'ativo', featured: true,
      title: 'Vila Clementino 一梯一户 165㎡', area: 165, suites: 3, beds: 3, baths: 4, parking: 2,
      highlights: ['一梯一户', '24小时安保', '近地铁', '近 Bandeirantes 学校'],
      desc: '属中高端住宅区。165㎡，3 间套房，2 个车位，一梯一户，设施配套齐全，24 小时安保。靠近 Vila Mariana，步行可达地铁站，近 Bandeirantes 学校。',
      images: [I.living[3], I.bedroom[1], I.building[1]], video: '', createdAt: '2026-10-20' },

    { cod: '18102026Rs', type: 'residencial', deal: 'venda', region: 'mooca', status: 'reservado', featured: false,
      title: 'Mooca 86㎡ 温馨两居，阳台带烤肉区', area: 86, suites: 1, beds: 2, baths: 2, parking: 2,
      highlights: ['阳台烤肉区', '独立产权车位', '近 Juventus-Mooca 火车站'],
      desc: '86㎡，2 间卧室（其中 1 间套房），2 个卫生间。阳台带烤肉区，2 个车位，其中 1 个为独立产权固定车位。小区设施齐全，靠近 Juventus-Mooca 火车站，出行便利。',
      images: [I.living[4], I.kitchen[1], I.bedroom[0]], video: '', createdAt: '2026-10-18' },

    { cod: '05112026Rs', type: 'residencial', deal: 'venda', region: 'cambuci', status: 'ativo', featured: false,
      title: 'Cambuci 85㎡ 精装三居，近 Aclimação 公园', area: 85, suites: 1, beds: 3, baths: 2, parking: 2,
      highlights: ['精装修', '近 Aclimação 公园', '适合家庭'],
      desc: '85㎡ 精装三居室，3 间卧室，其中 1 间套房，2 个车位。靠近 Aclimação 公园，散步、遛娃、运动都方便。空间不会太大难打理，一家人住又足够舒服。',
      images: [I.living[5], I.bedroom[1], I.kitchen[0]], video: '', createdAt: '2026-11-05' },

    { cod: '06112026Rs', type: 'residencial', deal: 'venda', region: 'cambuci', status: 'ativo', featured: false,
      title: 'Grand Terrace Aclimação 110㎡ 家庭户型', area: 110, suites: 1, beds: 3, baths: 3, parking: 2,
      highlights: ['美食阳台', '空调', '独立储物间'],
      desc: '110㎡，3 间卧室、1 间套房、3 个卫生间、2 个车位。客厅连接美食阳台，带空调和独立储物空间。Aclimação / Cambuci 生活圈，购物餐饮方便。',
      images: [I.living[0], I.kitchen[1], I.bedroom[1]], video: '', createdAt: '2026-11-06' },

    { cod: '08112026Rs', type: 'residencial', deal: 'venda', region: 'santana', status: 'ativo', featured: true,
      title: 'Santana 325㎡ 顶层复式', area: 325, suites: 4, beds: 4, baths: 7, parking: 6,
      highlights: ['顶层复式', '2019年建成', '6个车位'],
      desc: '325㎡ 顶层复式，4 间套房、7 个卫生间、6 个车位，2019 年建成。位于 Santana 成熟生活区，空间尺度大，居住舒适度高。',
      images: [I.house[0], I.living[2], I.bedroom[0], I.house[1]], video: '', createdAt: '2026-11-08' },

    { cod: '14102026J', type: 'galpao', deal: 'venda', region: 'guarulhos', status: 'ativo', featured: true,
      title: 'Guarulhos 机场北区大型仓库', area: 16428, builtArea: 7589, mainArea: 6501, height: null, docks: null,
      highlights: ['近国际机场', '大面积', '基础设施完善'],
      desc: '位于 Guarulhos 国际机场北区。土地总面积 16,428.45 m²，建筑总面积 7,588.69 m²，主仓库 6,501.32 m²。适合需要宽敞空间、完善基础设施和优越位置的企业。',
      images: [I.galpao[0], I.galpao[1]], video: '', createdAt: '2026-10-14' },

    { cod: '13102026J', type: 'fazenda', deal: 'venda', region: 'fora', status: 'ativo', featured: false,
      title: '马托格罗索州万公顷农场', hectares: 10240, cultivated: 5900, location: 'São José do Rio Claro / MT',
      highlights: ['已开垦 5,900 公顷', '棉花种植 1,600 公顷'],
      desc: '位于马托格罗索州 São José do Rio Claro。农场总面积 10,240 公顷，已开垦 5,900 公顷，当前棉花种植约 1,600 公顷，历史耕种面积约 4,300 公顷。',
      images: [I.fazenda[0], I.fazenda[1]], video: '', createdAt: '2026-10-13' },

    { cod: '07102026T', type: 'terreno', deal: 'venda', region: 'mooca', status: 'ativo', featured: false,
      title: 'Mooca 2,130㎡ 地皮（ZC 分区）', area: 2130, zoning: 'ZC',
      highlights: ['ZC 分区', '可开发'],
      desc: 'Mooca 区地皮，占地面积 2,130 m²，分区属性 ZC。',
      images: [I.terreno[0]], video: '', createdAt: '2026-10-07' },

    { cod: '07102026J', type: 'terreno', deal: 'venda', region: 'mooca', status: 'ativo', featured: false,
      title: 'Mooca 1,150㎡ 地皮', area: 1150, zoning: '',
      highlights: ['可开发'],
      desc: 'Mooca 区地皮，占地面积 1,150 m²。',
      images: [I.terreno[1]], video: '', createdAt: '2026-10-07' },

    { cod: '01102026Rs', type: 'terreno', deal: 'venda', region: 'mooca', status: 'fechado', featured: false,
      title: 'Mooca 1,000㎡ 地皮', area: 1000, zoning: '',
      highlights: ['已成交'],
      desc: 'Mooca 区地皮，占地 1,000 m²。',
      images: [I.terreno[0]], video: '', createdAt: '2026-10-01' },

    { cod: 'DEMO01', type: 'comercial', deal: 'locacao', region: 'bras', status: 'ativo', featured: true,
      title: '（演示）Brás 临街店面，适合服装批发', area: 120, frontage: 8, mezzanine: true,
      highlights: ['临街 8m', '带夹层', '人流大'],
      desc: '演示数据：Brás 批发商圈临街店面，约 120㎡，门面宽 8 米，带夹层可做仓储。',
      images: [I.loja[0], I.loja[1]], video: '', createdAt: '2026-11-09' },

    { cod: 'DEMO02', type: 'comercial', deal: 'locacao', region: 'bomretiro', status: 'ativo', featured: false,
      title: '（演示）Bom Retiro 店面 + 楼上仓库', area: 80, frontage: 5, mezzanine: true,
      highlights: ['楼上仓库', '服装街'],
      desc: '演示数据：Bom Retiro 服装街店面，约 80㎡，楼上带仓库。',
      images: [I.loja[1], I.loja[0]], video: '', createdAt: '2026-11-10' },

    { cod: 'DEMO03', type: 'comercial', deal: 'venda', region: 'centro', status: 'ativo', featured: false,
      title: '（演示）25 de Março 商业楼层', area: 200, frontage: null, mezzanine: false,
      highlights: ['市中心', '可分租'],
      desc: '演示数据：25 de Março 商圈商业楼层，约 200㎡，可整层使用或分租。',
      images: [I.loja[0]], video: '', createdAt: '2026-11-10' }
  ];
})();
