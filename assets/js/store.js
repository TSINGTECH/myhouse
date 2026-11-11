/* 数据层（演示版）：种子数据 + 浏览器 IndexedDB。
   正式版把这里换成调用后端 API，页面代码不用改。 */
window.MH = window.MH || {};

MH.store = (function () {
  const DB = 'myhouse-demo', OS = 'kv', KEY = 'listings';
  let memory = null; // IndexedDB 不可用时的兜底

  function open() {
    return new Promise((resolve, reject) => {
      try {
        const req = indexedDB.open(DB, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(OS);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } catch (e) { reject(e); }
    });
  }
  async function get() {
    try {
      const db = await open();
      return await new Promise((resolve, reject) => {
        const r = db.transaction(OS).objectStore(OS).get(KEY);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
    } catch (e) { return memory; }
  }
  async function put(list) {
    memory = list;
    try {
      const db = await open();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(OS, 'readwrite');
        tx.objectStore(OS).put(list, KEY);
        tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
      });
    } catch (e) { console.warn('保存到本机失败，仅在本次打开期间有效', e); }
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));

  return {
    async all() {
      const saved = await get();
      return Array.isArray(saved) ? saved : clone(MH.SEED);
    },
    async publicList() {
      return (await this.all()).filter((l) => l.status !== 'oculto');
    },
    async byCod(cod) {
      const c = String(cod || '').trim().toLowerCase();
      return (await this.all()).find((l) => l.cod.toLowerCase() === c) || null;
    },
    async save(item, originalCod) {
      const list = await this.all();
      const idx = list.findIndex((l) => l.cod === (originalCod || item.cod));
      if (idx >= 0) list[idx] = item; else list.unshift(item);
      await put(list);
      return item;
    },
    async remove(cod) {
      const list = (await this.all()).filter((l) => l.cod !== cod);
      await put(list);
    },
    async reset() {
      memory = null;
      try {
        const db = await open();
        await new Promise((resolve) => {
          const tx = db.transaction(OS, 'readwrite');
          tx.objectStore(OS).delete(KEY);
          tx.oncomplete = resolve; tx.onerror = resolve;
        });
      } catch (e) {}
    }
  };
})();
