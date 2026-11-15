const TERMS = [
  {
    term: "缝份",
    category: "纸样基础",
    symbol: "┄",
    visual: "seam",
    visualCaption: "布边到缝线之间的距离，就是预留的缝份。",
    keywords: "缝头 缝边 seam allowance",
    definition: "裁片边缘到实际缝线之间预留的布宽。缝好后这部分通常藏在衣物里面；裁剪时要确认纸样是否已经包含缝份。"
  },
  {
    term: "直丝",
    category: "纸样基础",
    symbol: "∥",
    visual: "grain-vertical",
    visualCaption: "直丝线顺着布边方向摆放。",
    keywords: "经向 经纱 布边",
    definition: "与布边平行的布纹方向，通常较稳定、不易拉长。纸样上的直丝线一般要与布边平行摆放。"
  },
  {
    term: "横丝",
    category: "纸样基础",
    symbol: "⊥",
    visual: "grain-horizontal",
    visualCaption: "横丝线与布边成直角。",
    keywords: "纬向 纬纱 横向布纹",
    definition: "与布边垂直的布纹方向。多数机织布在这个方向有少量弹性，裁片要按纸样标记对准。"
  },
  {
    term: "斜丝",
    category: "纸样基础",
    symbol: "∠",
    visual: "grain-bias",
    visualCaption: "斜丝方向通常与布边约成45度。",
    keywords: "斜裁 45度 bias",
    definition: "斜着布纹裁剪的方向，通常指与直丝约成45度。布料更容易伸展，常用于包边或需要柔软弧度的部位。"
  },
  {
    term: "牵条",
    category: "面料辅料",
    symbol: "—",
    visual: "tape",
    visualCaption: "窄牵条贴在边缘，帮助布料保持形状。",
    keywords: "牵带 贴边 稳定条",
    definition: "窄布条或专用带，用来加固、稳定容易变形的边缘或接缝。裁剪方向要看用途和教程要求，不一定都斜裁。"
  },
  {
    term: "归拔",
    category: "进阶技巧",
    symbol: "⌁",
    visual: "shaping",
    visualCaption: "局部熨缩或拉伸，让平面布料形成曲面。",
    keywords: "熨烫 塑形 缩放",
    definition: "用熨斗和蒸汽把布料局部熨缩或拉伸，让平面的裁片贴合身体曲线。常用于西装等立体裁剪，不是简单压平。"
  },
  {
    term: "牙口",
    category: "纸样基础",
    symbol: "∨",
    visual: "notch",
    visualCaption: "边缘小剪口是纸样的定位记号。",
    keywords: "剪口 剪口标记 缺口",
    definition: "纸样边缘的小缺口标记，用来提示接缝位置或布纹方向。剪口只剪进缝份内，不能剪过缝线。"
  },
  {
    term: "对位点",
    category: "纸样基础",
    symbol: "+",
    visual: "match",
    visualCaption: "缝合时让两层布上的标记对齐。",
    keywords: "定位点 合印 对齐标记",
    definition: "纸样上标出的对应位置。缝合时让两片布的对位点相遇，帮助接缝长度和部位对齐。"
  },
  {
    term: "锁边",
    category: "缝制动作",
    symbol: "≋",
    visual: "overcast",
    visualCaption: "线迹包住单层布边，减少脱散。",
    keywords: "包边 防脱散 布边处理",
    definition: "用线迹包住布料毛边，防止纱线脱散；可用锁边机，也可用家用机的锁边线迹。"
  },
  {
    term: "包缝",
    category: "缝纫机",
    symbol: "⌑",
    visual: "overlock",
    visualCaption: "包缝机处理两层布边，也可同时连接布片。",
    keywords: "拷边 四线  overlock",
    definition: "常指用包缝机同时修整并包住布边，有些做法还能顺便连接两片布。不同教程可能把“包缝”和“锁边”混着叫。"
  },
  {
    term: "布纹线",
    category: "纸样基础",
    symbol: "↕",
    visual: "grain-vertical",
    visualCaption: "纸样上的箭头通常要顺着布纹方向摆放。",
    keywords: "布纹 直丝线 经向 grainline",
    definition: "纸样上表示布料纹理方向的线。排料时要按箭头方向对准布边或布纹，避免裁片变形。"
  },
  {
    term: "对折裁",
    category: "纸样基础",
    symbol: "⌁",
    keywords: "对折布料 折边裁 剪一半",
    definition: "把布料沿指定折边对齐后裁剪，使纸样左右对称。纸样标注折边的一侧不能再加出缝份。"
  },
  {
    term: "裁 1 片 / 裁 2 片",
    category: "纸样基础",
    symbol: "×",
    keywords: "裁片数量 左右对称 一正一反",
    definition: "表示这个裁片需要裁剪的数量。裁 2 片时通常要注意一片正向、一片反向，左右不能裁成同一边。"
  },
  {
    term: "前中线 / 后中线",
    category: "纸样基础",
    symbol: "│",
    keywords: "前中 后中 中心线 对襟",
    definition: "衣物前面或后面的中心位置，常用于对齐纸样、确定开口、扣位和左右对称。"
  },
  {
    term: "扣位",
    category: "纸样基础",
    symbol: "○",
    visual: "match",
    visualCaption: "扣位要在左右对应位置对齐后再固定。",
    keywords: "纽扣 按扣 扣眼 扣子位置",
    definition: "纸样上标出的纽扣、按扣或扣眼位置。安装前应先核对左右前片和开合方向。"
  },
  {
    term: "校准框",
    category: "纸样基础",
    symbol: "□",
    keywords: "打印校准 比例尺 测量框",
    definition: "纸样上的标准尺寸方框或线段。打印后先测量它是否符合标注，再裁剪整张纸样，避免比例错误。"
  },
  {
    term: "表布",
    category: "面料辅料",
    symbol: "▣",
    keywords: "面布 外层布 主布",
    definition: "成品最外层能看到的面料。选择时要考虑厚度、耐磨性和是否适合贴布、绣花等装饰。"
  },
  {
    term: "里布",
    category: "面料辅料",
    symbol: "▤",
    keywords: "内衬 内里 lining",
    definition: "缝在成品内侧的面料，用来遮住缝份、改善穿着触感或帮助成品定型。"
  },
  {
    term: "铺棉 / 夹棉",
    category: "面料辅料",
    symbol: "≈",
    keywords: "棉 花棉 填充 保暖",
    definition: "夹在表布和里布之间的保暖层。厚度会影响成品大小、手感和缝纫机的通过难度。"
  },
  {
    term: "粘合衬",
    category: "面料辅料",
    symbol: "—",
    keywords: "衬布 粘衬 烫衬 加固",
    definition: "通过熨烫粘附在布料反面的加固材料，用来增加挺度或稳定容易变形的部位。"
  },
  {
    term: "正面 / 反面",
    category: "面料基础",
    symbol: "↔",
    keywords: "布面 反面 布料正反",
    definition: "正面是成品朝外的一面，反面是朝内或贴着缝份的一面。裁剪和缝合前要先确认标记方向。"
  },
  {
    term: "回针",
    category: "缝制动作",
    symbol: "↩",
    keywords: "倒针 加固 起针 收针",
    definition: "在缝线开头和结尾倒回几针，把线迹固定住，减少接缝开裂。"
  },
  {
    term: "疏缝",
    category: "缝制动作",
    symbol: "- -",
    keywords: "假缝 定位 粗针距",
    definition: "用较长针距做的临时缝线，用于定位、试穿或固定多层布料，确认无误后再拆除或用正式线迹覆盖。"
  },
  {
    term: "压线",
    category: "缝制动作",
    symbol: "═",
    keywords: "明线 装饰线 固定线",
    definition: "沿接缝或边缘再缝一道明线，用来固定缝份、加强结构或形成装饰效果。"
  },
  {
    term: "翻面",
    category: "缝制动作",
    symbol: "↪",
    keywords: "翻到正面 翻转 裁片翻面",
    definition: "把缝合后藏在里面的布料从预留口翻到正面。翻之前通常要修剪缝份并在弧线处剪牙口。"
  },
  {
    term: "修剪缝份",
    category: "缝制动作",
    symbol: "✂",
    keywords: "剪缝份 剪窄缝份 减少厚度",
    definition: "缝合后适当剪窄或打薄缝份，减少翻面后的厚度；不能剪到实际缝线。"
  },
  {
    term: "梯形针 / 藏针",
    category: "缝制动作",
    symbol: "⋈",
    keywords: "手缝 隐形缝 合口 收口",
    definition: "用于关闭返口的手缝方法，线迹尽量藏在边缘内侧，适合玩偶、帽子和有里布的成品收口。"
  },
  {
    term: "针距",
    category: "缝纫机",
    symbol: "···",
    keywords: "针脚长度 机缝长度 stitch length",
    definition: "相邻针脚之间的长度。普通拼缝、厚布和疏缝通常需要不同针距，先在废布上试缝。"
  },
  {
    term: "线张力",
    category: "缝纫机",
    symbol: "↕",
    keywords: "面线 底线 张力调节 线迹",
    definition: "面线和底线相互拉扯的力度。线迹一面松、一面紧或布面起皱时，需要先检查穿线再调整张力。"
  },
  {
    term: "压脚 / 送布牙",
    category: "缝纫机",
    symbol: "⌗",
    keywords: "缝纫机 配件 送料 压布",
    definition: "压脚负责压住布料，送布牙负责带动布料前进。缝厚层或薄滑布时，压脚和送料设置会影响线迹稳定性。"
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
      ? TERMS.filter((item) => `${item.term} ${item.category} ${item.keywords} ${item.definition}`.toLowerCase().includes(query))
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
