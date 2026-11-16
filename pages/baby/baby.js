Page({
  openItem(event) {
    const item = event.currentTarget.dataset.item;
    if (item === "bib") {
      wx.navigateTo({ url: "/pages/index/index" });
    } else if (item === "sunhat") {
      wx.navigateTo({ url: "/pages/sunhat/sunhat" });
    } else if (item === "vest") {
      wx.navigateTo({ url: "/subpackages/patterns/vest/vest" });
    } else if (item === "bee-vest") {
      wx.navigateTo({ url: "/subpackages/patterns/bee-vest/bee-vest" });
    }
  }
});
