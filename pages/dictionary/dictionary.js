const TERMS = [
  {
    term: "缝份",
    symbol: "┄",
    visual: "seam",
    visualCaption: "布边到缝线之间的距离，就是预留的缝份。",
    keywords: "缝头 缝边 seam allowance",
    definition: "裁片边缘到实际缝线之间预留的布宽。缝好后这部分通常藏在衣物里面；裁剪时要确认纸样是否已经包含缝份。"
  },
  {
    term: "直丝",
    symbol: "∥",
    visual: "grain-vertical",
    visualCaption: "直丝线顺着布边方向摆放。",
    keywords: "经向 经纱 布边",
    definition: "与布边平行的布纹方向，通常较稳定、不易拉长。纸样上的直丝线一般要与布边平行摆放。"
  },
  {
    term: "横丝",
    symbol: "⊥",
    visual: "grain-horizontal",
    visualCaption: "横丝线与布边成直角。",
    keywords: "纬向 纬纱 横向布纹",
    definition: "与布边垂直的布纹方向。多数机织布在这个方向有少量弹性，裁片要按纸样标记对准。"
  },
  {
    term: "斜丝",
    symbol: "∠",
    visual: "grain-bias",
    visualCaption: "斜丝方向通常与布边约成45度。",
    keywords: "斜裁 45度 bias",
    definition: "斜着布纹裁剪的方向，通常指与直丝约成45度。布料更容易伸展，常用于包边或需要柔软弧度的部位。"
  },
  {
    term: "牵条",
    symbol: "—",
    visual: "tape",
    visualCaption: "窄牵条贴在边缘，帮助布料保持形状。",
    keywords: "牵带 贴边 稳定条",
    definition: "窄布条或专用带，用来加固、稳定容易变形的边缘或接缝。裁剪方向要看用途和教程要求，不一定都斜裁。"
  },
  {
    term: "归拔",
    symbol: "⌁",
    visual: "shaping",
    visualCaption: "局部熨缩或拉伸，让平面布料形成曲面。",
    keywords: "熨烫 塑形 缩放",
    definition: "用熨斗和蒸汽把布料局部熨缩或拉伸，让平面的裁片贴合身体曲线。常用于西装等立体裁剪，不是简单压平。"
  },
  {
    term: "牙口",
    symbol: "∨",
    visual: "notch",
    visualCaption: "边缘小剪口是纸样的定位记号。",
    keywords: "剪口 剪口标记 缺口",
    definition: "纸样边缘的小缺口标记，用来提示接缝位置或布纹方向。剪口只剪进缝份内，不能剪过缝线。"
  },
  {
    term: "对位点",
    symbol: "+",
    visual: "match",
    visualCaption: "缝合时让两层布上的标记对齐。",
    keywords: "定位点 合印 对齐标记",
    definition: "纸样上标出的对应位置。缝合时让两片布的对位点相遇，帮助接缝长度和部位对齐。"
  },
  {
    term: "锁边",
    symbol: "≋",
    visual: "overcast",
    visualCaption: "线迹包住单层布边，减少脱散。",
    keywords: "包边 防脱散 布边处理",
    definition: "用线迹包住布料毛边，防止纱线脱散；可用锁边机，也可用家用机的锁边线迹。"
  },
  {
    term: "包缝",
    symbol: "⌑",
    visual: "overlock",
    visualCaption: "包缝机处理两层布边，也可同时连接布片。",
    keywords: "拷边 四线  overlock",
    definition: "常指用包缝机同时修整并包住布边，有些做法还能顺便连接两片布。不同教程可能把“包缝”和“锁边”混着叫。"
  }
];

Page({
  data: {
    query: "",
    expandedTerm: "",
    terms: TERMS
  },

  searchTerms(event) {
    const query = String(event.detail.value || "").trim().toLowerCase();
    const terms = query
      ? TERMS.filter((item) => `${item.term} ${item.keywords} ${item.definition}`.toLowerCase().includes(query))
      : TERMS;
    this.setData({ query: event.detail.value || "", terms, expandedTerm: "" });
  },

  clearSearch() {
    this.setData({ query: "", terms: TERMS, expandedTerm: "" });
  },

  toggleTerm(event) {
    const term = event.currentTarget.dataset.term;
    this.setData({ expandedTerm: this.data.expandedTerm === term ? "" : term });
  }
});
