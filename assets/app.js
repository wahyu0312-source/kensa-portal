// ===== UI 文言（日本語のみ） =====
const JP = {
  nav_home: "ホーム",
  nav_forms: "フォーム",
  hero_title: "出荷・工程ステータス",
  hero_sub: "Google スプレッドシートの最新情報",
  latest_title: "最新データ",
  limit_label: "表示件数",
  limit_rows: "件",
  forms_title: "フォーム",
  forms_desc: "フォームにアクセスするにはパスワードを入力してください。",
  btn_unlock: "解除",
  wrong_pwd: "パスワードが違います"
};

const KensaApp = (() => {
  const cfg = window.KENSA_CONFIG;

  // ==== CSV パーサ（クォート対応の簡易版） ====
  function parseCSV(text){
    const rows=[], re=/\s*("(?:[^"]|"")*"|[^,]*)\s*(,|\n|$)/g;
    let m, row=[]; text=text.replace(/\r\n?/g,"\n");
    for (let i=0;i<text.length;){
      re.lastIndex=i; m=re.exec(text); if(!m) break;
      let cell=m[1]; if(cell.startsWith('"')) cell=cell.slice(1,-1).replace(/""/g,'"');
      row.push(cell); i=re.lastIndex;
      if(m[2]==="\n"||m[2]===""){ rows.push(row); row=[]; }
    }
    return rows.filter(r => r.length && r.join("").trim()!=="");
  }
  function findIdx(header, candidates){
    const h=header.map(x=>x.trim().toLowerCase());
    for(const n of candidates){ const i=h.indexOf(String(n).toLowerCase()); if(i>=0) return i; }
    return -1;
  }
  function mapHeader(header){
    const out={}; for(const [k,c] of Object.entries(cfg.columns)) out[k]=findIdx(header,c); return out;
  }

  // ==== ホーム（ダッシュボード） ====
  function renderHeader(){
    const tr=document.getElementById("thead-row");
    tr.innerHTML = cfg.display.map(c=>`<th>${c.label}</th>`).join("");
  }
  function renderRows(rows, map){
    const tb=document.getElementById("tbody"); if(!tb) return;
    tb.innerHTML="";
    const order=cfg.display.map(c=>c.key);
    rows.forEach(r=>{
      const tds=order.map(key=>{
        const idx=map[key]; const val=(idx>=0&&idx<r.length)?r[idx]:"";
        return key==="status" ? `<td><span class="badge">${val}</span></td>` : `<td>${val}</td>`;
      }).join("");
      tb.insertAdjacentHTML("beforeend", `<tr>${tds}</tr>`);
    });
  }
  function renderSummary(rows, map){
    const idx=map.status; if(idx<0) return;
    const cnt={}; rows.forEach(r=>{ const k=r[idx]||"Unknown"; cnt[k]=(cnt[k]||0)+1; });
    const wrap=document.getElementById("status-cards"); if(!wrap) return;
    wrap.innerHTML="";
    Object.entries(cnt).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>{
      wrap.insertAdjacentHTML("beforeend",
        `<div class="card stat"><div class="k">${k}</div><div class="v">${v}</div></div>`);
    });
  }
  async function initHome(){
    // 表示件数
    const sel=document.getElementById("limit");
    if (sel){ sel.value=String(cfg.recentLimit||50); sel.onchange=()=>initHome(); }

    try{
      // cache 回避（常に最新を取得）
      const bust=(cfg.csvUrl.includes("?")?"&":"?")+"t="+Date.now();
      const res=await fetch(cfg.csvUrl+bust,{cache:"no-store"});
      const text=await res.text();
      const arr=parseCSV(text); if(!arr.length) return;
      const header=arr[0], rowsAll=arr.slice(1);
      const map=mapHeader(header);
      renderSummary(rowsAll, map);
      renderHeader();
      const lim=Number((sel&&sel.value)||cfg.recentLimit||50);
      renderRows(rowsAll.slice(-lim), map);
    }catch(e){ console.error("CSV load error", e); }
  }

  // ==== フォーム（パスワード簡易方式） ====
  function renderForms(){
    const list=document.getElementById("forms-list"); list.innerHTML="";
    cfg.forms.forEach(f=>{
      list.insertAdjacentHTML("beforeend",
        `<div class="link-card"><h3>${f.name}</h3><a class="btn" href="${f.url}" target="_blank">開く</a></div>`);
    });
  }
  function initForms(){
    document.querySelector('[data-i18n="forms_title"]').textContent = JP.forms_title;
    document.querySelector('[data-i18n="forms_desc"]').textContent  = JP.forms_desc;
    document.querySelector('[data-i18n="btn_unlock"]').textContent  = JP.btn_unlock;

    document.getElementById("unlock").onclick = ()=>{
      const v=document.getElementById("pwd").value;
      if (v!==cfg.password){
        document.getElementById("msg").textContent = JP.wrong_pwd;
        return;
      }
      sessionStorage.setItem("kensa_unlocked","1");
      document.getElementById("lock").classList.add("hidden");
      document.getElementById("forms-list").classList.remove("hidden");
      renderForms();
    };

    if (sessionStorage.getItem("kensa_unlocked")==="1"){
      document.getElementById("lock").classList.add("hidden");
      document.getElementById("forms-list").classList.remove("hidden");
      renderForms();
    }
  }

  return { initHome, initForms };
})();
