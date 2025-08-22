/* === CONFIG (SIMPLE) === */
window.KENSA_CONFIG = {
  // CSV publik dari Google Sheets (punyamu)
  csvUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRnouue0U6I91_wLiiRChdRzaQ_bTAicgk8ApzeTP0771weOiQQnKJ0Myizc-yXuLGI9rK2sdZRUGkL/pub?output=csv",

  // Kolom yang mungkin dipakai (otomatis cocokkan header; case-insensitive)
  columns: {
    timestamp: ["timestamp", "time", "日時"],
    lot_no: ["lot_no", "lot", "ロット", "会社", "メーカー", "顧客"],
    item_name: ["item_name", "item", "品目", "部品名"],
    status: ["status", "ステータス", "状態", "工程"],
    date: ["date", "検査日", "日付"],
    qty: ["qty", "数量", "個数"],
    inspector: ["inspector", "検査員", "担当"]
  },

  // Kolom yang tampil di tabel beranda (urut + label EN/JP)
  display: [
    { key: "timestamp", en: "Timestamp", jp: "タイムスタンプ" },
    { key: "lot_no",    en: "Lot",       jp: "ロット/顧客" },
    { key: "item_name", en: "Item",      jp: "品目" },
    { key: "status",    en: "Status",    jp: "状態" },
    { key: "date",      en: "Date",      jp: "日付" },
    { key: "qty",       en: "Qty",       jp: "数量" },
    { key: "inspector", en: "Inspector", jp: "検査員" }
  ],

  recentLimit: 50,          // jumlah baris terbaru ditampilkan
  password: "kensa2025",    // ⬅️ password sederhana

  // Link form kamu
  forms: [
    { code:"okuma46",  en:"OKUMA 46",  jp:"オークマ 46",  url:"https://wahyu0312-source.github.io/okuma46/" },
    { code:"mb56",     en:"MB 56",     jp:"MB 56",       url:"https://wahyu0312-source.github.io/mb56/" },
    { code:"330380v",  en:"330380V",   jp:"330380V",     url:"https://wahyu0312-source.github.io/330380v/" },
    { code:"mb66v",    en:"MB 66V",    jp:"MB 66V",      url:"https://wahyu0312-source.github.io/mb66v/" },
    { code:"330580v",  en:"330580V",   jp:"330580V",     url:"https://wahyu0312-source.github.io/330580v/" }
  ]
};
