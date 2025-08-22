/* === CONFIG: JP only, simple === */
window.KENSA_CONFIG = {
  // 📊 Google Sheets を「ウェブに公開」した CSV の URL
  // そのまま使えます。別シートにした場合は置き換えてください。
  csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQsSzDXVBFp9wZznTVpu6Lu8A3M0vk3gftkzMzZBAeIV77gKFTW_WtiTfDyBtuIIZinJ2TTKrHpg4Fi/pub?output=csv",

  // シートのヘッダー名に合わせてマッピング（大小文字無視）
  columns: {
    ship_date:   ["出荷日","日付","date"],
    customer:    ["顧客名","会社","メーカー","customer"],
    drawing_no:  ["図番","図面","drawing","図面番号"],
    product:     ["商品名","品目","item","部品名"],
    qty:         ["数量","個数","qty","数量(個)"],
    destination: ["送り先","送付先","納入先","destination"],
    note:        ["注意","注意点","指示","note"],
    remark:      ["備考","メモ","remark","備考欄"],
    status:      ["ステータス","状態","工程","status"]   // 例: Clear など
  },

  // ホーム画面の表に出す列（順番）
  display: [
    { key: "ship_date",  label: "出荷日" },
    { key: "customer",   label: "顧客名" },
    { key: "drawing_no", label: "図番" },
    { key: "product",    label: "商品名" },
    { key: "qty",        label: "数量" },
    { key: "destination",label: "送り先" },
    { key: "note",       label: "注意" },
    { key: "remark",     label: "備考" },
    { key: "status",     label: "ステータス" }
  ],

  // 直近 N 行のみ表示（下に新規が追記される前提）
  recentLimit: 50,

  // 🔐 フォームページ用の簡易パスワード（そのままでOK。変えるならここを編集）
  password: "kensa2025",

  // 📄 既存のフォームへのリンク（必要に応じて追加・削除）
  forms: [
    { name: "2825-20",  url: "https://wahyu0312-source.github.io/okuma46/" },
    { name: "2835-20",       url: "https://wahyu0312-source.github.io/mb56/" },
    { name: "330380V",     url: "https://wahyu0312-source.github.io/330380v/" },
    { name: "2823-20",      url: "https://wahyu0312-source.github.io/mb66v/" },
    { name: "330580V",     url: "https://wahyu0312-source.github.io/330580v/" }
  ]
};
