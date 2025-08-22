/* i18n texts */
const I18N = {
  en: {
    nav_home: "Home",
    nav_forms: "Forms",
    hero_title: "Goods Flow Status",
    hero_sub: "Live summary from Google Sheets.",
    latest_title: "Latest Records",
    limit_label: "Show",
    limit_rows: "rows",
    forms_title: "Forms",
    forms_desc: "Enter the password to access the forms.",
    btn_unlock: "Unlock"
  },
  jp: {
    nav_home: "ホーム",
    nav_forms: "フォーム",
    hero_title: "工程ステータス",
    hero_sub: "Googleシートからの最新情報",
    latest_title: "最新データ",
    limit_label: "表示件数",
    limit_rows: "件",
    forms_title: "フォーム",
    forms_desc: "フォームにアクセスするにはパスワードを入力してください。",
    btn_unlock: "解除"
  }
};

const KensaApp = (() => {
  const cfg = window.KENSA_CONFIG;
  let currentLang = localStorage.getItem('kensa_lang') || 'en';
  const t = (k) => I18N[currentLang][k] || I18N.en[k] || k;

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('kensa_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    const thead = document.getElementById('thead-row');
    if (thead) renderHeader(thead);
    const list = document.getElementById('forms-list');
    if (list && !list.classList.contains('hidden')) renderFormsList();
  }

  /* simple CSV parser */
  function parseCSV(text) {
    const lines = text.replace(/\r\n/g,'\n').replace(/\r/g,'\n').split('\n').filter(x => x.trim() !== '');
    return lines.map(l => l.split(',').map(c => c.trim()));
  }
  function findColumnIndex(header, candidates) {
    const h = header.map(x => x.trim().toLowerCase());
    for (const name of candidates) {
      const idx = h.indexOf(String(name).toLowerCase());
      if (idx >= 0) return idx;
    }
    return -1;
  }
  function headerMap(header) {
    const out = {};
    for (const [key, cand] of Object.entries(cfg.columns)) out[key] = findColumnIndex(header, cand);
    return out;
  }
  function summarize(rows, map) {
    const idx = map.status;
    const counts = {};
    rows.forEach(r => {
      const k = idx >= 0 && idx < r.length ? (r[idx] || 'Unknown') : 'Unknown';
      counts[k] = (counts[k] || 0) + 1;
    });
    return counts;
  }
  function renderStatusCards(counts) {
    const wrap = document.getElementById('status-cards');
    if (!wrap) return;
    wrap.innerHTML = '';
    Object.entries(counts).sort((a,b)=> b[1]-a[1]).forEach(([k,v])=>{
      const d = document.createElement('div');
      d.className = 'card stat';
      d.innerHTML = `<div class="k">${k}</div><div class="v">${v}</div>`;
      wrap.appendChild(d);
    });
  }
  function renderHeader(thead) {
    thead.innerHTML = cfg.display.map(col => `<th>${col[currentLang] || col.en}</th>`).join('');
  }
  function renderTable(rows, map) {
    const thead = document.getElementById('thead-row');
    const tbody = document.getElementById('tbody');
    renderHeader(thead);
    tbody.innerHTML = '';
    const order = cfg.display.map(c => c.key);
    rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = order.map(key => {
        const idx = map[key];
        const val = (idx >= 0 && idx < r.length) ? r[idx] : '';
        return key === 'status' ? `<td><span class="badge">${val}</span></td>` : `<td>${val}</td>`;
      }).join('');
      tbody.appendChild(tr);
    });
  }
  async function initHome() {
    setLang(currentLang);
    const limitSel = document.getElementById('limit');
    if (limitSel) {
      limitSel.value = String(cfg.recentLimit || 50);
      limitSel.onchange = () => initHome();
    }
    try {
      const res = await fetch(cfg.csvUrl, { cache: 'no-store' });
      const text = await res.text();
      const arr = parseCSV(text);
      if (!arr.length) return;
      const header = arr[0];
      const rowsAll = arr.slice(1);
      const map = headerMap(header);
      renderStatusCards(summarize(rowsAll, map));
      const lim = Number((limitSel && limitSel.value) || cfg.recentLimit || 50);
      const rows = rowsAll.slice(-lim);
      renderTable(rows, map);
    } catch(e) { console.error('CSV load error', e); }
  }

  /* Password gate */
  async function sha256hex(s) {
    const enc = new TextEncoder().encode(s);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }
  function renderFormsList() {
    const list = document.getElementById('forms-list');
    if (!list) return;
    list.innerHTML = '';
    cfg.forms.forEach(f => {
      const card = document.createElement('div');
      card.className = 'link-card';
      const title = (currentLang === 'jp') ? f.jp : f.en;
      card.innerHTML = `<h3>${title}</h3><a class="btn" href="${f.url}" target="_blank">Open</a>`;
      list.appendChild(card);
    });
  }
  function initForms() {
    setLang(currentLang);
    document.getElementById('unlock').onclick = async () => {
      const v = document.getElementById('pwd').value;
      const hex = await sha256hex(v);
      const ok = (hex === cfg.passwordHash);
      const msg = document.getElementById('msg');
      if (!ok) { msg.textContent = 'Wrong password / パスワードが違います'; return; }
      sessionStorage.setItem('kensa_unlocked', '1');
      document.getElementById('lock').classList.add('hidden');
      document.getElementById('forms-list').classList.remove('hidden');
      renderFormsList();
    };
    if (sessionStorage.getItem('kensa_unlocked') === '1') {
      document.getElementById('lock').classList.add('hidden');
      document.getElementById('forms-list').classList.remove('hidden');
      renderFormsList();
    }
  }

  return { initHome, initForms, setLang };
})();
