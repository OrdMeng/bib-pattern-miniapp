const ISSUES = [
  { id: "wrinkle", title: "缝合后布料起皱", tags: "起皱 送料 压脚", cause: "针距太短、上下层布料没有对齐，或缝纫时拉扯了布料。", solution: "先在废布上调整针距，缝制时只引导布料，不要用力向后拉。多层布料可以用夹子固定，必要时放慢速度。" },
  { id: "thread", title: "上线断线或跳针", tags: "断线 跳针 机针", cause: "机针、线迹或穿线状态不合适。", solution: "重新检查穿线顺序和底线安装，换一根适合布料厚度的机针，并在废布上试缝。" },
  { id: "edge", title: "布边容易脱散", tags: "脱散 毛边 锁边", cause: "裁片边缘没有及时处理，或布料本身比较松散。", solution: "用锁边线迹、包缝机或窄包边处理毛边。容易脱散的布料要减少反复拆缝。" },
  { id: "inside", title: "翻面后边角不平", tags: "翻面 边角 返口", cause: "弧线缝份太厚，或翻面前没有修剪和剪牙口。", solution: "翻面前修剪多余缝份，在弧线处剪进缝份但不要剪到缝线，翻出后用圆钝工具慢慢整理。" },
  { id: "pattern", title: "纸样尺寸不对", tags: "打印 比例 校准框", cause: "打印时选择了适合页面，或文件被二次缩放。", solution: "重新打印并选择实际大小 / 100%，先测量纸样上的校准框，再开始裁剪。" },
  { id: "match", title: "两片布对不上", tags: "对位 牙口 裁片", cause: "裁片方向、数量或对位点没有核对清楚。", solution: "把两片布的正面朝里，对齐牙口和对位点；裁 2 片时确认一片正向、一片反向。" }
];

Page({
  data: { query: "", issues: ISSUES },

  searchIssues(event) {
    const query = event.detail.value.trim().toLowerCase();
    const issues = ISSUES.filter((item) => !query || `${item.title}${item.tags}${item.cause}${item.solution}`.toLowerCase().includes(query));
    this.setData({ query, issues });
  },

  toggleIssue(event) {
    const id = event.currentTarget.dataset.id;
    const issues = this.data.issues.map((item) => ({ ...item, expanded: item.id === id ? !item.expanded : false }));
    this.setData({ issues });
  }
});
