const NEEDLES = [
  { name: "雪纺 / 欧根纱", weight: "轻薄", needle: "9 号 (65)", stitch: "1.8~2.0mm", tension: "2~3（偏松）", tip: "垫纸缝防起皱，慢速，针越细越好" },
  { name: "真丝", weight: "轻薄", needle: "9~11 号 (65/70)", stitch: "1.8~2.0mm", tension: "2~3（偏松）", tip: "细针短针距，张力调小防皱" },
  { name: "纯棉府绸 / 平纹", weight: "中等", needle: "11 号 (80)", stitch: "2.2~2.5mm", tension: "4（居中）", tip: "万能组合，练手就用它" },
  { name: "格子 / 条纹布", weight: "中等", needle: "11 号 (80)", stitch: "2.0mm", tension: "4（居中）", tip: "针距略小，让格子在缝线上对齐" },
  { name: "斜纹布（涤棉）", weight: "中等", needle: "11 号 (80)", stitch: "2.2~2.5mm", tension: "4（居中）", tip: "不易缩水，锁边可选" },
  { name: "棉麻", weight: "中等", needle: "11~14 号 (80/90)", stitch: "2.5mm", tension: "4（居中）", tip: "一定先预洗，剪完尽快锁边" },
  { name: "针织弹力布", weight: "中等", needle: "14 号 (90) 圆头针", stitch: "2.5~3.0mm", tension: "3~4", tip: "圆头针防勾丝，使用之字线迹" },
  { name: "毛毡 / 不织布", weight: "中等", needle: "14 号 (90)", stitch: "2.5~3.0mm", tension: "4（居中）", tip: "不脱散免锁边，针距放大更平整" },
  { name: "丝绒 / 灯芯绒", weight: "厚重", needle: "14 号 (90)", stitch: "3.0mm", tension: "3~4", tip: "先试缝定张力，不要熨正面" },
  { name: "帆布 / 厚棉", weight: "厚重", needle: "16 号 (100)", stitch: "2.8~3.0mm", tension: "4~5（略紧）", tip: "厚处慢速，多层先敲薄再过" },
  { name: "牛仔布", weight: "厚重", needle: "16~18 号 (100/110)", stitch: "3.0mm", tension: "4~5（略紧）", tip: "牛仔专用针，交叉厚缝垫布尾" },
  { name: "PU / 皮革", weight: "厚重", needle: "16 号 (100) 皮革针", stitch: "3.0~3.5mm", tension: "3~4", tip: "皮革针是刃口，普通针容易扯破" }
];

const FABRICS = [
  { id: "poplin", name: "纯棉府绸", en: "POPULIN · 难度 ★☆☆", weight: "中等", color: "green", definition: "织得紧实、表面平滑，不滑不弹，剪裁缝纫都比较听话，是新手第一件作品的稳妥选择。", use: "口水巾、围兜、童装、枕套、被套", meta: [["缩水率", "3~5%（要预洗）"], ["熨烫", "中高温"], ["脱散性", "普通"]], tips: ["预洗后再裁，棉布第一次下水通常会缩", "深色第一次单独洗，避免掉色", "斜裁的布边要尽早锁边"] },
  { id: "linen", name: "棉麻", en: "LINEN · 难度 ★★☆", weight: "中等", color: "orange", definition: "透气、有筋骨，越洗越软，带一点自然褶皱。比纯棉更容易散边，但整体仍然适合练手。", use: "桌旗、餐垫、围裙、夏天的小衣物", meta: [["缩水率", "5~8%（较高）"], ["熨烫", "高温·喷水"], ["脱散性", "易散"]], tips: ["最好预洗两次再裁", "皱是布料特性，不要反复硬熨", "剪完当天锁边或用之字线迹固定"] },
  { id: "canvas", name: "帆布 / 厚棉", en: "CANVAS · 难度 ★★☆", weight: "厚重", color: "brown", definition: "厚实挺括、耐用，做包袋很稳定。难点是多层叠加后机器不容易通过。", use: "托特包、收纳篮、围裙、隔热垫", meta: [["缩水率", "2~4%"], ["熨烫", "高温重压"], ["脱散性", "边缘起毛"]], tips: ["换 16 号针，厚处减速", "多层拼接处先把缝份敲薄", "边缘起毛不一定是问题，重点是缝份要固定"] },
  { id: "jersey", name: "针织弹力布", en: "JERSEY · 难度 ★★★", weight: "中等", color: "pink", definition: "有弹性、穿着舒服，但缝制时容易被拉变形。新手常见的波浪边，多半和它有关。", use: "T 恤、睡衣、弹力口水巾、婴儿帽", meta: [["缩水率", "3~5%"], ["熨烫", "中低温·隔布"], ["脱散性", "卷边+脱圈"]], tips: ["使用圆头针，防止勾断线圈", "用之字或弹力线迹，不要锁死直缝", "送布时不要拉布，让机器自己送料", "边缘容易变形时可加薄衬稳定"] },
  { id: "chiffon", name: "雪纺 / 欧根纱", en: "CHIFFON · 难度 ★★★★", weight: "轻薄", color: "cream", definition: "薄、透、滑，裁一处会牵动整片，适合想挑战自己的时候使用。", use: "飘带、发饰、内衬、纱裙", meta: [["缩水率", "0~2%（多为化纤）"], ["熨烫", "低温·隔布"], ["脱散性", "极易散"]], tips: ["裁剪时在桌面铺纸，布和纸一起剪", "先在废布上测试划粉或水消笔", "针距 1.8~2.0mm，必要时垫纸缝", "可以用法国缝把毛边藏起来"] },
  { id: "silk", name: "真丝", en: "SILK · 难度 ★★★★★", weight: "轻薄", color: "lavender", definition: "滑、贵、娇气，缝制容错很低。新手可以先从眼罩、发带等小件开始。", use: "眼罩、发带、小方巾", meta: [["缩水率", "3~5%"], ["熨烫", "低温·不喷水"], ["脱散性", "极易散"]], tips: ["按洗护说明处理，多数建议冷水手洗或干洗", "9 号针、短针距、低张力，先用废布试缝", "熨斗不喷水，垫干布低温压", "用重物压纸样，尽量不要在正面插珠针"] },
  { id: "gingham", name: "格子 / 条纹布", en: "GINGHAM · 对格难度 ★★★★", weight: "中等", color: "blue", definition: "布料本身不难缝，真正的难点是对格和对条，需要提前规划排料。", use: "餐垫、桌布、衬衫、野餐布", meta: [["缩水率", "按成分判断"], ["熨烫", "中高温"], ["脱散性", "普通"]], tips: ["买布时多留 15~20%，对格会消耗余量", "有方向感的大格要统一图案方向", "接缝处先一格一格固定，再慢速缝制"] },
  { id: "denim", name: "牛仔布", en: "DENIM · 难度 ★★★", weight: "厚重", color: "blue-deep", definition: "厚、硬、耐磨，缝起来费机器，但成品挺括有型，适合做耐用小物。", use: "束口袋、工具包、围裙、玩具", meta: [["缩水率", "2~4%"], ["熨烫", "高温重压"], ["脱散性", "不易散"]], tips: ["使用牛仔专用针，通常选 16~18 号", "四层以上交叉缝时用垫布尾辅助过厚台", "深色牛仔可能掉色，第一次单独洗"] },
  { id: "felt", name: "毛毡 / 不织布", en: "FELT · 难度 ★☆☆", weight: "中等", color: "yellow", definition: "剪完就能用，不需要锁边，是最适合新手和儿童小手作的材料之一。", use: "玩偶、钥匙包、针插、装饰小物", meta: [["缩水率", "约 0%（化纤）"], ["熨烫", "低温·垫布"], ["脱散性", "不散"]], tips: ["化纤毛毡不要高温熨，容易亮面或收缩", "适合手缝，普通棉线就可以", "厚毛毡叠缝时换 14 号针"] },
  { id: "corduroy", name: "丝绒 / 灯芯绒", en: "VELVET · 难度 ★★★★", weight: "厚重", color: "red", definition: "有倒毛方向的布料，裁片方向弄反会出现一片亮、一片暗，是最大的注意点。", use: "束口袋、发夹、抱枕、秋冬小物", meta: [["缩水率", "2~4%"], ["熨烫", "只熨背面"], ["脱散性", "普通"]], tips: ["用手摸出毛顺方向，所有裁片统一排料", "不要直接熨正面，垫绒布熨背面", "固定正面时用夹子，减少珠针留下的孔"] },
  { id: "twill", name: "斜纹布（涤棉）", en: "T/C FABRIC · 难度 ★☆☆", weight: "中等", color: "blue-gray", definition: "不易皱、不易缩水、价格友好，是不想花太多时间照料布料时的省心选择。", use: "束口袋、收纳袋、桌布、内衬", meta: [["缩水率", "约 0~2%"], ["熨烫", "中温"], ["脱散性", "不易散"]], tips: ["急着做可以不预洗，但仍建议先过一遍水", "贴身用品优先选择透气的纯棉", "卷边处可用之字线迹固定"] },
  { id: "leather", name: "PU / 皮革", en: "PU & LEATHER · 难度 ★★★★", weight: "厚重", color: "black", definition: "针孔不可逆，缝歪后不能像布料一样拆掉重来。建议从钥匙包等小件开始。", use: "钥匙包、卡包、标签牌", meta: [["缩水率", "0"], ["熨烫", "低温·隔布"], ["脱散性", "不散"]], tips: ["使用皮革针，刃口针是切穿而不是硬戳", "不用珠针，使用夹子固定", "针距放大到 3.0mm 以上，避免打孔过密", "PU 胶面不要直接熨烫"] }
];

Page({
  data: {
    filter: "全部",
    filters: ["全部", "轻薄", "中等", "厚重"],
    needleRows: NEEDLES,
    fabrics: FABRICS.map((item, index) => ({ ...item, expanded: index === 0 }))
  },

  filterFabrics(event) {
    const filter = event.currentTarget.dataset.filter;
    const fabrics = (filter === "全部" ? FABRICS : FABRICS.filter((item) => item.weight === filter)).map((item, index) => ({ ...item, expanded: index === 0 }));
    const needleRows = filter === "全部" ? NEEDLES : NEEDLES.filter((item) => item.weight === filter);
    this.setData({ filter, fabrics, needleRows });
  },

  toggleFabric(event) {
    const id = event.currentTarget.dataset.id;
    const fabrics = this.data.fabrics.map((item) => ({ ...item, expanded: item.id === id ? !item.expanded : false }));
    this.setData({ fabrics });
  }
});
