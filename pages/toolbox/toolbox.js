const TOOLS = {
  dictionary: "/pages/dictionary/dictionary",
  pitfalls: "/pages/beginner-guide/beginner-guide",
  print: "/pages/print-guide/print-guide",
  troubleshooting: "/pages/troubleshooting/troubleshooting",
  calculator: "/pages/sewing-calculator/sewing-calculator",
  fabric: "/pages/fabric-guide/fabric-guide"
};

Page({
  openTool(event) {
    const url = TOOLS[event.currentTarget.dataset.tool];
    if (url) wx.navigateTo({ url });
  }
});
